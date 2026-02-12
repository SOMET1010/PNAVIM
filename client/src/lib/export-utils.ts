import type { BusinessCardData } from "./types";

export function exportToPNG(canvas: HTMLCanvasElement, filename: string) {
  try {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  } catch (error) {
    console.error("Error exporting to PNG:", error);
  }
}

export function exportToPDF(
  frontCanvas: HTMLCanvasElement,
  backCanvas: HTMLCanvasElement,
  filename: string,
) {
  try {
    const frontImgData = frontCanvas.toDataURL("image/png");
    const backImgData = backCanvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html>
<html><head><title>${filename}</title>
<style>
@page { size: 89mm 59mm; margin: 0; }
body { margin: 0; padding: 0; background: white; }
.page { width: 89mm; height: 59mm; page-break-after: always; display: flex; justify-content: center; align-items: center; position: relative; background: white; }
.page:last-child { page-break-after: auto; }
.card-content { width: 85mm; height: 55mm; position: relative; }
img { width: 100%; height: 100%; object-fit: cover; }
</style></head><body>
<div class="page"><div class="card-content"><img src="${frontImgData}" alt="Recto" /></div></div>
<div class="page"><div class="card-content"><img src="${backImgData}" alt="Verso" /></div></div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};<\/script>
</body></html>`);
      printWindow.document.close();
    }
  } catch (error) {
    console.error("Error exporting to PDF:", error);
  }
}

export function exportToVCard(data: BusinessCardData) {
  try {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TITLE:${data.title}
ORG:${data.company}
EMAIL:${data.email}
TEL:${data.phone}
URL:${data.website}
ADR:;;${data.address};;;;
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.name || "contact"}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting to vCard:", error);
  }
}
