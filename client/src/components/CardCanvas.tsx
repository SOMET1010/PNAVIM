import { useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import type { BusinessCardData } from "@/lib/types";

interface CardCanvasProps {
  data: BusinessCardData;
  side: "front" | "back";
  onReady?: () => void;
  className?: string;
}

const PLACEHOLDER: Partial<BusinessCardData> = {
  name: "Jean Dupont",
  title: "Directeur Marketing",
  company: "Mon Entreprise",
  email: "jean.dupont@exemple.fr",
  phone: "+33 6 12 34 56 78",
  website: "www.exemple.fr",
};

export const CardCanvas = forwardRef<HTMLCanvasElement, CardCanvasProps>(
  ({ data, side, onReady, className = "" }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    // Merge placeholder for display when fields are empty
    const displayData = useMemo(() => {
      const hasAnyData = data.name || data.title || data.company || data.email;
      if (hasAnyData) return data;
      return {
        ...data,
        name: data.name || PLACEHOLDER.name!,
        title: data.title || PLACEHOLDER.title!,
        company: data.company || PLACEHOLDER.company!,
        email: data.email || PLACEHOLDER.email!,
        phone: data.phone || PLACEHOLDER.phone!,
        website: data.website || PLACEHOLDER.website!,
      };
    }, [data]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1004;
      const height = 650;
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = displayData.template.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Background image if set
      if (displayData.template.backgroundImage) {
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
          ctx!.globalAlpha = 0.3;
          ctx!.drawImage(bgImg, 0, 0, width, height);
          ctx!.globalAlpha = 1;
          drawContent(ctx!);
        };
        bgImg.onerror = () => drawContent(ctx!);
        bgImg.src = displayData.template.backgroundImage;
      } else {
        drawContent(ctx);
      }

      function drawContent(c: CanvasRenderingContext2D) {
        c.fillStyle = displayData.template.textColor;
        const fontFamily = displayData.template.fontFamily;
        const isPlaceholder = !data.name && !data.title && !data.company && !data.email;

        let imagesToLoad = 0;
        const checkIfReady = () => {
          if (imagesToLoad === 0) onReady?.();
        };

        const drawImg = (src: string, x: number, y: number, size: number, alpha = 1) => {
          imagesToLoad++;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            c.globalAlpha = alpha;
            c.drawImage(img, x, y, size, size);
            c.globalAlpha = 1;
            imagesToLoad--;
            checkIfReady();
          };
          img.onerror = () => {
            imagesToLoad--;
            checkIfReady();
          };
          img.src = src;
        };

        // Apply placeholder opacity
        if (isPlaceholder) c.globalAlpha = 0.5;

        if (side === "front") {
          if (displayData.template.layout === "left-aligned") {
            drawLeftAligned(c, displayData, width, height, fontFamily);
          } else if (displayData.template.layout === "centered") {
            drawCentered(c, displayData, width, height, fontFamily);
          } else {
            drawModern(c, displayData, width, height, fontFamily);
          }
          c.globalAlpha = 1;
          if (displayData.logo) drawImg(displayData.logo, width - 140, 60, 80);
        } else {
          drawBack(c, displayData, width, height, fontFamily);
          c.globalAlpha = 1;
          if (displayData.qrCode) drawImg(displayData.qrCode, width / 2 - 60, height / 2 - 60, 120);
          if (displayData.logo) drawImg(displayData.logo, 50, height - 110, 60, 0.3);
        }

        c.globalAlpha = 1;
        if (imagesToLoad === 0) onReady?.();
      }
    }, [displayData, side, onReady, data]);

    return (
      <canvas
        ref={canvasRef}
        className={`w-full max-w-full h-auto border border-border/40 rounded-xl paper-shadow ${className}`}
        style={{ aspectRatio: "1004/650", maxWidth: "100%" }}
      />
    );
  },
);

CardCanvas.displayName = "CardCanvas";

