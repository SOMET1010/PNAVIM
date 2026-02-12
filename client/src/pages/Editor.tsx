/**
 * Editor — Page principale de l'éditeur mobile first
 * Flux : Sélection visuelle de template → Formulaire + Prévisualisation → Actions
 * Design: Inclusion sociale, simplicité, accessibilité
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download, Printer, Eye, Edit3,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import CardForm from "@/components/CardForm";
import CardPreview from "@/components/CardPreview";
import TemplateSelector from "@/components/TemplateSelector";
import { saveCardData, loadCardData, clearCardData } from "@/lib/storage";
import { downloadVCard, printCard } from "@/lib/export-utils";
import { defaultCardData } from "@/lib/types";
import type { BusinessCardData, TemplateId } from "@/lib/types";

export default function Editor() {
  const [cardData, setCardData] = useState<BusinessCardData>(() => {
    const saved = loadCardData();
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get("template");
    if (templateParam && ["moderne", "classique", "minimal", "gouvernemental", "physique"].includes(templateParam)) {
      return { ...saved, templateId: templateParam as TemplateId };
    }
    return saved;
  });
  const [activeView, setActiveView] = useState<"form" | "preview">("form");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => saveCardData(cardData), 500);
    return () => clearTimeout(timer);
  }, [cardData]);

  const handleDataChange = (newData: BusinessCardData) => {
    setCardData(newData);
  };

  const handleTemplateChange = (templateId: TemplateId) => {
    setCardData((prev) => ({ ...prev, templateId }));
  };

  const handleDownloadVCard = () => {
    if (!cardData.personal.fullName) {
      toast.error("Veuillez saisir au moins votre nom");
      return;
    }
    downloadVCard(cardData);
    toast.success("Fichier vCard téléchargé !");
  };

  const handlePrint = () => {
    printCard();
  };

  const handleReset = () => {
    if (confirm("Voulez-vous vraiment réinitialiser tous les champs ?")) {
      setCardData({ ...defaultCardData });
      clearCardData();
      toast.success("Formulaire réinitialisé");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* ── Template Selector visuel ── */}
        <div className="border-b border-border bg-card/30">
          <div className="container py-4">
            {/* Toggle pour afficher/masquer le sélecteur complet */}
            <button
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="w-full flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-border shadow-sm shrink-0">
                  <TemplateThumbnail templateId={cardData.templateId} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    Modèle : <span style={{ color: "#FF6B00" }}>{getTemplateName(cardData.templateId)}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Appuyez pour changer de modèle
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showTemplateSelector ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </button>

            {/* Sélecteur visuel dépliable */}
            <motion.div
              initial={false}
              animate={{
                height: showTemplateSelector ? "auto" : 0,
                opacity: showTemplateSelector ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <TemplateSelector
                  selected={cardData.templateId}
                  onSelect={(id) => {
                    handleTemplateChange(id);
                    // Sur mobile, fermer le sélecteur après choix
                    if (window.innerWidth < 768) {
                      setTimeout(() => setShowTemplateSelector(false), 300);
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile view toggle */}
        <div className="md:hidden border-b border-border bg-card/30">
          <div className="container flex gap-1 py-2">
            <button
              onClick={() => setActiveView("form")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors touch-target ${
                activeView === "form"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Formulaire
            </button>
            <button
              onClick={() => setActiveView("preview")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors touch-target ${
                activeView === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Eye className="w-4 h-4" />
              Aperçu
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 container py-4 md:py-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Form */}
            <div className={`md:w-1/2 lg:w-2/5 ${activeView === "preview" ? "hidden md:block" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold">Vos informations</h2>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
              </div>
              <CardForm data={cardData} onChange={handleDataChange} />
            </div>

            {/* Preview */}
            <div className={`md:w-1/2 lg:w-3/5 ${activeView === "form" ? "hidden md:block" : ""}`}>
              <div className="md:sticky md:top-20">
                <h2 className="font-serif text-xl font-bold mb-4">Aperçu de votre carte</h2>
                <motion.div
                  key={cardData.templateId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardPreview data={cardData} />
                </motion.div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleDownloadVCard} className="touch-target" size="lg">
                      <Download className="w-5 h-5 mr-2" />
                      Télécharger vCard
                    </Button>
                    <Button variant="outline" onClick={handlePrint} className="touch-target" size="lg">
                      <Printer className="w-5 h-5 mr-2" />
                      Imprimer
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Le QR code contient vos informations de contact au format vCard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile bottom action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 safe-area-bottom z-40">
        <div className="flex gap-2">
          <Button onClick={handleDownloadVCard} className="flex-1 touch-target" size="lg">
            <Download className="w-5 h-5 mr-2" />
            vCard
          </Button>
          <Button variant="outline" onClick={handlePrint} className="touch-target" size="lg">
            <Printer className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #card-preview, #card-preview * { visibility: visible; }
          #card-preview {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 89mm;
            height: 59mm;
            box-shadow: none;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}

// ── Miniature rapide pour le bouton toggle ──
function TemplateThumbnail({ templateId }: { templateId: TemplateId }) {
  const colors: Record<TemplateId, { bg: string; accent: string; text: string }> = {
    moderne: { bg: "#FFFFFF", accent: "#0F3460", text: "#1A1A2E" },
    classique: { bg: "#FBF8F1", accent: "#B87333", text: "#2D2A26" },
    minimal: { bg: "#FFFFFF", accent: "#555555", text: "#111111" },
    gouvernemental: { bg: "#FFFFFF", accent: "#FF6B00", text: "#009E60" },
    physique: { bg: "#FFFFFF", accent: "#FF6B00", text: "#009E60" },
  };
  const c = colors[templateId];
  const isCI = templateId === "gouvernemental" || templateId === "physique";

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: c.bg }}>
      {isCI && (
        <div className="flex w-full h-0.5 shrink-0">
          <div className="flex-1" style={{ backgroundColor: "#FF6B00" }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ backgroundColor: "#009E60" }} />
        </div>
      )}
      <div className="flex-1 flex items-center justify-center p-1">
        <div className="w-4 h-4 rounded-sm flex items-center justify-center text-[6px] font-bold text-white" style={{ backgroundColor: c.accent }}>
          K
        </div>
      </div>
      {isCI && (
        <div className="flex w-full h-0.5 shrink-0">
          <div className="flex-1" style={{ backgroundColor: "#FF6B00" }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ backgroundColor: "#009E60" }} />
        </div>
      )}
    </div>
  );
}

function getTemplateName(id: TemplateId): string {
  const names: Record<TemplateId, string> = {
    moderne: "Moderne",
    classique: "Classique",
    minimal: "Minimal",
    gouvernemental: "Gouvernemental",
    physique: "Carte Physique",
  };
  return names[id];
}
