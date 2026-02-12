export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  logo: string | null;
  qrCode: string | null;
  template: CardTemplate;
  backContent: string;
  socialLinks: SocialLinks;
}

export interface CardTemplate {
  id: number | string;
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  layout: "left-aligned" | "centered" | "modern";
  backgroundImage?: string;
  pattern?: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

export interface CustomTemplate extends CardTemplate {
  category: string;
  style: string;
  preview: string;
  createdAt: string;
}

export interface TemplatePreview {
  id: number | string;
  name: string;
  category: string;
  style: string;
  preview: string;
  isCustom?: boolean;
}

export interface BrandKit {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logo: string | null;
}

export const defaultCardData: BusinessCardData = {
  name: "",
  title: "",
  company: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  logo: null,
  qrCode: null,
  template: {
    id: 1,
    name: "Moderne Minimaliste",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    accentColor: "#B87333",
    fontFamily: "sans-serif",
    layout: "left-aligned",
  },
  backContent: "",
  socialLinks: {},
};
