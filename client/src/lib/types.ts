/**
 * Types — Générateur de Cartes de Visite pour Fonctionnaires CI
 * Cahier des charges : 5 templates, QR code, vCard, impression
 */

// ── Template IDs ──
export type TemplateId = "moderne" | "classique" | "minimal" | "gouvernemental" | "physique";

// ── Informations personnelles ──
export interface PersonalInfo {
  photo: string | null;        // base64 ou URL de la photo de profil
  fullName: string;            // Nom complet
  title: string;               // Fonction / Titre
  organization: string;        // Organisation / Ministère
}

// ── Coordonnées ──
export interface ContactInfo {
  mobile: string;              // Téléphone mobile (+225)
  landline: string;            // Téléphone fixe (+225)
  email: string;               // Email professionnel
  website: string;             // Site web
  address: string;             // Adresse professionnelle
}

// ── Réseaux sociaux ──
export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

// ── Champ personnalisable ──
export interface CustomField {
  id: string;
  type: "text" | "url" | "social";
  label: string;
  value: string;
  icon?: string;
}

// ── Données complètes de la carte ──
export interface BusinessCardData {
  personal: PersonalInfo;
  contact: ContactInfo;
  socialLinks: SocialLinks;
  customFields: CustomField[];
  templateId: TemplateId;
}

// ── Configuration d'un template ──
export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  secondaryAccent?: string;
  fontFamily: string;
  layout: "left-aligned" | "centered" | "modern" | "official" | "print";
  usesNationalColors: boolean;
}

// ── Aperçu template pour la galerie ──
export interface TemplatePreview {
  id: TemplateId;
  name: string;
  description: string;
  icon: string; // lucide icon name
}

// ── Couleurs nationales CI ──
export const CI_COLORS = {
  orange: "#FF6B00",
  white: "#FFFFFF",
  green: "#009E60",
} as const;

// ── Données par défaut ──
export const defaultCardData: BusinessCardData = {
  personal: {
    photo: null,
    fullName: "",
    title: "",
    organization: "",
  },
  contact: {
    mobile: "",
    landline: "",
    email: "",
    website: "",
    address: "",
  },
  socialLinks: {},
  customFields: [],
  templateId: "moderne",
};
