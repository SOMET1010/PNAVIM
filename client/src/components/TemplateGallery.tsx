/**
 * TemplateGallery — Galerie des 5 templates CI
 * Affiche un mini-aperçu de chaque template avec navigation vers l'éditeur
 */
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Crown, Minus, Shield, Printer } from "lucide-react";
import { templatePreviews, templateConfigs } from "@/lib/templates";
import type { TemplatePreview, TemplateId } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Crown,
  Minus,
  Shield,
  Printer,
};

export default function TemplateGallery() {
  const [, setLocation] = useLocation();

  const handleSelect = (id: TemplateId) => {
    setLocation(`/editor?template=${id}`);
  };

  const renderMiniPreview = (tp: TemplatePreview) => {
    const config = templateConfigs[tp.id];
    if (!config) return null;

    // Gouvernemental & Physique: show tricolor bar
    const showTricolor = config.usesNationalColors;

    return (
      <div className="w-full h-full flex flex-col" style={{ backgroundColor: config.backgroundColor }}>
        {showTricolor && (
          <div className="flex w-full h-1 shrink-0">
            <div className="flex-1" style={{ backgroundColor: "#FF6B00" }} />
            <div className="flex-1" style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #eee" }} />
            <div className="flex-1" style={{ backgroundColor: "#009E60" }} />
          </div>
        )}
        <div className="flex-1 flex items-center justify-center p-3">
          <div className="text-center space-y-1">
            <div className="w-8 h-8 rounded-full mx-auto mb-1.5" style={{ backgroundColor: config.accentColor + "20" }}>
              <div className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold" style={{ color: config.accentColor }}>
                KA
              </div>
            </div>
            <div className="text-[11px] font-bold" style={{ color: config.textColor, fontFamily: config.fontFamily }}>
              Kouassi Aya
            </div>
            <div className="text-[9px] font-medium" style={{ color: config.accentColor }}>
              Directrice RH
            </div>
            <div className="w-6 h-px mx-auto rounded-full" style={{ backgroundColor: config.accentColor }} />
            <div className="text-[7px]" style={{ color: config.textColor + "99" }}>
              aya.kouassi@gouv.ci
            </div>
          </div>
        </div>
        {showTricolor && (
          <div className="flex w-full h-1 shrink-0">
            <div className="flex-1" style={{ backgroundColor: "#FF6B00" }} />
            <div className="flex-1" style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #eee" }} />
            <div className="flex-1" style={{ backgroundColor: "#009E60" }} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {templatePreviews.map((tp) => {
        const Icon = iconMap[tp.icon] || Sparkles;
        return (
          <Card
            key={tp.id}
            className="overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            onClick={() => handleSelect(tp.id)}
          >
            {/* Mini preview */}
            <div className="aspect-[85/55] bg-muted overflow-hidden border-b border-border/50">
              {renderMiniPreview(tp)}
            </div>

            {/* Info */}
            <div className="p-2.5 sm:p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <h3 className="font-medium text-sm leading-tight truncate">{tp.name}</h3>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{tp.description}</p>
              <Button size="sm" className="w-full text-xs h-8 touch-target"
                style={{ background: "linear-gradient(135deg, #FF6B00, #009E60)" }}>
                Utiliser
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
