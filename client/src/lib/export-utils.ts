/**
 * Export Utils — vCard, impression
 */
import type { BusinessCardData } from "./types";

/**
 * Génère un fichier vCard (.vcf) à partir des données de la carte
 */
export function generateVCard(data: BusinessCardData): string {
  const { personal, contact, socialLinks } = data;

  const nameParts = personal.fullName.trim().split(" ");
  const lastName = nameParts.length > 1 ? nameParts.pop() : "";
  const firstName = nameParts.join(" ");

  let vcard = "BEGIN:VCARD\n";
  vcard += "VERSION:3.0\n";
  vcard += `FN:${personal.fullName}\n`;
  vcard += `N:${lastName};${firstName};;;\n`;

  if (personal.title) vcard += `TITLE:${personal.title}\n`;
  if (personal.organization) vcard += `ORG:${personal.organization}\n`;
  if (contact.mobile) vcard += `TEL;TYPE=CELL:${contact.mobile}\n`;
  if (contact.landline) vcard += `TEL;TYPE=WORK:${contact.landline}\n`;
  if (contact.email) vcard += `EMAIL;TYPE=WORK:${contact.email}\n`;
  if (contact.website) vcard += `URL:${contact.website}\n`;
  if (contact.address) vcard += `ADR;TYPE=WORK:;;${contact.address};;;;\n`;
  if (socialLinks.linkedin) vcard += `X-SOCIALPROFILE;TYPE=linkedin:${socialLinks.linkedin}\n`;
  if (socialLinks.twitter) vcard += `X-SOCIALPROFILE;TYPE=twitter:${socialLinks.twitter}\n`;
  if (socialLinks.facebook) vcard += `X-SOCIALPROFILE;TYPE=facebook:${socialLinks.facebook}\n`;
  if (socialLinks.instagram) vcard += `X-SOCIALPROFILE;TYPE=instagram:${socialLinks.instagram}\n`;

  data.customFields.forEach((field) => {
    if (field.value) {
      if (field.type === "url") {
        vcard += `URL;TYPE=${field.label}:${field.value}\n`;
      } else {
        vcard += `NOTE:${field.label}: ${field.value}\n`;
      }
    }
  });

  vcard += "END:VCARD\n";
  return vcard;
}

/**
 * Télécharge le fichier vCard
 */
export function downloadVCard(data: BusinessCardData): void {
  const vcardContent = generateVCard(data);
  const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.personal.fullName || "carte-visite"}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Génère le contenu QR code (vCard format)
 */
export function generateQRContent(data: BusinessCardData): string {
  return generateVCard(data);
}

/**
 * Impression de la carte
 */
export function printCard(): void {
  window.print();
}
