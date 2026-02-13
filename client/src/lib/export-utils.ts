/**
 * Export Utils — vCard, QR code, PNG, PDF, impression
 * 
 * Fonctionnalités clés :
 * - vCard 3.0 avec préfixe +225 pour les numéros ivoiriens
 * - QR code optimisé (vCard compact) pour enregistrement direct dans le répertoire
 * - Export PNG haute résolution (300 DPI)
 * - Export PDF format carte de visite (89×59mm)
 */
import type { BusinessCardData } from "./types";

// ── Helpers ──

/**
 * Formate un numéro de téléphone ivoirien avec le préfixe international
 * Entrée: "07 89 45 12 34" → Sortie: "+22507894512 34"
 */
function formatPhoneCI(phone: string): string {
  if (!phone) return "";
  // Nettoyer le numéro (garder uniquement les chiffres)
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  // Si le numéro commence déjà par 225, ne pas doubler
  if (digits.startsWith("225")) return `+${digits}`;
  return `+225${digits}`;
}

/**
 * Nettoie le nom de fichier pour éviter les caractères spéciaux
 */
function sanitizeFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 50);
}

// ── vCard ──

/**
 * Génère un fichier vCard 3.0 complet à partir des données de la carte.
 * Inclut le préfixe +225 pour tous les numéros de téléphone.
 * Compatible avec iOS, Android, et tous les lecteurs de contacts.
 */
export function generateVCard(data: BusinessCardData): string {
  const { personal, contact, socialLinks } = data;

  // Séparer nom/prénom pour le champ N:
  const nameParts = personal.fullName.trim().split(" ");
  const lastName = nameParts.length > 1 ? nameParts.pop() : personal.fullName;
  const firstName = nameParts.length > 0 ? nameParts.join(" ") : "";

  let vcard = "BEGIN:VCARD\r\n";
  vcard += "VERSION:3.0\r\n";
  vcard += `FN:${personal.fullName}\r\n`;
  vcard += `N:${lastName};${firstName};;;\r\n`;

  if (personal.title) vcard += `TITLE:${personal.title}\r\n`;
  if (personal.organization) vcard += `ORG:${personal.organization}\r\n`;

  // Téléphones avec préfixe +225
  if (contact.mobile) {
    vcard += `TEL;TYPE=CELL:${formatPhoneCI(contact.mobile)}\r\n`;
  }
  if (contact.landline) {
    vcard += `TEL;TYPE=WORK:${formatPhoneCI(contact.landline)}\r\n`;
  }

  if (contact.email) vcard += `EMAIL;TYPE=WORK:${contact.email}\r\n`;
  if (contact.website) vcard += `URL:${contact.website}\r\n`;
  if (contact.address) vcard += `ADR;TYPE=WORK:;;${contact.address};;;Côte d'Ivoire;\r\n`;

  // Réseaux sociaux
  if (socialLinks.linkedin) vcard += `X-SOCIALPROFILE;TYPE=linkedin:${socialLinks.linkedin}\r\n`;
  if (socialLinks.twitter) vcard += `X-SOCIALPROFILE;TYPE=twitter:${socialLinks.twitter}\r\n`;
  if (socialLinks.facebook) vcard += `X-SOCIALPROFILE;TYPE=facebook:${socialLinks.facebook}\r\n`;
  if (socialLinks.instagram) vcard += `X-SOCIALPROFILE;TYPE=instagram:${socialLinks.instagram}\r\n`;

  // Champs personnalisés
  data.customFields.forEach((field) => {
    if (field.value) {
      if (field.type === "url") {
        vcard += `URL;TYPE=${field.label}:${field.value}\r\n`;
      } else {
        vcard += `NOTE:${field.label}: ${field.value}\r\n`;
      }
    }
  });

  vcard += "END:VCARD\r\n";
  return vcard;
}

/**
 * Génère un vCard compact optimisé pour le QR code.
 * Le QR code a une capacité limitée (~2953 octets en mode byte).
 * On garde uniquement les champs essentiels pour l'enregistrement dans le répertoire.
 */
export function generateQRVCard(data: BusinessCardData): string {
  const { personal, contact } = data;

  const nameParts = personal.fullName.trim().split(" ");
  const lastName = nameParts.length > 1 ? nameParts.pop() : personal.fullName;
  const firstName = nameParts.length > 0 ? nameParts.join(" ") : "";

  let vcard = "BEGIN:VCARD\r\n";
  vcard += "VERSION:3.0\r\n";
  vcard += `FN:${personal.fullName}\r\n`;
  vcard += `N:${lastName};${firstName};;;\r\n`;

  if (personal.title) vcard += `TITLE:${personal.title}\r\n`;
  if (personal.organization) vcard += `ORG:${personal.organization}\r\n`;

  // Téléphones avec préfixe +225
  if (contact.mobile) {
    vcard += `TEL;TYPE=CELL:${formatPhoneCI(contact.mobile)}\r\n`;
  }
  if (contact.landline) {
    vcard += `TEL;TYPE=WORK:${formatPhoneCI(contact.landline)}\r\n`;
  }

  if (contact.email) vcard += `EMAIL:${contact.email}\r\n`;
  if (contact.address) vcard += `ADR:;;${contact.address};;;;\r\n`;

  vcard += "END:VCARD\r\n";
  return vcard;
}

