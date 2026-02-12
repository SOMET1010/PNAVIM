/**
 * Storage — Persistance localStorage
 */
import type { BusinessCardData } from "./types";
import { defaultCardData } from "./types";

const CARD_DATA_KEY = "ci-card-data";
const FAVORITES_KEY = "ci-card-favorites";

// ── Card Data ──
export function saveCardData(data: BusinessCardData): void {
  try {
    localStorage.setItem(CARD_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Erreur de sauvegarde:", e);
  }
}

export function loadCardData(): BusinessCardData {
  try {
    const stored = localStorage.getItem(CARD_DATA_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultCardData, ...parsed };
    }
  } catch (e) {
    console.error("Erreur de chargement:", e);
  }
  return { ...defaultCardData };
}

export function clearCardData(): void {
  localStorage.removeItem(CARD_DATA_KEY);
}

// ── Favorites ──
export function getFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(templateId: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(templateId);
  if (index === -1) {
    favorites.push(templateId);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return index === -1; // true if added, false if removed
}

export function isFavorite(templateId: string): boolean {
  return getFavorites().includes(templateId);
}
