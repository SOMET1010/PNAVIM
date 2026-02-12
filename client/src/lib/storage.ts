import type { CustomTemplate, BusinessCardData, BrandKit } from "./types";

const CUSTOM_TEMPLATES_KEY = "cardcreator_custom_templates";
const VERSION_HISTORY_KEY = "cardcreator_version_history";
const BRAND_KITS_KEY = "cardcreator_brand_kits";
const FAVORITES_KEY = "cardcreator_favorites";

// Custom Templates
export function getCustomTemplates(): CustomTemplate[] {
  try {
    const data = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCustomTemplate(template: CustomTemplate): void {
  const templates = getCustomTemplates();
  templates.unshift(template);
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
}

export function deleteCustomTemplate(id: string): void {
  const templates = getCustomTemplates().filter((t) => t.id !== id);
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
}

// Version History
interface VersionEntry {
  id: string;
  name: string;
  data: BusinessCardData;
  timestamp: string;
}

export function getVersionHistory(): VersionEntry[] {
  try {
    const data = localStorage.getItem(VERSION_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveVersion(name: string, data: BusinessCardData): void {
  const history = getVersionHistory();
  history.unshift({
    id: `v-${Date.now()}`,
    name,
    data: { ...data },
    timestamp: new Date().toISOString(),
  });
  // Keep only last 20 versions
  if (history.length > 20) history.pop();
  localStorage.setItem(VERSION_HISTORY_KEY, JSON.stringify(history));
}

// Brand Kits
export function getBrandKits(): BrandKit[] {
  try {
    const data = localStorage.getItem(BRAND_KITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBrandKit(kit: BrandKit): void {
  const kits = getBrandKits();
  const existingIndex = kits.findIndex((k) => k.id === kit.id);
  if (existingIndex >= 0) {
    kits[existingIndex] = kit;
  } else {
    kits.push(kit);
  }
  localStorage.setItem(BRAND_KITS_KEY, JSON.stringify(kits));
}

export function deleteBrandKit(id: string): void {
  const kits = getBrandKits().filter((k) => k.id !== id);
  localStorage.setItem(BRAND_KITS_KEY, JSON.stringify(kits));
}

// Favorites
export function getFavorites(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(templateId: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(templateId);
  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false; // removed
  } else {
    favorites.push(templateId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true; // added
  }
}

export function isFavorite(templateId: string): boolean {
  return getFavorites().includes(templateId);
}
