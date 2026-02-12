import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, ImageIcon, Sparkles, Upload } from "lucide-react";
import type { BusinessCardData } from "@/lib/types";

interface CustomizationPanelProps {
  data: BusinessCardData;
  onChange: (updates: Partial<BusinessCardData>) => void;
}

const FONT_OPTIONS = [
  { value: "sans-serif", label: "Sans Serif (Moderne)" },
  { value: "serif", label: "Serif (Classique)" },
  { value: "monospace", label: "Monospace (Tech)" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'DM Serif Display', serif", label: "DM Serif Display" },
];

const LAYOUT_OPTIONS = [
  { value: "left-aligned", label: "Aligné à gauche" },
  { value: "centered", label: "Centré" },
  { value: "modern", label: "Moderne" },
];

export function CustomizationPanel({ data, onChange }: CustomizationPanelProps) {
  const handleColorChange = (field: "backgroundColor" | "textColor" | "accentColor", value: string) => {
    onChange({ template: { ...data.template, [field]: value } });
  };

  const handleFontChange = (value: string) => {
    onChange({ template: { ...data.template, fontFamily: value } });
  };

  const handleLayoutChange = (value: string) => {
    onChange({ template: { ...data.template, layout: value as "left-aligned" | "centered" | "modern" } });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ template: { ...data.template, backgroundImage: event.target?.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Tabs defaultValue="colors" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto">
        <TabsTrigger value="colors" className="text-xs py-2.5 gap-1 flex-col sm:flex-row">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Couleurs</span>
        </TabsTrigger>
        <TabsTrigger value="fonts" className="text-xs py-2.5 gap-1 flex-col sm:flex-row">
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline">Texte</span>
        </TabsTrigger>
        <TabsTrigger value="background" className="text-xs py-2.5 gap-1 flex-col sm:flex-row">
          <ImageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Fond</span>
        </TabsTrigger>
        <TabsTrigger value="layout" className="text-xs py-2.5 gap-1 flex-col sm:flex-row">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Style</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="colors" className="space-y-4 mt-4">
        {[
          { id: "bg-color", label: "Couleur de fond", field: "backgroundColor" as const, value: data.template.backgroundColor },
          { id: "text-color", label: "Couleur du texte", field: "textColor" as const, value: data.template.textColor },
          { id: "accent-color", label: "Couleur d'accent", field: "accentColor" as const, value: data.template.accentColor },
        ].map((item) => (
          <div key={item.id} className="space-y-2">
            <Label htmlFor={item.id} className="text-sm">{item.label}</Label>
            <div className="flex gap-2">
              <Input
                id={item.id}
                type="color"
                value={item.value}
                onChange={(e) => handleColorChange(item.field, e.target.value)}
                className="w-14 h-10 p-1 cursor-pointer rounded-lg"
              />
              <Input
                type="text"
                value={item.value}
                onChange={(e) => handleColorChange(item.field, e.target.value)}
                className="flex-1 text-sm font-mono"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="fonts" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label className="text-sm">Police de caractères</Label>
          <Select value={data.template.fontFamily} onValueChange={handleFontChange}>
            <SelectTrigger className="touch-target">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="background" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label className="text-sm">Image de fond</Label>
          <input type="file" id="bg-upload" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
          <Button variant="outline" size="sm" className="w-full touch-target" onClick={() => document.getElementById("bg-upload")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Télécharger une image
          </Button>
          {data.template.backgroundImage && (
            <Button variant="outline" size="sm" className="w-full" onClick={() => onChange({ template: { ...data.template, backgroundImage: undefined } })}>
              Supprimer l'image de fond
            </Button>
          )}
        </div>
      </TabsContent>

      <TabsContent value="layout" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label className="text-sm">Disposition</Label>
          <Select value={data.template.layout} onValueChange={handleLayoutChange}>
            <SelectTrigger className="touch-target">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LAYOUT_OPTIONS.map((layout) => (
                <SelectItem key={layout.value} value={layout.value}>
                  {layout.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  );
}
