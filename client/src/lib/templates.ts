import type { CardTemplate, TemplatePreview } from "./types";

export const templateConfigs: Record<string, CardTemplate> = {
  "1": { id: 1, name: "Moderne Minimaliste", backgroundColor: "#FFFFFF", textColor: "#000000", accentColor: "#3B82F6", fontFamily: "sans-serif", layout: "left-aligned" },
  "2": { id: 2, name: "Classique Élégant", backgroundColor: "#F5F5DC", textColor: "#2C2C2C", accentColor: "#8B7355", fontFamily: "serif", layout: "centered" },
  "3": { id: 3, name: "Créatif Coloré", backgroundColor: "#FF6B6B", textColor: "#FFFFFF", accentColor: "#4ECDC4", fontFamily: "sans-serif", layout: "modern" },
  "4": { id: 4, name: "Tech Professionnel", backgroundColor: "#1E293B", textColor: "#FFFFFF", accentColor: "#3B82F6", fontFamily: "sans-serif", layout: "left-aligned" },
  "5": { id: 5, name: "Artistique Bold", backgroundColor: "#FFF", textColor: "#000", accentColor: "#FF6B35", fontFamily: "sans-serif", layout: "modern" },
  "6": { id: 6, name: "Corporate Sobre", backgroundColor: "#1E3A8A", textColor: "#FFFFFF", accentColor: "#60A5FA", fontFamily: "sans-serif", layout: "centered" },
  "7": { id: 7, name: "Startup Dynamique", backgroundColor: "#FFFFFF", textColor: "#000000", accentColor: "#F59E0B", fontFamily: "sans-serif", layout: "modern" },
  "8": { id: 8, name: "Luxe Premium", backgroundColor: "#000000", textColor: "#FFFFFF", accentColor: "#D4AF37", fontFamily: "serif", layout: "centered" },
  "9": { id: 9, name: "Écologique Nature", backgroundColor: "#F0FDF4", textColor: "#166534", accentColor: "#22C55E", fontFamily: "sans-serif", layout: "left-aligned" },
  "10": { id: 10, name: "Médical Propre", backgroundColor: "#EFF6FF", textColor: "#1E40AF", accentColor: "#3B82F6", fontFamily: "sans-serif", layout: "centered" },
  "11": { id: 11, name: "Octobre Rose", backgroundColor: "#FFF0F5", textColor: "#D63384", accentColor: "#FF69B4", fontFamily: "sans-serif", layout: "centered" },
  "12": { id: 12, name: "Novembre Bleu", backgroundColor: "#E6F3FF", textColor: "#1E3A8A", accentColor: "#3B82F6", fontFamily: "sans-serif", layout: "modern" },
  "13": { id: 13, name: "Saint-Valentin", backgroundColor: "#FFF5F5", textColor: "#742A2A", accentColor: "#E53E3E", fontFamily: "serif", layout: "centered" },
  "14": { id: 14, name: "Fêtes de Fin d'Année", backgroundColor: "#FEFCE8", textColor: "#713F12", accentColor: "#EAB308", fontFamily: "serif", layout: "centered" },
  "15": { id: 15, name: "Halloween", backgroundColor: "#1A202C", textColor: "#FFA500", accentColor: "#FF6B35", fontFamily: "sans-serif", layout: "modern" },
};

export const templatePreviews: TemplatePreview[] = [
  { id: 1, name: "Moderne Minimaliste", category: "Moderne", style: "Minimaliste", preview: "" },
  { id: 2, name: "Classique Élégant", category: "Classique", style: "Élégant", preview: "" },
  { id: 3, name: "Créatif Coloré", category: "Créatif", style: "Coloré", preview: "" },
  { id: 4, name: "Tech Professionnel", category: "Moderne", style: "Professionnel", preview: "" },
  { id: 5, name: "Artistique Bold", category: "Créatif", style: "Bold", preview: "" },
  { id: 6, name: "Corporate Sobre", category: "Classique", style: "Sobre", preview: "" },
  { id: 7, name: "Startup Dynamique", category: "Moderne", style: "Dynamique", preview: "" },
  { id: 8, name: "Luxe Premium", category: "Classique", style: "Premium", preview: "" },
  { id: 9, name: "Écologique Nature", category: "Créatif", style: "Nature", preview: "" },
  { id: 10, name: "Médical Propre", category: "Moderne", style: "Propre", preview: "" },
  { id: 11, name: "Octobre Rose", category: "Événementiel", style: "Solidarité", preview: "" },
  { id: 12, name: "Novembre Bleu", category: "Événementiel", style: "Masculin", preview: "" },
  { id: 13, name: "Saint-Valentin", category: "Événementiel", style: "Romantique", preview: "" },
  { id: 14, name: "Fêtes de Fin d'Année", category: "Événementiel", style: "Festif", preview: "" },
  { id: 15, name: "Halloween", category: "Événementiel", style: "Mystique", preview: "" },
];

export const categories = ["Tous", "Moderne", "Classique", "Créatif", "Événementiel"];
