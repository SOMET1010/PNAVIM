/**
 * TemplateSelector — Sélecteur visuel de templates avec miniatures réalistes
 * Design: Atelier Papetier / Mobile first / Inclusion sociale
 *
 * Affiche une prévisualisation réaliste de chaque template avec des données
 * d'exemple pré-remplies, pour que l'utilisateur puisse voir le rendu
 * avant de remplir le formulaire.
 *
 * Mobile: Carrousel horizontal swipeable
 * Desktop: Grille 5 colonnes
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Globe } from "lucide-react";
import QRCode from "react-qr-code";
import type { TemplateId } from "@/lib/types";
import { CI_COLORS } from "@/lib/types";
import { templatePreviews, templateConfigs } from "@/lib/templates";

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

// Données d'exemple pour la prévisualisation
const SAMPLE = {
  fullName: "Kouassi Aya Marie",
  title: "Directrice des Ressources Humaines",
  organization: "Ministère de la Fonction Publique",
  mobile: "07 89 45 12 34",
  email: "aya.kouassi@gouv.ci",
  address: "Abidjan, Plateau",
  initials: "K",
};

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  const [hoveredId, setHoveredId] = useState<TemplateId | null>(null);
  const templateIds: TemplateId[] = ["moderne", "classique", "minimal", "gouvernemental", "physique"];
  const currentIndex = templateIds.indexOf(selected);

  const navigateTemplate = (direction: "prev" | "next") => {
    const newIndex = direction === "prev"
      ? (currentIndex - 1 + templateIds.length) % templateIds.length
      : (currentIndex + 1) % templateIds.length;
    onSelect(templateIds[newIndex]);
  };

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-sm font-semibold text-foreground">
          Choisir un modèle
        </p>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {templateIds.length}
        </span>
      </div>

      {/* ── Mobile: Carrousel avec flèches ── */}
      <div className="md:hidden">
        {/* Carte principale agrandie */}
        <div className="relative">
          {/* Flèche gauche */}
          <button
            onClick={() => navigateTemplate("prev")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center touch-target active:scale-90 transition-transform"
            aria-label="Modèle précédent"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>

          {/* Flèche droite */}
          <button
            onClick={() => navigateTemplate("next")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center touch-target active:scale-90 transition-transform"
            aria-label="Modèle suivant"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>

          {/* Carte preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mx-8"
            >
              <div className="card-aspect w-full overflow-hidden rounded-xl shadow-lg border-2 border-primary/30">
                <MiniCardPreview templateId={selected} />
              </div>
              <div className="text-center mt-3">
                <p className="font-semibold text-base">{templateConfigs[selected].name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{templateConfigs[selected].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicateurs de points */}
        <div className="flex justify-center gap-2 mt-4">
          {templateIds.map((id) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`transition-all duration-200 rounded-full touch-target ${
                id === selected
                  ? "w-6 h-2"
                  : "w-2 h-2 opacity-40 hover:opacity-70"
              }`}
              style={{
                backgroundColor: id === selected ? CI_COLORS.orange : "#999",
              }}
              aria-label={`Modèle ${templateConfigs[id].name}`}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop: Grille 5 colonnes ── */}
      <div className="hidden md:grid md:grid-cols-5 gap-3">
        {templateIds.map((id) => {
          const config = templateConfigs[id];
          const isSelected = id === selected;
          const isHovered = id === hoveredId;

          return (
            <motion.button
              key={id}
              onClick={() => onSelect(id)}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`relative group rounded-xl overflow-hidden transition-all duration-200 text-left ${
                isSelected
                  ? "ring-2 ring-primary shadow-lg"
                  : "ring-1 ring-border hover:ring-primary/50 hover:shadow-md"
              }`}
            >
              {/* Coche de sélection */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: CI_COLORS.orange }}
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}

              {/* Miniature de la carte */}
              <div className="card-aspect w-full overflow-hidden">
                <MiniCardPreview templateId={id} />
              </div>

              {/* Nom du template */}
              <div className={`px-2.5 py-2 border-t transition-colors ${
                isSelected ? "bg-primary/5 border-primary/20" : "bg-card border-border/50"
              }`}>
                <p className={`text-xs font-semibold truncate ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}>
                  {config.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {config.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Miniature réaliste pour chaque template ──
function MiniCardPreview({ templateId }: { templateId: TemplateId }) {
  switch (templateId) {
    case "moderne":
      return <MiniModerne />;
    case "classique":
      return <MiniClassique />;
    case "minimal":
      return <MiniMinimal />;
    case "gouvernemental":
      return <MiniGouvernemental />;
    case "physique":
      return <MiniPhysique />;
    default:
      return <MiniModerne />;
  }
}

// ── Mini Template: Moderne ──
function MiniModerne() {
  return (
    <div className="w-full h-full flex" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="w-1 shrink-0" style={{ background: "linear-gradient(180deg, #0F3460, #E94560)" }} />
      <div className="flex-1 flex p-2.5 gap-2">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: "#0F3460" }}>
                {SAMPLE.initials}
              </div>
              <div>
                <p className="text-[9px] font-bold leading-tight" style={{ color: "#1A1A2E" }}>{SAMPLE.fullName}</p>
                <p className="text-[7px]" style={{ color: "#E94560" }}>Directrice RH</p>
              </div>
            </div>
            <p className="text-[7px] font-medium" style={{ color: "#0F3460" }}>Min. Fonction Publique</p>
          </div>
          <div className="space-y-0.5">
            <MiniInfoRow icon={Phone} text={`+225 ${SAMPLE.mobile}`} color="#666" />
            <MiniInfoRow icon={Mail} text={SAMPLE.email} color="#666" />
          </div>
        </div>
        <div className="flex items-end shrink-0">
          <div className="bg-white p-0.5 border border-gray-100 rounded">
            <QRCode value="https://gouv.ci" size={28} level="L" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mini Template: Classique ──
function MiniClassique() {
  return (
    <div className="w-full h-full flex flex-col p-2.5" style={{ backgroundColor: "#FBF8F1" }}>
      <div className="w-full h-px mb-2" style={{ background: "linear-gradient(90deg, #B87333, #D4A76A, #B87333)" }} />
      <div className="flex-1 flex gap-2">
        <div className="flex-1 flex flex-col">
          <div className="flex items-start gap-1.5 mb-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border" style={{ borderColor: "#B87333", color: "#B87333", backgroundColor: "#FFF8F0" }}>
              {SAMPLE.initials}
            </div>
            <div>
              <p className="text-[9px] font-bold leading-tight" style={{ color: "#2D2A26", fontFamily: "'DM Serif Display', serif" }}>{SAMPLE.fullName}</p>
              <p className="text-[7px] italic" style={{ color: "#B87333" }}>Directrice RH</p>
            </div>
          </div>
          <div className="mt-auto space-y-0.5">
            <MiniInfoRow icon={Phone} text={`+225 ${SAMPLE.mobile}`} color="#5C4033" />
            <MiniInfoRow icon={Mail} text={SAMPLE.email} color="#5C4033" />
          </div>
        </div>
        <div className="flex items-end shrink-0">
          <div className="p-0.5 rounded border" style={{ borderColor: "#D4A76A" }}>
            <QRCode value="https://gouv.ci" size={26} level="L" fgColor="#5C4033" />
          </div>
        </div>
      </div>
      <div className="w-full h-px mt-2" style={{ background: "linear-gradient(90deg, #B87333, #D4A76A, #B87333)" }} />
    </div>
  );
}

// ── Mini Template: Minimal ──
function MiniMinimal() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-3 text-center" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold bg-gray-100 text-gray-600 mb-1">
        {SAMPLE.initials}
      </div>
      <p className="text-[9px] font-bold tracking-wide uppercase" style={{ color: "#111" }}>
        {SAMPLE.fullName}
      </p>
      <div className="w-5 h-px bg-gray-300 my-1" />
      <p className="text-[7px] tracking-wider uppercase" style={{ color: "#555" }}>
        Directrice RH
      </p>
      <div className="flex gap-2 mt-1.5 text-[6px]" style={{ color: "#555" }}>
        <span>+225 07 89 45 12 34</span>
        <span>{SAMPLE.email}</span>
      </div>
      <div className="mt-1.5">
        <QRCode value="https://gouv.ci" size={22} level="L" fgColor="#333" />
      </div>
    </div>
  );
}

// ── Mini Template: Gouvernemental ──
function MiniGouvernemental() {
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Barre tricolore haut */}
      <div className="flex w-full h-1 shrink-0">
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.orange }} />
        <div className="flex-1" style={{ backgroundColor: "#FFFFFF", borderTop: "0.5px solid #eee" }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.green }} />
      </div>
      <div className="flex-1 flex p-2.5 gap-2">
        <div className="flex-1 flex flex-col">
          <div className="flex items-start gap-1.5 mb-1">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: CI_COLORS.orange }}>
              {SAMPLE.initials}
            </div>
            <div>
              <p className="text-[6px] uppercase tracking-wider font-medium" style={{ color: CI_COLORS.green }}>
                République de Côte d'Ivoire
              </p>
              <p className="text-[9px] font-bold leading-tight" style={{ color: "#1A1A1A" }}>{SAMPLE.fullName}</p>
              <p className="text-[7px] font-semibold" style={{ color: CI_COLORS.orange }}>Directrice RH</p>
            </div>
          </div>
          <p className="text-[7px] font-medium" style={{ color: CI_COLORS.green }}>Min. Fonction Publique</p>
          <div className="mt-auto space-y-0.5">
            <MiniInfoRow icon={Phone} text={`+225 ${SAMPLE.mobile}`} color="#555" />
            <MiniInfoRow icon={Mail} text={SAMPLE.email} color="#555" />
          </div>
        </div>
        <div className="flex items-end shrink-0">
          <div className="p-0.5 rounded border" style={{ borderColor: CI_COLORS.green }}>
            <QRCode value="https://gouv.ci" size={28} level="L" fgColor={CI_COLORS.green} />
          </div>
        </div>
      </div>
      {/* Barre tricolore bas */}
      <div className="flex w-full h-1 shrink-0">
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.orange }} />
        <div className="flex-1" style={{ backgroundColor: "#FFFFFF", borderBottom: "0.5px solid #eee" }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.green }} />
      </div>
    </div>
  );
}

// ── Mini Template: Carte Physique ──
function MiniPhysique() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Bande verticale tricolore gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 flex flex-col">
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.orange }} />
        <div className="flex-1" style={{ backgroundColor: "#FFFFFF", borderLeft: "0.5px solid #eee", borderRight: "0.5px solid #eee" }} />
        <div className="flex-1" style={{ backgroundColor: CI_COLORS.green }} />
      </div>
      <div className="flex-1 flex pl-4 pr-2.5 py-2.5 gap-2">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[6px] uppercase tracking-widest font-semibold" style={{ color: CI_COLORS.green }}>
              République de Côte d'Ivoire
            </p>
            <p className="text-[6px] mb-1" style={{ color: "#888" }}>Min. Fonction Publique</p>
            <p className="text-[10px] font-bold leading-tight" style={{ color: "#1A1A1A" }}>{SAMPLE.fullName}</p>
            <p className="text-[7px] font-semibold mt-0.5" style={{ color: CI_COLORS.orange }}>Directrice RH</p>
          </div>
          <div className="space-y-0.5">
            <div className="w-full h-px" style={{ backgroundColor: "#eee" }} />
            <MiniInfoRow icon={Phone} text={`+225 ${SAMPLE.mobile}`} color="#555" />
            <MiniInfoRow icon={Mail} text={SAMPLE.email} color="#555" />
            <MiniInfoRow icon={MapPin} text={SAMPLE.address} color="#555" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="p-0.5 rounded border" style={{ borderColor: "#ddd" }}>
            <QRCode value="https://gouv.ci" size={30} level="L" fgColor="#1A1A1A" />
          </div>
          <span className="text-[5px] mt-0.5 text-center" style={{ color: "#999" }}>Scanner</span>
        </div>
      </div>
    </div>
  );
}

// ── Helper: Mini info row ──
function MiniInfoRow({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      <Icon className="w-2 h-2 shrink-0" style={{ color }} />
      <span className="text-[6px] truncate" style={{ color }}>{text}</span>
    </div>
  );
}
