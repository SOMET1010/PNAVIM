/**
 * Editor Page — Atelier Papetier Design
 * Mobile first: bottom tabs, swipeable panels, full-width canvas
 * On mobile: stacked layout with tabs for Form/Preview/Customize
 * On desktop: side-by-side layout
 */
import { useState, useRef, useCallback } from "react";
import { useSearch } from "wouter";
import { Header } from "@/components/Header";
import { CardCanvas } from "@/components/CardCanvas";
import { CardForm } from "@/components/CardForm";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileImage,
  Contact,
  RotateCcw,
  Undo2,
  Redo2,
  Save,
  ChevronDown,
  Pencil,
  Eye,
  Palette,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import type { BusinessCardData } from "@/lib/types";
import { defaultCardData } from "@/lib/types";
import { templateConfigs } from "@/lib/templates";
import { exportToPNG, exportToVCard } from "@/lib/export-utils";
import { saveVersion } from "@/lib/storage";

export default function Editor() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const templateId = params.get("template");

  const [cardData, setCardData] = useState<BusinessCardData>(() => {
    const initial = { ...defaultCardData };
    if (templateId && templateConfigs[templateId]) {
      initial.template = { ...templateConfigs[templateId] };
    }
    return initial;
  });

  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [mobileTab, setMobileTab] = useState("form");
  const [history, setHistory] = useState<BusinessCardData[]>([cardData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleChange = useCallback(
    (updates: Partial<BusinessCardData>) => {
      setCardData((prev) => {
        const next = { ...prev, ...updates };
        // If template is being updated, merge it
        if (updates.template) {
          next.template = { ...prev.template, ...updates.template };
        }
        if (updates.socialLinks) {
          next.socialLinks = { ...prev.socialLinks, ...updates.socialLinks };
        }
        setHistory((h) => [...h.slice(0, historyIndex + 1), next]);
        setHistoryIndex((i) => i + 1);
        return next;
      });
    },
    [historyIndex],
  );

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((i) => i - 1);
      setCardData(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((i) => i + 1);
      setCardData(history[historyIndex + 1]);
    }
  };

  const reset = () => {
    const initial = { ...defaultCardData };
    if (templateId && templateConfigs[templateId]) {
      initial.template = { ...templateConfigs[templateId] };
    }
    setCardData(initial);
    setHistory([initial]);
    setHistoryIndex(0);
    toast.success("Carte réinitialisée");
  };

  const handleExportPNG = () => {
    const canvas = activeSide === "front" ? frontCanvasRef.current : backCanvasRef.current;
    if (canvas) {
      exportToPNG(canvas, `carte-${activeSide}-${cardData.name || "visite"}.png`);
      toast.success(`${activeSide === "front" ? "Recto" : "Verso"} exporté en PNG`);
    }
  };

  const handleExportVCard = () => {
    if (!cardData.name || !cardData.email) {
      toast.error("Veuillez renseigner au moins le nom et l'email");
      return;
    }
    exportToVCard(cardData);
    toast.success("Contact vCard exporté");
  };

  const handleSave = () => {
    saveVersion(`Version ${new Date().toLocaleString("fr-FR")}`, cardData);
    toast.success("Version sauvegardée");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Toolbar */}
      <div className="border-b border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="container py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={undo} disabled={historyIndex <= 0}>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={handleSave} className="h-9 gap-1.5">
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sauvegarder</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-9 gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Exporter
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPNG}>
                  <FileImage className="h-4 w-4 mr-2" />
                  Exporter en PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportVCard}>
                  <Contact className="h-4 w-4 mr-2" />
                  Exporter en vCard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Desktop sidebar - Form & Customization */}
        <aside className="hidden lg:block w-[380px] xl:w-[420px] border-r border-border/60 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form" className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  Informations
                </TabsTrigger>
                <TabsTrigger value="customize" className="gap-1.5">
                  <Palette className="h-3.5 w-3.5" />
                  Personnaliser
                </TabsTrigger>
              </TabsList>
              <TabsContent value="form" className="mt-4">
                <CardForm data={cardData} onChange={handleChange} activeSide={activeSide} />
              </TabsContent>
              <TabsContent value="customize" className="mt-4">
                <CustomizationPanel data={cardData} onChange={handleChange} />
              </TabsContent>
            </Tabs>
          </div>
        </aside>

        {/* Canvas area */}
        <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Side toggle */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={activeSide === "front" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSide("front")}
              className="touch-target"
            >
              Recto
            </Button>
            <Button
              variant={activeSide === "back" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSide("back")}
              className="touch-target"
            >
              Verso
            </Button>
          </div>

          {/* Canvas */}
          <div className="w-full max-w-2xl">
            <div className={activeSide === "front" ? "block" : "hidden"}>
              <CardCanvas ref={frontCanvasRef} data={cardData} side="front" />
            </div>
            <div className={activeSide === "back" ? "block" : "hidden"}>
              <CardCanvas ref={backCanvasRef} data={cardData} side="back" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Format standard : 85 × 55 mm (1004 × 650 px)
          </p>
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <div className="lg:hidden border-t border-border/60 bg-card safe-area-bottom">
        <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 rounded-none bg-card">
            <TabsTrigger value="form" className="flex-col gap-0.5 text-[10px] py-2 data-[state=active]:bg-primary/8">
              <Pencil className="h-4 w-4" />
              Infos
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-col gap-0.5 text-[10px] py-2 data-[state=active]:bg-primary/8">
              <Eye className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex-col gap-0.5 text-[10px] py-2 data-[state=active]:bg-primary/8">
              <Palette className="h-4 w-4" />
              Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar mt-0">
            <CardForm data={cardData} onChange={handleChange} activeSide={activeSide} />
          </TabsContent>

          <TabsContent value="preview" className="p-4 mt-0">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <Button
                variant={activeSide === "front" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSide("front")}
              >
                Recto
              </Button>
              <Button
                variant={activeSide === "back" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSide("back")}
              >
                Verso
              </Button>
            </div>
            <div className={activeSide === "front" ? "block" : "hidden"}>
              <CardCanvas data={cardData} side="front" />
            </div>
            <div className={activeSide === "back" ? "block" : "hidden"}>
              <CardCanvas data={cardData} side="back" />
            </div>
          </TabsContent>

          <TabsContent value="customize" className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar mt-0">
            <CustomizationPanel data={cardData} onChange={handleChange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
