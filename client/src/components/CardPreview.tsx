/**
 * CardPreview — Rendu visuel des 5 templates de cartes de visite
 * Avec QR code dynamique intégré via react-qr-code
 * Templates: Moderne, Classique, Minimal, Gouvernemental, Carte Physique
 */
import QRCode from "react-qr-code";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import type { BusinessCardData, TemplateId } from "@/lib/types";
import { CI_COLORS } from "@/lib/types";
import { getTemplateConfig } from "@/lib/templates";
import { generateQRVCard } from "@/lib/export-utils";

interface CardPreviewProps {
  data: BusinessCardData;
  className?: string;
  scale?: number;
}

export default function CardPreview({ data, className = "", scale = 1 }: CardPreviewProps) {
  const config = getTemplateConfig(data.templateId);
  const qrValue = generateQRVCard(data);
  const hasData = data.personal.fullName || data.personal.title || data.personal.organization;

  const renderTemplate = () => {
    switch (data.templateId) {
      case "moderne":
        return <ModerneTemplate data={data} qrValue={qrValue} />;
      case "classique":
        return <ClassiqueTemplate data={data} qrValue={qrValue} />;
      case "minimal":
        return <MinimalTemplate data={data} qrValue={qrValue} />;
      case "gouvernemental":
        return <GouvernementalTemplate data={data} qrValue={qrValue} />;
      case "physique":
        return <PhysiqueTemplate data={data} qrValue={qrValue} />;
      default:
        return <ModerneTemplate data={data} qrValue={qrValue} />;
    }
  };

  return (
    <div
      className={`card-aspect w-full overflow-hidden rounded-xl paper-shadow-lg ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
      id="card-preview"
    >
      {renderTemplate()}
    </div>
  );
}

// ── Helper: Info row ──
function InfoRow({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-1.5" style={{ color }}>
      <Icon className="w-3 h-3 shrink-0" style={{ color }} />
      <span className="text-[10px] leading-tight truncate">{text}</span>
    </div>
  );
}

// ── Template: Moderne ──
function ModerneTemplate({ data, qrValue }: { data: BusinessCardData; qrValue: string }) {
  return (
    <div className="w-full h-full flex" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Left accent bar */}
      <div className="w-1.5 shrink-0" style={{ background: "linear-gradient(180deg, #0F3460, #E94560)" }} />

      <div className="flex-1 flex p-4 gap-3">
        {/* Left content */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Photo + Name */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              {data.personal.photo && (
                <img
                  src={data.personal.photo}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="font-bold text-sm leading-tight" style={{ color: "#1A1A2E" }}>
                  {data.personal.fullName || "Votre nom"}
                </h3>
                <p className="text-[10px] font-medium" style={{ color: "#E94560" }}>
                  {data.personal.title || "Votre fonction"}
                </p>
              </div>
            </div>
            <p className="text-[10px] font-medium mb-2" style={{ color: "#0F3460" }}>
              {data.personal.organization || "Votre organisation"}
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-1">
            <InfoRow icon={Phone} text={data.contact.mobile ? `+225 ${data.contact.mobile}` : ""} color="#555" />
            <InfoRow icon={Mail} text={data.contact.email} color="#555" />
            <InfoRow icon={Globe} text={data.contact.website} color="#555" />
            <InfoRow icon={MapPin} text={data.contact.address} color="#555" />
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-end shrink-0">
          <div className="bg-white p-1.5 rounded-lg border border-gray-100">
            <QRCode value={qrValue || "https://gouv.ci"} size={52} level="L" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Template: Classique ──
function ClassiqueTemplate({ data, qrValue }: { data: BusinessCardData; qrValue: string }) {
  return (
    <div className="w-full h-full flex flex-col p-4" style={{ backgroundColor: "#FBF8F1" }}>
      {/* Top decorative line */}
      <div className="w-full h-0.5 mb-3" style={{ background: "linear-gradient(90deg, #B87333, #D4A76A, #B87333)" }} />

      <div className="flex-1 flex gap-3">
        {/* Left: Photo + Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-start gap-2.5 mb-2">
            {data.personal.photo && (
              <img
                src={data.personal.photo}
                alt=""
                className="w-12 h-12 rounded-full object-cover border-2"
                style={{ borderColor: "#B87333" }}
              />
            )}
            <div>
              <h3 className="font-bold text-sm leading-tight" style={{ color: "#2D2A26", fontFamily: "'DM Serif Display', serif" }}>
                {data.personal.fullName || "Votre nom"}
              </h3>
              <p className="text-[10px] italic" style={{ color: "#B87333" }}>
                {data.personal.title || "Votre fonction"}
              </p>
              <p className="text-[10px]" style={{ color: "#5C4033" }}>
                {data.personal.organization || "Votre organisation"}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-auto space-y-1">
            <InfoRow icon={Phone} text={data.contact.mobile ? `+225 ${data.contact.mobile}` : ""} color="#5C4033" />
            <InfoRow icon={Mail} text={data.contact.email} color="#5C4033" />
            <InfoRow icon={Globe} text={data.contact.website} color="#5C4033" />
            <InfoRow icon={MapPin} text={data.contact.address} color="#5C4033" />
          </div>
        </div>

        {/* Right: QR */}
        <div className="flex flex-col items-center justify-end shrink-0">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#FFF8F0", border: "1px solid #D4A76A" }}>
            <QRCode value={qrValue || "https://gouv.ci"} size={50} level="L" fgColor="#5C4033" />
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="w-full h-0.5 mt-3" style={{ background: "linear-gradient(90deg, #B87333, #D4A76A, #B87333)" }} />
    </div>
  );
}

// ── Template: Minimal ──
function MinimalTemplate({ data, qrValue }: { data: BusinessCardData; qrValue: string }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-5 text-center" style={{ backgroundColor: "#FFFFFF" }}>
      {data.personal.photo && (
        <img
          src={data.personal.photo}
          alt=""
          className="w-12 h-12 rounded-full object-cover mb-2"
        />
      )}
      <h3 className="font-bold text-sm tracking-wide uppercase" style={{ color: "#111111" }}>
        {data.personal.fullName || "Votre nom"}
      </h3>
      <div className="w-8 h-px bg-gray-300 my-1.5" />
      <p className="text-[10px] tracking-wider uppercase" style={{ color: "#555555" }}>
        {data.personal.title || "Votre fonction"}
      </p>
      <p className="text-[9px] mt-0.5" style={{ color: "#888888" }}>
        {data.personal.organization}
      </p>

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-3 text-[9px]" style={{ color: "#555555" }}>
        {data.contact.mobile && <span>+225 {data.contact.mobile}</span>}
        {data.contact.email && <span>{data.contact.email}</span>}
        {data.contact.website && <span>{data.contact.website}</span>}
      </div>

      <div className="mt-2">
        <QRCode value={qrValue || "https://gouv.ci"} size={40} level="L" fgColor="#333333" />
      </div>
    </div>
  );
}

// ── Template: Gouvernemental ──
function GouvernementalTemplate({ data, qrValue }: { data: BusinessCardData; qrValue: string }) {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Top tricolor bar: Orange | White | Green */}
      <div className="flex w-full h-1.5 shrink-0">
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.orange }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.white, borderTop: "1px solid #eee" }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.green }} />
      </div>

      <div className="flex-1 flex p-4 gap-3">
        {/* Left side */}
        <div className="flex-1 flex flex-col">
          {/* Header with photo */}
          <div className="flex items-start gap-2.5 mb-2">
            {data.personal.photo ? (
              <img
                src={data.personal.photo}
                alt=""
                className="w-12 h-12 rounded-lg object-cover border"
                style={{ borderColor: CI_COLORS.orange }}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: CI_COLORS.orange }}
              >
                {(data.personal.fullName || "CI").charAt(0)}
              </div>
            )}
            <div>
              <p className="text-[8px] uppercase tracking-wider font-medium mb-0.5" style={{ color: CI_COLORS.green }}>
                République de Côte d'Ivoire
              </p>
              <h3 className="font-bold text-sm leading-tight" style={{ color: "#1A1A1A" }}>
                {data.personal.fullName || "Votre nom"}
              </h3>
              <p className="text-[10px] font-semibold" style={{ color: CI_COLORS.orange }}>
                {data.personal.title || "Votre fonction"}
              </p>
            </div>
          </div>

          <p className="text-[10px] font-medium mb-2" style={{ color: CI_COLORS.green }}>
            {data.personal.organization || "Ministère / Organisation"}
          </p>

          {/* Contact */}
          <div className="mt-auto space-y-1">
            <InfoRow icon={Phone} text={data.contact.mobile ? `+225 ${data.contact.mobile}` : ""} color="#444" />
            <InfoRow icon={Mail} text={data.contact.email} color="#444" />
            <InfoRow icon={Globe} text={data.contact.website} color="#444" />
            <InfoRow icon={MapPin} text={data.contact.address} color="#444" />
          </div>
        </div>

        {/* Right: QR */}
        <div className="flex flex-col items-center justify-end shrink-0">
          <div className="p-1.5 rounded-lg bg-white border" style={{ borderColor: CI_COLORS.green }}>
            <QRCode value={qrValue || "https://gouv.ci"} size={52} level="L" fgColor={CI_COLORS.green} />
          </div>
        </div>
      </div>

      {/* Bottom tricolor bar */}
      <div className="flex w-full h-1.5 shrink-0">
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.orange }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.white, borderBottom: "1px solid #eee" }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.green }} />
      </div>
    </div>
  );
}

// ── Template: Carte Physique (imprimable) ──
function PhysiqueTemplate({ data, qrValue }: { data: BusinessCardData; qrValue: string }) {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Left vertical tricolor stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col">
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.orange }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.white, borderLeft: "1px solid #eee", borderRight: "1px solid #eee" }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.green }} />
      </div>

      <div className="flex-1 flex pl-5 pr-4 py-4 gap-3">
        {/* Main content */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Header */}
          <div>
            <p className="text-[7px] uppercase tracking-widest font-semibold mb-1" style={{ color: CI_COLORS.green }}>
              République de Côte d'Ivoire
            </p>
            <p className="text-[8px] mb-2" style={{ color: "#888" }}>
              {data.personal.organization || "Ministère / Organisation"}
            </p>

            <div className="flex items-center gap-2.5">
              {data.personal.photo && (
                <img
                  src={data.personal.photo}
                  alt=""
                  className="w-14 h-14 rounded object-cover border"
                  style={{ borderColor: "#ddd" }}
                />
              )}
              <div>
                <h3 className="font-bold text-base leading-tight" style={{ color: "#1A1A1A" }}>
                  {data.personal.fullName || "Votre nom"}
                </h3>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: CI_COLORS.orange }}>
                  {data.personal.title || "Votre fonction"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="space-y-1 mt-2">
            <div className="w-full h-px" style={{ backgroundColor: "#eee" }} />
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
              {data.contact.mobile && (
                <div className="flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5" style={{ color: CI_COLORS.orange }} />
                  <span className="text-[9px]" style={{ color: "#444" }}>+225 {data.contact.mobile}</span>
                </div>
              )}
              {data.contact.landline && (
                <div className="flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5" style={{ color: CI_COLORS.orange }} />
                  <span className="text-[9px]" style={{ color: "#444" }}>+225 {data.contact.landline}</span>
                </div>
              )}
              {data.contact.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5" style={{ color: CI_COLORS.orange }} />
                  <span className="text-[9px] truncate" style={{ color: "#444" }}>{data.contact.email}</span>
                </div>
              )}
              {data.contact.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" style={{ color: CI_COLORS.orange }} />
                  <span className="text-[9px] truncate" style={{ color: "#444" }}>{data.contact.website}</span>
                </div>
              )}
            </div>
            {data.contact.address && (
              <div className="flex items-center gap-1 pt-0.5">
                <MapPin className="w-2.5 h-2.5" style={{ color: CI_COLORS.orange }} />
                <span className="text-[9px]" style={{ color: "#444" }}>{data.contact.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: QR Code */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="p-1.5 rounded border" style={{ borderColor: "#ddd" }}>
            <QRCode value={qrValue || "https://gouv.ci"} size={58} level="L" fgColor="#1A1A1A" />
          </div>
          <span className="text-[7px] mt-1 text-center" style={{ color: "#999" }}>Scanner pour<br />contact</span>
        </div>
      </div>
    </div>
  );
}