/**
 * Télécharge le fichier vCard (.vcf)
 * Sur mobile, le téléphone propose automatiquement d'ajouter le contact au répertoire
 */
export function downloadVCard(data: BusinessCardData): void {
  const vcardContent = generateVCard(data);
  const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(data.personal.fullName || "carte-visite")}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Impression de la carte
 */
export function printCard(): void {
  window.print();
}

// ── Export PNG ──

/**
 * Capture le contenu HTML de la carte en canvas haute résolution
 */
async function captureCardAsCanvas(elementId: string = "card-preview"): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas-pro");

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Élément de prévisualisation introuvable");
  }

  // Dimensions standard carte de visite : 89mm × 59mm à 300 DPI
  const dpi = 300;
  const mmToInch = 1 / 25.4;
  const cardWidthPx = Math.round(89 * mmToInch * dpi);
  const cardHeightPx = Math.round(59 * mmToInch * dpi);

  const elementRect = element.getBoundingClientRect();
  const scaleX = cardWidthPx / elementRect.width;
  const scaleY = cardHeightPx / elementRect.height;
  const scale = Math.max(scaleX, scaleY);

  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#FFFFFF",
    width: elementRect.width,
    height: elementRect.height,
    logging: false,
    removeContainer: true,
  });

  return canvas;
}

/**
 * Exporte la carte de visite en PNG haute résolution (300 DPI)
 */
export async function exportAsPNG(
  data: BusinessCardData,
  onProgress?: (status: string) => void
): Promise<void> {
  try {
    onProgress?.("Préparation de l'image...");
    const canvas = await captureCardAsCanvas();

    onProgress?.("Génération du fichier PNG...");
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Échec de la conversion en PNG"));
        },
        "image/png",
        1.0
      );
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = sanitizeFileName(data.personal.fullName || "carte-visite");
    link.download = `${fileName}_carte-visite.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onProgress?.("Terminé !");
  } catch (error) {
    console.error("Erreur export PNG:", error);
    throw new Error("Impossible de générer l'image PNG. Veuillez réessayer.");
  }
}

// ── Export PDF ──

/**
 * Exporte la carte de visite en PDF haute résolution (300 DPI)
 * Format carte de visite standard : 89mm × 59mm
 */
export async function exportAsPDF(
  data: BusinessCardData,
  onProgress?: (status: string) => void
): Promise<void> {
  try {
    onProgress?.("Préparation du PDF...");
    const canvas = await captureCardAsCanvas();

    onProgress?.("Génération du fichier PDF...");
    const { jsPDF } = await import("jspdf");

    // PDF au format carte de visite (89mm × 59mm) en paysage
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [89, 59],
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    pdf.addImage(imgData, "PNG", 0, 0, 89, 59);

    // Page 2 : instructions d'impression
    pdf.addPage([210, 297], "portrait");
    pdf.setFontSize(14);
    pdf.setTextColor(50, 50, 50);
    pdf.text("Carte de visite — Instructions d'impression", 105, 30, { align: "center" });

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const instructions = [
      `Nom : ${data.personal.fullName || "Non renseigné"}`,
      `Fonction : ${data.personal.title || "Non renseigné"}`,
      `Organisation : ${data.personal.organization || "Non renseigné"}`,
      "",
      "Format : 89 x 59 mm (standard international)",
      "Résolution : 300 DPI (qualité impression professionnelle)",
      "",
      "Conseils d'impression :",
      "  - Utilisez du papier cartonné 300-350 g/m²",
      "  - Impression recto en couleur",
      "  - Découpe au massicot pour un résultat net",
      "",
      `Généré par CarteCI — ${new Date().toLocaleDateString("fr-FR")}`,
    ];
    instructions.forEach((line, i) => {
      pdf.text(line, 30, 50 + i * 7);
    });

    // Aperçu centré sur la page A4
    const previewWidth = 89 * 1.5;
    const previewHeight = 59 * 1.5;
    const previewX = (210 - previewWidth) / 2;
    pdf.addImage(imgData, "PNG", previewX, 150, previewWidth, previewHeight);

    pdf.setDrawColor(200, 200, 200);
    pdf.setLineDashPattern([2, 2], 0);
    pdf.rect(previewX, 150, previewWidth, previewHeight);

    const fileName = sanitizeFileName(data.personal.fullName || "carte-visite");
    pdf.save(`${fileName}_carte-visite.pdf`);

    onProgress?.("Terminé !");
  } catch (error) {
    console.error("Erreur export PDF:", error);
    throw new Error("Impossible de générer le PDF. Veuillez réessayer.");
  }
}
