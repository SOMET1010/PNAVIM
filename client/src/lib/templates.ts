/**
 * Templates — 5 designs pour fonctionnaires CI
 * Moderne, Classique, Minimal, Gouvernemental, Carte Physique
 */
import type { TemplateConfig, TemplatePreview, TemplateId } from "./types";

export const templateConfigs: Record<TemplateId, TemplateConfig> = {
  moderne: {
    id: "moderne",
    name: "Moderne",
    description: "Design épuré et contemporain avec des lignes nettes",
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A2E",
    accentColor: "#0F3460",
    secondaryAccent: "#E94560",
    fontFamily: "'DM Sans', sans-serif",
    layout: "modern",
    usesNationalColors: false,
  },
  classique: {
    id: "classique",
    name: "Classique",
    description: "Élégance traditionnelle avec finitions soignées",
    backgroundColor: "#FBF8F1",
    textColor: "#2D2A26",
    accentColor: "#B87333",
    secondaryAccent: "#5C4033",
    fontFamily: "'DM Serif Display', Georgia, serif",
    layout: "left-aligned",
    usesNationalColors: false,
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Simplicité maximale, impact visuel fort",
    backgroundColor: "#FFFFFF",
    textColor: "#111111",
    accentColor: "#555555",
    fontFamily: "'DM Sans', sans-serif",
    layout: "centered",
    usesNationalColors: false,
  },
  gouvernemental: {
    id: "gouvernemental",
    name: "Gouvernemental",
    description: "Charte graphique officielle de la Côte d'Ivoire",
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A1A",
    accentColor: "#FF6B00",
    secondaryAccent: "#009E60",
    fontFamily: "'DM Sans', sans-serif",
    layout: "official",
    usesNationalColors: true,
  },
  physique: {
    id: "physique",
    name: "Carte Physique",
    description: "Format imprimable aux couleurs nationales",
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A1A",
    accentColor: "#FF6B00",
    secondaryAccent: "#009E60",
    fontFamily: "'DM Sans', sans-serif",
    layout: "print",
    usesNationalColors: true,
  },
};

export const templatePreviews: TemplatePreview[] = [
  {
    id: "moderne",
    name: "Moderne",
    description: "Design épuré et contemporain",
    icon: "Sparkles",
  },
  {
    id: "classique",
    name: "Classique",
    description: "Élégance traditionnelle",
    icon: "Crown",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simplicité maximale",
    icon: "Minus",
  },
  {
    id: "gouvernemental",
    name: "Gouvernemental",
    description: "Charte officielle CI",
    icon: "Shield",
  },
  {
    id: "physique",
    name: "Carte Physique",
    description: "Format imprimable",
    icon: "Printer",
  },
];

export const getTemplateConfig = (id: TemplateId): TemplateConfig => {
  return templateConfigs[id] || templateConfigs.moderne;
};