function drawLeftAligned(ctx: CanvasRenderingContext2D, data: BusinessCardData, width: number, height: number, fontFamily: string) {
  const p = 60;
  let y = p + 40;

  // Accent line
  ctx.fillStyle = data.template.accentColor;
  ctx.fillRect(p, p, 100, 6);
  y += 40;

  // Name
  if (data.name) {
    ctx.font = `bold 48px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    ctx.fillText(data.name, p, y);
    y += 60;
  }

  // Title
  if (data.title) {
    ctx.font = `28px ${fontFamily}`;
    ctx.fillStyle = data.template.accentColor;
    ctx.fillText(data.title, p, y);
    y += 50;
  }

  // Company
  if (data.company) {
    ctx.font = `24px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    ctx.fillText(data.company, p, y);
    y += 80;
  }

  // Contact info
  ctx.font = `20px ${fontFamily}`;
  ctx.fillStyle = data.template.textColor;
  if (data.email) { ctx.fillText(data.email, p, y); y += 35; }
  if (data.phone) { ctx.fillText(data.phone, p, y); y += 35; }
  if (data.website) { ctx.fillText(data.website, p, y); y += 35; }
  if (data.address) {
    ctx.font = `18px ${fontFamily}`;
    const lines = data.address.split("\n");
    lines.forEach((line) => { ctx.fillText(line, p, y); y += 28; });
  }
}

function drawCentered(ctx: CanvasRenderingContext2D, data: BusinessCardData, width: number, height: number, fontFamily: string) {
  let y = height / 2 - 120;
  ctx.textAlign = "center";

  if (data.name) {
    ctx.font = `bold 48px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    ctx.fillText(data.name, width / 2, y);
    y += 60;
  }

  // Divider
  ctx.fillStyle = data.template.accentColor;
  ctx.fillRect(width / 2 - 50, y, 100, 4);
  y += 40;

  if (data.title) {
    ctx.font = `28px ${fontFamily}`;
    ctx.fillStyle = data.template.accentColor;
    ctx.fillText(data.title, width / 2, y);
    y += 50;
  }

  if (data.company) {
    ctx.font = `24px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    ctx.fillText(data.company, width / 2, y);
    y += 60;
  }

  ctx.font = `20px ${fontFamily}`;
  ctx.fillStyle = data.template.textColor;
  if (data.email) { ctx.fillText(data.email, width / 2, y); y += 35; }
  if (data.phone) { ctx.fillText(data.phone, width / 2, y); y += 35; }
  if (data.website) { ctx.fillText(data.website, width / 2, y); }

  ctx.textAlign = "left";
}

function drawModern(ctx: CanvasRenderingContext2D, data: BusinessCardData, width: number, height: number, fontFamily: string) {
  // Accent shape
  ctx.fillStyle = data.template.accentColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width * 0.4, 0);
  ctx.lineTo(width * 0.3, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  const p = width * 0.35;
  let y = 120;

  if (data.name) {
    ctx.font = `bold 52px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    ctx.fillText(data.name, p, y);
    y += 70;
  }

  if (data.title) {
    ctx.font = `30px ${fontFamily}`;
    ctx.fillStyle = data.template.accentColor;
    ctx.fillText(data.title, p, y);
    y += 55;
  }

  if (data.company) {
    ctx.font = `26px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    ctx.fillText(data.company, p, y);
    y += 90;
  }

  ctx.font = `22px ${fontFamily}`;
  ctx.fillStyle = data.template.textColor;
  if (data.email) { ctx.fillText(data.email, p, y); y += 38; }
  if (data.phone) { ctx.fillText(data.phone, p, y); y += 38; }
  if (data.website) { ctx.fillText(data.website, p, y); }
}

function drawBack(ctx: CanvasRenderingContext2D, data: BusinessCardData, width: number, height: number, fontFamily: string) {
  // Decorative circles
  ctx.fillStyle = data.template.accentColor;
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(width - 100 - i * 80, 100 + i * 60, 150, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";

  if (data.backContent) {
    const lines = data.backContent.split("\n");
    let y = height / 2 - (lines.length * 50) / 2;
    ctx.font = `28px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    lines.forEach((line) => {
      ctx.fillText(line, width / 2, y);
      y += 50;
    });
  } else if (data.company) {
    ctx.font = `bold 42px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    ctx.fillText(data.company, width / 2, height / 2 - 40);

    ctx.fillStyle = data.template.accentColor;
    ctx.fillRect(width / 2 - 80, height / 2, 160, 4);

    if (data.website) {
      ctx.font = `24px ${fontFamily}`;
      ctx.fillStyle = data.template.textColor;
      ctx.fillText(data.website, width / 2, height / 2 + 50);
    }
  } else {
    // Empty back - show template name
    ctx.font = `bold 36px ${fontFamily}`;
    ctx.fillStyle = data.template.textColor;
    ctx.globalAlpha = 0.3;
    ctx.fillText(data.template.name, width / 2, height / 2);
    ctx.globalAlpha = 1;
  }

  ctx.textAlign = "left";
}
