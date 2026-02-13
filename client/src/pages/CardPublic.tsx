import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams } from "wouter";
import { useMemo } from "react";
import QRCode from "react-qr-code";
import {
  CreditCard, Phone, Mail, MapPin, Globe, Building2,
  Download, UserX
} from "lucide-react";

export default function CardPublic() {
  const params = useParams<{ id: string }>();
  const userId = parseInt(params.id || "0");

  const { data: cardData, isLoading } = trpc.card.getPublicCard.useQuery(
    { userId },
    { enabled: userId > 0 }
  );

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.startsWith("+225")) return cleaned;
    if (cleaned.startsWith("225")) return "+" + cleaned;
    return "+225" + cleaned;
  };

  const generateVCard = () => {
    if (!cardData) return "";
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${cardData.nom || ""};${cardData.prenom || ""};;;`,
      `FN:${cardData.prenom || ""} ${cardData.nom || ""}`,
    ];
    if (cardData.organisation) lines.push(`ORG:${cardData.organisation}`);
    if (cardData.fonction) lines.push(`TITLE:${cardData.fonction}`);
    if (cardData.telephone) lines.push(`TEL;TYPE=CELL:${formatPhone(cardData.telephone)}`);
    if (cardData.telephoneFixe) lines.push(`TEL;TYPE=WORK:${formatPhone(cardData.telephoneFixe)}`);
    if (cardData.email) lines.push(`EMAIL;TYPE=WORK:${cardData.email}`);
    if (cardData.adresse) lines.push(`ADR;TYPE=WORK:;;${cardData.adresse};;;;Côte d'Ivoire`);
    if (cardData.siteWeb) lines.push(`URL:${cardData.siteWeb}`);
    if (cardData.direction) lines.push(`NOTE:${cardData.direction}`);
    lines.push("END:VCARD");
    return lines.join("\r\n");
  };

  const qrVCard = useMemo(() => generateVCard(), [cardData]);

  const downloadVCard = () => {
    const vcard = generateVCard();
    if (!vcard) return;
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cardData?.prenom || "carte"}_${cardData?.nom || ""}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto">
              <UserX className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <p className="font-semibold">Carte introuvable</p>
              <p className="text-sm text-muted-foreground mt-1">
                Cette carte de visite n'existe pas ou n'est plus active.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Tricolor bar */}
      <div className="tricolor-bar"><div /><div /><div /></div>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4">
          {/* Carte */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-1.5 flex">
              <div className="flex-1 bg-ci-orange" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-ci-green" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 overflow-hidden">
                  {cardData.photoUrl ? (
                    <img src={cardData.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>
                      {(cardData.prenom?.[0] || "").toUpperCase()}
                      {(cardData.nom?.[0] || "").toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-lg leading-tight">
                    {cardData.prenom} {cardData.nom}
                  </p>
                  <p className="text-sm text-primary font-medium">{cardData.fonction}</p>
                  {cardData.direction && (
                    <p className="text-xs text-muted-foreground">{cardData.direction}</p>
                  )}
                  {cardData.organisation && (
                    <p className="text-xs text-muted-foreground font-medium">{cardData.organisation}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 text-sm text-muted-foreground min-w-0 flex-1">
                  {cardData.telephone && (
                    <a href={`tel:${formatPhone(cardData.telephone)}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span>{cardData.telephone.startsWith("+") ? cardData.telephone : "+225 " + cardData.telephone}</span>
                    </a>
                  )}
                  {cardData.telephoneFixe && (
                    <a href={`tel:${formatPhone(cardData.telephoneFixe)}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-ci-green" />
                      <span>{cardData.telephoneFixe}</span>
                    </a>
                  )}
                  {cardData.email && (
                    <a href={`mailto:${cardData.email}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span className="truncate">{cardData.email}</span>
                    </a>
                  )}
                  {cardData.adresse && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span>{cardData.adresse}</span>
                    </div>
                  )}
                  {cardData.siteWeb && (
                    <a href={cardData.siteWeb} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                      <Globe className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span className="truncate">{cardData.siteWeb}</span>
                    </a>
                  )}
                </div>

                {/* QR Code */}
                <div className="shrink-0 bg-white p-1.5 rounded-lg shadow-sm">
                  <QRCode value={qrVCard} size={72} level="M" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton enregistrer */}
          <Button className="w-full h-12" onClick={downloadVCard}>
            <Download className="w-4 h-4 mr-2" />
            Enregistrer dans mes contacts
          </Button>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <CreditCard className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-xs font-semibold">CarteCI</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              ANSUT — Côte d'Ivoire
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
