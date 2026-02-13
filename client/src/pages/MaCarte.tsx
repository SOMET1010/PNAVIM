import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useEffect, useState, useRef, useMemo } from "react";
import QRCode from "react-qr-code";
import {
  CreditCard, Edit3, Save, X, Share2, Download, QrCode,
  Phone, Mail, MapPin, Globe, Building2, User, Briefcase,
  LogOut, Shield, ChevronRight
} from "lucide-react";

type CardData = {
  prenom: string;
  nom: string;
  fonction: string;
  direction: string;
  organisation: string;
  telephone: string;
  telephoneFixe: string;
  adresse: string;
  siteWeb: string;
  photoUrl: string;
};

export default function MaCarte() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Vérifier le statut OTP
  const otpStatus = trpc.otp.status.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Redirect if email not verified
  useEffect(() => {
    if (isAuthenticated && otpStatus.data && !otpStatus.data.verified) {
      setLocation("/verify-email");
    }
  }, [isAuthenticated, otpStatus.data, setLocation]);

  const { data: cardData, isLoading: cardLoading, refetch } = trpc.card.getMyCard.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const [form, setForm] = useState<CardData>({
    prenom: "", nom: "", fonction: "", direction: "",
    organisation: "", telephone: "", telephoneFixe: "",
    adresse: "", siteWeb: "", photoUrl: "",
  });

  useEffect(() => {
    if (cardData) {
      setForm({
        prenom: cardData.prenom || "",
        nom: cardData.nom || "",
        fonction: cardData.fonction || "",
        direction: cardData.direction || "",
        organisation: cardData.organisation || "",
        telephone: cardData.telephone || "",
        telephoneFixe: cardData.telephoneFixe || "",
        adresse: cardData.adresse || "",
        siteWeb: cardData.siteWeb || "",
        photoUrl: cardData.photoUrl || "",
      });
    }
  }, [cardData]);

  const updateCard = trpc.card.updateMyCard.useMutation({
    onSuccess: () => {
      toast.success("Carte mise à jour avec succès");
      setIsEditing(false);
      refetch();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const handleSave = () => {
    updateCard.mutate(form);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // Format phone number for vCard
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.startsWith("+225")) return cleaned;
    if (cleaned.startsWith("225")) return "+" + cleaned;
    return "+225" + cleaned;
  };

  // Generate vCard string
  const generateVCard = () => {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${form.nom};${form.prenom};;;`,
      `FN:${form.prenom} ${form.nom}`,
    ];
    if (form.organisation) lines.push(`ORG:${form.organisation}`);
    if (form.fonction) lines.push(`TITLE:${form.fonction}`);
    if (form.telephone) lines.push(`TEL;TYPE=CELL:${formatPhone(form.telephone)}`);
    if (form.telephoneFixe) lines.push(`TEL;TYPE=WORK:${formatPhone(form.telephoneFixe)}`);
    if (user?.email) lines.push(`EMAIL;TYPE=WORK:${user.email}`);
    if (form.adresse) lines.push(`ADR;TYPE=WORK:;;${form.adresse};;;;Côte d'Ivoire`);
    if (form.siteWeb) lines.push(`URL:${form.siteWeb}`);
    if (form.photoUrl) lines.push(`PHOTO;VALUE=URI:${form.photoUrl}`);
    if (form.direction) lines.push(`NOTE:${form.direction}`);
    lines.push("END:VCARD");
    return lines.join("\r\n");
  };

  // Download vCard
  const downloadVCard = () => {
    const vcard = generateVCard();
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.prenom}_${form.nom}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Fichier vCard téléchargé");
  };

  // QR code value = vCard content for direct contact save
  const qrValue = useMemo(() => generateVCard(), [form, user?.email]);

  const hasCardData = form.prenom || form.nom;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  if (loading || cardLoading) {
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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">CarteCI</span>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setLocation("/admin")}>
              <Shield className="w-3.5 h-3.5 mr-1" />
              Admin
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Quitter
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-4 sm:py-6 max-w-lg mx-auto space-y-4">
        {/* Titre */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Ma Carte</h1>
            <p className="text-xs text-muted-foreground">
              {user?.email || "Votre carte de visite numérique"}
            </p>
          </div>
          {!isEditing ? (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="h-8">
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8">
                <X className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updateCard.isPending} className="h-8">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {updateCard.isPending ? "..." : "Enregistrer"}
              </Button>
            </div>
          )}
        </div>

        {/* Carte de visite — Prévisualisation */}
        {!isEditing && (
          <Card ref={cardRef} className="border-0 shadow-lg overflow-hidden" id="business-card">
            {/* Tricolor top */}
            <div className="h-1.5 flex">
              <div className="flex-1 bg-ci-orange" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-ci-green" />
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-4">
                {/* Photo / Initiales */}
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 overflow-hidden">
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(form.prenom?.[0] || "").toUpperCase()}{(form.nom?.[0] || "").toUpperCase()}</span>
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-base leading-tight">
                    {hasCardData ? `${form.prenom} ${form.nom}` : "Votre Nom"}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {form.fonction || "Votre fonction"}
                  </p>
                  {form.direction && (
                    <p className="text-xs text-muted-foreground">{form.direction}</p>
                  )}
                  {form.organisation && (
                    <p className="text-xs text-muted-foreground font-medium">{form.organisation}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 text-xs text-muted-foreground min-w-0 flex-1">
                  {form.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 shrink-0 text-primary" />
                      <span>{form.telephone.startsWith("+") ? form.telephone : "+225 " + form.telephone}</span>
                    </div>
                  )}
                  {form.telephoneFixe && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 shrink-0 text-ci-green" />
                      <span>{form.telephoneFixe}</span>
                    </div>
                  )}
                  {user?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 shrink-0 text-primary" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {form.adresse && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 shrink-0 text-primary" />
                      <span>{form.adresse}</span>
                    </div>
                  )}
                  {form.siteWeb && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 shrink-0 text-primary" />
                      <span className="truncate">{form.siteWeb}</span>
                    </div>
                  )}
                </div>

                {/* QR Code */}
                {hasCardData && (
                  <div className="shrink-0 bg-white p-1.5 rounded-lg">
                    <QRCode value={qrValue} size={64} level="M" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulaire d'édition */}
        {isEditing && (
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <User className="w-3 h-3" /> Prénom
                  </Label>
                  <Input
                    value={form.prenom}
                    onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                    placeholder="Aya"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <User className="w-3 h-3" /> Nom
                  </Label>
                  <Input
                    value={form.nom}
                    onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                    placeholder="Kouassi"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Fonction
                </Label>
                <Input
                  value={form.fonction}
                  onChange={e => setForm(f => ({ ...f, fonction: e.target.value }))}
                  placeholder="Chef de Service Informatique"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Direction
                </Label>
                <Input
                  value={form.direction}
                  onChange={e => setForm(f => ({ ...f, direction: e.target.value }))}
                  placeholder="DTDI - Direction de la Transformation Digitale"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Organisation
                </Label>
                <Input
                  value={form.organisation}
                  onChange={e => setForm(f => ({ ...f, organisation: e.target.value }))}
                  placeholder="ANSUT"
                  className="h-10"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Mobile
                  </Label>
                  <Input
                    value={form.telephone}
                    onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                    placeholder="07 XX XX XX XX"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Fixe
                  </Label>
                  <Input
                    value={form.telephoneFixe}
                    onChange={e => setForm(f => ({ ...f, telephoneFixe: e.target.value }))}
                    placeholder="27 XX XX XX XX"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Adresse
                </Label>
                <Input
                  value={form.adresse}
                  onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
                  placeholder="Abidjan, Plateau"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Site web
                </Label>
                <Input
                  value={form.siteWeb}
                  onChange={e => setForm(f => ({ ...f, siteWeb: e.target.value }))}
                  placeholder="https://www.ansut.ci"
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions rapides */}
        {!isEditing && hasCardData && (
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1.5"
              onClick={downloadVCard}
            >
              <Download className="w-5 h-5 text-primary" />
              <span className="text-[11px]">vCard</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1.5"
              onClick={() => setLocation("/partage")}
            >
              <Share2 className="w-5 h-5 text-ci-green" />
              <span className="text-[11px]">Partager</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1.5"
              onClick={() => {
                const printWindow = window.open("", "_blank");
                if (!printWindow) return;
                const cardEl = document.getElementById("business-card");
                if (!cardEl) return;
                printWindow.document.write(`
                  <html><head><title>Carte de visite</title>
                  <style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:Inter,sans-serif;}
                  @media print{@page{size:89mm 51mm;margin:0;}}</style></head>
                  <body>${cardEl.outerHTML}</body></html>
                `);
                printWindow.document.close();
                printWindow.print();
              }}
            >
              <QrCode className="w-5 h-5 text-ci-orange" />
              <span className="text-[11px]">Imprimer</span>
            </Button>
          </div>
        )}

        {/* Message si pas de données */}
        {!isEditing && !hasCardData && (
          <Card className="border-dashed border-2">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Edit3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Complétez votre carte</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cliquez sur "Modifier" pour renseigner vos informations professionnelles
                </p>
              </div>
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Commencer
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="px-4 py-3 text-center safe-area-bottom border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          CarteCI — ANSUT · Côte d'Ivoire
        </p>
      </footer>
    </div>
  );
}
