import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, QrCode, X, Share2, Linkedin, Twitter, Facebook, Instagram, Github } from "lucide-react";
import { useState } from "react";
import type { BusinessCardData } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CardFormProps {
  data: BusinessCardData;
  onChange: (updates: Partial<BusinessCardData>) => void;
  activeSide: "front" | "back";
}

export function CardForm({ data, onChange, activeSide }: CardFormProps) {
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ logo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:;;${data.address};;;;\nEND:VCARD`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vCardData)}`;
      onChange({ qrCode: qrCodeUrl });
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  if (activeSide === "back") {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="backContent" className="text-sm font-medium">Contenu du verso</Label>
          <Textarea
            id="backContent"
            placeholder="Ajoutez un message, slogan, ou laissez vide pour le nom de l'entreprise"
            value={data.backContent}
            onChange={(e) => onChange({ backContent: e.target.value })}
            rows={4}
            className="text-base prevent-zoom resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Laissez vide pour afficher le nom de votre entreprise
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/60">
          <Label className="text-sm font-medium">Code QR (verso)</Label>
          <p className="text-xs text-muted-foreground">Le QR code apparaîtra au centre du verso</p>
          {data.qrCode ? (
            <div className="flex items-center gap-3">
              <img src={data.qrCode} alt="QR Code" className="w-16 h-16 border rounded-lg" />
              <Button variant="outline" size="sm" onClick={() => onChange({ qrCode: null })}>
                <X className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={generateQRCode}
              disabled={isGeneratingQR || !data.name || !data.email}
              className="w-full touch-target"
            >
              <QrCode className="h-4 w-4 mr-2" />
              {isGeneratingQR ? "Génération..." : "Générer un QR code vCard"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Required fields */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">Nom complet *</Label>
        <Input id="name" placeholder="Jean Dupont" value={data.name} onChange={(e) => onChange({ name: e.target.value })} className="text-base prevent-zoom touch-target" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Titre / Poste *</Label>
        <Input id="title" placeholder="Directeur Marketing" value={data.title} onChange={(e) => onChange({ title: e.target.value })} className="text-base prevent-zoom touch-target" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium">Entreprise *</Label>
        <Input id="company" placeholder="Mon Entreprise" value={data.company} onChange={(e) => onChange({ company: e.target.value })} className="text-base prevent-zoom touch-target" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
        <Input id="email" type="email" placeholder="jean.dupont@exemple.fr" value={data.email} onChange={(e) => onChange({ email: e.target.value })} className="text-base prevent-zoom touch-target" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
        <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" value={data.phone} onChange={(e) => onChange({ phone: e.target.value })} className="text-base prevent-zoom touch-target" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm font-medium">Site web</Label>
        <Input id="website" type="url" placeholder="www.exemple.fr" value={data.website} onChange={(e) => onChange({ website: e.target.value })} className="text-base prevent-zoom touch-target" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">Adresse</Label>
        <Textarea id="address" placeholder="123 Rue de la Paix, 75001 Paris" value={data.address} onChange={(e) => onChange({ address: e.target.value })} rows={2} className="text-base prevent-zoom resize-none" />
      </div>

      {/* Logo upload */}
      <div className="space-y-3 pt-4 border-t border-border/60">
        <Label className="text-sm font-medium">Logo</Label>
        {data.logo ? (
          <div className="flex items-center gap-3">
            <img src={data.logo} alt="Logo" className="w-14 h-14 object-contain border rounded-lg" />
            <Button variant="outline" size="sm" onClick={() => onChange({ logo: null })}>
              <X className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        ) : (
          <div>
            <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <Button variant="outline" size="sm" onClick={() => document.getElementById("logo-upload")?.click()} className="w-full touch-target">
              <Upload className="h-4 w-4 mr-2" />
              Télécharger un logo
            </Button>
          </div>
        )}
      </div>

      {/* Social links */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="social" className="border-border/60">
          <AccordionTrigger className="text-sm font-medium py-3">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Réseaux sociaux
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input placeholder="linkedin.com/in/..." value={data.socialLinks?.linkedin || ""} onChange={(e) => onChange({ socialLinks: { ...data.socialLinks, linkedin: e.target.value } })} className="text-base prevent-zoom" />
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input placeholder="@username" value={data.socialLinks?.twitter || ""} onChange={(e) => onChange({ socialLinks: { ...data.socialLinks, twitter: e.target.value } })} className="text-base prevent-zoom" />
            </div>
            <div className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input placeholder="facebook.com/..." value={data.socialLinks?.facebook || ""} onChange={(e) => onChange({ socialLinks: { ...data.socialLinks, facebook: e.target.value } })} className="text-base prevent-zoom" />
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input placeholder="@username" value={data.socialLinks?.instagram || ""} onChange={(e) => onChange({ socialLinks: { ...data.socialLinks, instagram: e.target.value } })} className="text-base prevent-zoom" />
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input placeholder="github.com/..." value={data.socialLinks?.github || ""} onChange={(e) => onChange({ socialLinks: { ...data.socialLinks, github: e.target.value } })} className="text-base prevent-zoom" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
