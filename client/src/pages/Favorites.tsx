/**
 * Favorites Page — Atelier Papetier Design
 * Mobile first: affiche les modèles favoris de l'utilisateur
 * Palette: Crème chaud, encre charbon, cuivre, vert sauge
 */
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/contexts/FavoritesContext";
import { templatePreviews, templateConfigs } from "@/lib/templates";
import type { TemplatePreview } from "@/lib/types";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.25 } },
};

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteTemplates = templatePreviews.filter((t) =>
    favorites.includes(String(t.id)),
  );

  const handleRemoveFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
    toast("Modèle retiré des favoris", {
      icon: <Heart className="h-4 w-4 text-muted-foreground" />,
    });
  };

  const handleSelectTemplate = (id: number | string) => {
    setLocation(`/editor?template=${id}`);
  };

  const renderMiniPreview = (template: TemplatePreview) => {
    const config = templateConfigs[String(template.id)];
    if (!config) return null;
    return (
      <div
        className="w-full h-full flex items-center justify-center p-4"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div className="text-center space-y-1" style={{ color: config.textColor }}>
          <div className="text-xs font-bold" style={{ fontFamily: config.fontFamily }}>
            Jean Dupont
          </div>
          <div className="text-[10px]" style={{ color: config.accentColor }}>
            Directeur Marketing
          </div>
          <div
            className="w-8 h-0.5 mx-auto rounded-full"
            style={{ backgroundColor: config.accentColor }}
          />
          <div className="text-[8px] opacity-70">contact@exemple.fr</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8 sm:py-12">
          {/* Page header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-destructive fill-destructive" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif">Mes favoris</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {favoriteTemplates.length === 0
                    ? "Aucun modèle en favori"
                    : `${favoriteTemplates.length} modèle${favoriteTemplates.length > 1 ? "s" : ""} sauvegardé${favoriteTemplates.length > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>

          {/* Favorites grid */}
          {favoriteTemplates.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <AnimatePresence mode="popLayout">
                {favoriteTemplates.map((template, i) => (
                  <motion.div
                    key={template.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fadeUp}
                    layout
                  >
                    <Card
                      className="overflow-hidden group cursor-pointer transition-all duration-200 hover:paper-shadow-lg active:scale-[0.98]"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      <div className="relative card-aspect bg-muted overflow-hidden">
                        {template.preview ? (
                          <img
                            src={template.preview}
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          renderMiniPreview(template)
                        )}
                        {/* Remove favorite button */}
                        <button
                          onClick={(e) => handleRemoveFavorite(e, String(template.id))}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110 active:scale-95"
                          aria-label="Retirer des favoris"
                        >
                          <Heart className="h-4 w-4 text-destructive fill-destructive" />
                        </button>
                      </div>
                      <div className="p-2.5 sm:p-3 space-y-1.5">
                        <h3 className="font-medium text-sm leading-tight line-clamp-1">
                          {template.name}
                        </h3>
                        <div className="flex gap-1 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {template.category}
                          </Badge>
                        </div>
                        <Button size="sm" className="w-full mt-1.5 text-xs h-8 touch-target">
                          Utiliser
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 sm:py-24"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/60 flex items-center justify-center">
                <Heart className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h2 className="text-xl font-serif mb-2">Pas encore de favoris</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
                Parcourez nos modèles et appuyez sur le coeur pour sauvegarder vos préférés ici.
              </p>
              <Link href="/">
                <Button size="lg" className="font-medium touch-target">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Découvrir les modèles
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/50 mt-auto safe-area-bottom">
        <div className="container py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs font-serif">C</span>
              </div>
              <span className="text-sm font-medium">CardCreator</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Créez des cartes de visite professionnelles gratuitement
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
