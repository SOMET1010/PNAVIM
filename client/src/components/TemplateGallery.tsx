import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Trash2, ArrowRight, Heart } from "lucide-react";
import { templatePreviews, templateConfigs, categories } from "@/lib/templates";
import { getCustomTemplates, deleteCustomTemplate } from "@/lib/storage";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { CustomTemplate, TemplatePreview } from "@/lib/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function TemplateGallery() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    setCustomTemplates(getCustomTemplates());
  }, []);

  const allTemplates: (TemplatePreview & { isCustom?: boolean })[] = [
    ...customTemplates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      style: t.style,
      preview: t.preview,
      isCustom: true,
    })),
    ...templatePreviews.map((t) => ({ ...t, isCustom: false })),
  ];

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (id: number | string) => {
    setLocation(`/editor?template=${id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    const added = toggleFavorite(templateId);
    if (added) {
      toast("Ajouté aux favoris", {
        icon: <Heart className="h-4 w-4 text-destructive fill-destructive" />,
      });
    } else {
      toast("Retiré des favoris", {
        icon: <Heart className="h-4 w-4 text-muted-foreground" />,
      });
    }
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      deleteCustomTemplate(String(templateToDelete));
      setCustomTemplates(getCustomTemplates());
      setTemplateToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // Generate a mini preview for templates without images
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
    <div className="space-y-5">
      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un modèle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-base prevent-zoom touch-target"
        />
      </div>

      {/* Categories - horizontal scroll on mobile */}
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="shrink-0 rounded-full touch-target"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredTemplates.map((template) => {
          const templateId = String(template.id);
          const fav = isFavorite(templateId);

          return (
            <Card
              key={template.id}
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

                {/* Favorite button — always visible */}
                <button
                  onClick={(e) => handleToggleFavorite(e, templateId)}
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 active:scale-90 z-10 ${
                    fav
                      ? "bg-destructive/15 dark:bg-destructive/25"
                      : "bg-white/80 dark:bg-card/80 opacity-0 group-hover:opacity-100"
                  } ${fav ? "!opacity-100" : ""}`}
                  aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      fav
                        ? "text-destructive fill-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>

                {template.isCustom && (
                  <>
                    <Badge className="absolute top-1.5 left-1.5 text-[10px] bg-primary">
                      Perso
                    </Badge>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute bottom-1.5 right-1.5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTemplateToDelete(String(template.id));
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
              <div className="p-2.5 sm:p-3 space-y-1.5">
                <h3 className="font-medium text-sm leading-tight line-clamp-1">{template.name}</h3>
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
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">Aucun modèle trouvé</p>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le modèle</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le modèle sera supprimé définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
