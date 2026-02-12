/**
 * Editor — Page principale de l'éditeur mobile first
 * Formulaire + Prévisualisation + Actions (vCard, impression)
 * Sélection de template en haut
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download, Printer, Eye, Edit3,
  Sparkles, Crown, Minus, Shield, Printer as PrinterIcon,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import CardForm from "@/components/CardForm";
import CardPreview from "@/components/CardPreview";
import { templatePreviews } from "@/lib/templates";
import { saveCardData, loadCardData, clearCardData } from "@/lib/storage";
import { downloadVCard, printCard } from "@/lib/export-utils";
import { defaultCardData } from "@/lib/types";
import type { BusinessCardData, TemplateId } from "@/lib/types";

const templateIcons: Record<string, React.ElementType> = {
  Sparkles,
  Crown,
  Minus,
  Shield,
  Printer: PrinterIcon,
};

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
        {/* Template selector */}
        <div className="border-b border-border bg-card/50">
          <div className="container py-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Choisir un modèle :</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 custom-scrollbar">
              {templatePreviews.map((tp) => {
                const Icon = templateIcons[tp.icon] || Sparkles;
                const isActive = cardData.templateId === tp.id;
                return (
                  <button
                    key={tp.id}
                    onClick={() => handleTemplateChange(tp.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border whitespace-nowrap text-sm transition-all touch-target shrink-0 ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tp.name}</span>
                  </button>
                );
              })}
            </div>
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
