/**
 * Génération d'images Open Graph dynamiques pour les cartes de visite
 * Produit un SVG 1200×630px avec les informations de la carte
 * Le SVG est directement servable comme image/svg+xml
 */

interface OgCardData {
  prenom: string | null;
  nom: string | null;
  fonction: string | null;
  direction: string | null;
  organisation: string | null;
  email: string | null;
  telephone: string | null;
  photoUrl: string | null;
}

/**
 * Échappe les caractères spéciaux XML pour éviter les injections SVG
 */
function escapeXml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Tronque un texte à une longueur maximale
 */
function truncate(str: string | null | undefined, maxLen: number): string {
  if (!str) return "";
  return str.length > maxLen ? str.substring(0, maxLen - 1) + "…" : str;
}

/**
 * Génère un SVG Open Graph 1200×630px pour une carte de visite
 * Design : couleurs nationales CI (orange/blanc/vert), style gouvernemental
 */
export function generateOgSvg(data: OgCardData): string {
  const fullName = escapeXml(truncate(
    [data.prenom, data.nom].filter(Boolean).join(" ") || "Agent CI",
    40
  ));
  const fonction = escapeXml(truncate(data.fonction || "", 50));
  const direction = escapeXml(truncate(data.direction || "", 55));
  const organisation = escapeXml(truncate(data.organisation || "", 55));
  const email = escapeXml(truncate(data.email || "", 45));
  const telephone = escapeXml(truncate(data.telephone || "", 25));

  // Initiales pour l'avatar
  const initials = escapeXml(
    [(data.prenom || "")[0], (data.nom || "")[0]].filter(Boolean).join("").toUpperCase() || "CI"
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF8F0"/>
      <stop offset="100%" stop-color="#F0FAF5"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FF6B00"/>
      <stop offset="100%" stop-color="#009E60"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#00000020"/>
    </filter>
    <clipPath id="avatarClip">
      <rect x="80" y="180" width="100" height="100" rx="20"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Tricolor bar top -->
  <rect x="0" y="0" width="400" height="6" fill="#FF6B00"/>
  <rect x="400" y="0" width="400" height="6" fill="#FFFFFF" stroke="#E0E0E0" stroke-width="0.5"/>
  <rect x="800" y="0" width="400" height="6" fill="#009E60"/>

  <!-- Card container -->
  <rect x="50" y="50" width="1100" height="530" rx="24" fill="white" filter="url(#cardShadow)"/>

  <!-- Inner accent line -->
  <rect x="50" y="50" width="1100" height="4" rx="2" fill="url(#accentGrad)"/>

  <!-- Logo badge -->
  <rect x="80" y="80" width="48" height="48" rx="12" fill="url(#accentGrad)"/>
  <text x="104" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="white" text-anchor="middle">CI</text>
  <text x="140" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#1A1A1A" letter-spacing="0.5">CarteCI</text>
  <text x="140" y="118" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#888888">Carte de visite officielle</text>

  <!-- Avatar circle -->
  <rect x="80" y="180" width="100" height="100" rx="20" fill="#FFF0E6"/>
  <text x="130" y="242" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="#FF6B00" text-anchor="middle">${initials}</text>

  <!-- Name -->
  <text x="210" y="215" font-family="Georgia, 'Times New Roman', serif" font-size="36" font-weight="700" fill="#1A1A1A">${fullName}</text>

  <!-- Fonction -->
  <text x="210" y="250" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#FF6B00">${fonction}</text>

  <!-- Direction -->
  ${direction ? `<text x="210" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#666666">${direction}</text>` : ""}

  <!-- Organisation -->
  ${organisation ? `<text x="210" y="${direction ? 302 : 278}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#009E60">${organisation}</text>` : ""}

  <!-- Separator -->
  <line x1="80" y1="340" x2="1120" y2="340" stroke="#E8E8E8" stroke-width="1"/>

  <!-- Contact info -->
  <!-- Phone icon -->
  ${telephone ? `
  <circle cx="100" cy="380" r="16" fill="#FFF0E6"/>
  <text x="100" y="385" font-family="system-ui, sans-serif" font-size="14" fill="#FF6B00" text-anchor="middle">📞</text>
  <text x="128" y="385" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#444444">${telephone.startsWith("+") ? telephone : "+225 " + telephone}</text>
  ` : ""}

  <!-- Email icon -->
  ${email ? `
  <circle cx="100" cy="425" r="16" fill="#E6F5EE"/>
  <text x="100" y="430" font-family="system-ui, sans-serif" font-size="14" fill="#009E60" text-anchor="middle">✉</text>
  <text x="128" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#444444">${email}</text>
  ` : ""}

  <!-- QR Code hint -->
  <rect x="920" y="360" width="180" height="180" rx="16" fill="#F8F8F8" stroke="#E8E8E8" stroke-width="1"/>
  <text x="1010" y="440" font-family="system-ui, sans-serif" font-size="40" text-anchor="middle" fill="#CCCCCC">QR</text>
  <text x="1010" y="470" font-family="system-ui, -apple-system, sans-serif" font-size="11" text-anchor="middle" fill="#AAAAAA">Scannez pour</text>
  <text x="1010" y="486" font-family="system-ui, -apple-system, sans-serif" font-size="11" text-anchor="middle" fill="#AAAAAA">enregistrer</text>

  <!-- Footer -->
  <rect x="50" y="560" width="1100" height="20" rx="0" fill="#FAFAFA"/>
  <text x="600" y="575" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#AAAAAA" text-anchor="middle">ANSUT — Agence Nationale du Service Universel des Télécommunications — Côte d'Ivoire</text>

  <!-- Tricolor bar bottom -->
  <rect x="50" y="576" width="367" height="4" rx="0" fill="#FF6B00"/>
  <rect x="417" y="576" width="366" height="4" rx="0" fill="#FFFFFF" stroke="#E0E0E0" stroke-width="0.3"/>
  <rect x="783" y="576" width="367" height="4" rx="0" fill="#009E60"/>
</svg>`;
}

/**
 * Génère les métadonnées Open Graph pour une carte de visite
 */
export function generateOgMeta(data: OgCardData & { userId: number }, baseUrl: string): {
  title: string;
  description: string;
  imageUrl: string;
  cardUrl: string;
} {
  const fullName = [data.prenom, data.nom].filter(Boolean).join(" ") || "Agent CI";
  const parts = [data.fonction, data.organisation].filter(Boolean);
  const description = parts.length > 0
    ? `${fullName} — ${parts.join(" · ")} | Carte de visite officielle`
    : `${fullName} — Carte de visite officielle | CarteCI`;

  return {
    title: `${fullName} — CarteCI`,
    description,
    imageUrl: `${baseUrl}/api/og/${data.userId}`,
    cardUrl: `${baseUrl}/carte/${data.userId}`,
  };
}
