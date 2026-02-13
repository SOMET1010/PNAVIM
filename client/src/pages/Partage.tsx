import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import {
  ArrowLeft, Copy, Share2, MessageCircle, Mail,
  QrCode, Download, CreditCard, X, Check
} from "lucide-react";

export default function Partage() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showQRFull, setShowQRFull] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  const { data: cardData, isLoading } = trpc.card.getMyCard.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Format phone number for vCard
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.startsWith("+225")) return cleaned;
    if (cleaned.startsWith("225")) return "+" + cleaned;
    return "+225" + cleaned;
  };

  // Generate vCard string
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

  const shareUrl = useMemo(() => {
    if (!cardData?.id) return "";
    return `${window.location.origin}/carte/${cardData.id}`;
  }, [cardData?.id]);

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
    toast.success("Fichier vCard téléchargé");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Lien copié dans le presse-papier");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const shareWhatsApp = () => {
    const text = `Voici ma carte de visite professionnelle : ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareEmail = () => {
    const subject = `Carte de visite - ${cardData?.prenom || ""} ${cardData?.nom || ""}`;
    const body = `Bonjour,\n\nVoici ma carte de visite professionnelle :\n${shareUrl}\n\nCordialement,\n${cardData?.prenom || ""} ${cardData?.nom || ""}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Carte de visite - ${cardData?.prenom} ${cardData?.nom}`,
          text: `Carte de visite professionnelle de ${cardData?.prenom} ${cardData?.nom}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      copyLink();
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Tricolor bar */}
      <div className="tricolor-bar"><div /><div /><div /></div>

      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-border">
        <Button variant="ghost" size="sm" className="h-8 -ml-2" onClick={() => setLocation("/ma-carte")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <CreditCard className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Partager</span>
        </div>
        <div className="w-16" /> {/* Spacer */}
      </header>

      <main className="flex-1 container py-4 sm:py-6 max-w-lg mx-auto space-y-4">
        {/* QR Code principal */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-center">
              Scannez pour enregistrer le contact
            </p>
            <div
              className="bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowQRFull(true)}
            >
              <QRCode value={qrVCard || "https://carteci.ci"} size={180} level="M" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {cardData?.prenom} {cardData?.nom}
              {cardData?.fonction && <><br />{cardData.fonction}</>}
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowQRFull(true)}>
              <QrCode className="w-3.5 h-3.5 mr-1.5" />
              Agrandir le QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Lien de partage */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Lien de votre carte</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-xs truncate flex items-center">
                {shareUrl || "Complétez votre carte d'abord"}
              </div>
              <Button size="sm" variant="outline" className="h-9 shrink-0" onClick={copyLink} disabled={!shareUrl}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Options de partage */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={shareWhatsApp}
          >
            <MessageCircle className="w-6 h-6 text-green-600" />
            <span className="text-xs font-medium">WhatsApp</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={shareEmail}
          >
            <Mail className="w-6 h-6 text-primary" />
            <span className="text-xs font-medium">Email</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={downloadVCard}
          >
            <Download className="w-6 h-6 text-ci-green" />
            <span className="text-xs font-medium">vCard (.vcf)</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={shareNative}
          >
            <Share2 className="w-6 h-6 text-ci-orange" />
            <span className="text-xs font-medium">Partager...</span>
          </Button>
        </div>
      </main>

      {/* QR Code plein écran */}
      {showQRFull && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => setShowQRFull(false)}
          >
            <X className="w-5 h-5" />
          </Button>
          <QRCode value={qrVCard || "https://carteci.ci"} size={280} level="M" />
          <div className="mt-6 text-center space-y-1">
            <p className="font-semibold">{cardData?.prenom} {cardData?.nom}</p>
            {cardData?.fonction && <p className="text-sm text-muted-foreground">{cardData.fonction}</p>}
            {cardData?.organisation && <p className="text-sm text-muted-foreground">{cardData.organisation}</p>}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Scannez pour enregistrer dans votre répertoire
          </p>
        </div>
      )}
    </div>
  );
}
