/**
 * CardForm — Formulaire de saisie mobile first
 * Photo, informations personnelles, coordonnées, réseaux sociaux, champs personnalisables
 */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Briefcase, Building2, Phone, Mail, Globe, MapPin,
  Camera, X, Plus, Trash2, Linkedin, Twitter, Facebook, Instagram,
  ChevronDown, ChevronUp, Link2, Type, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BusinessCardData, CustomField } from "@/lib/types";

interface CardFormProps {
  data: BusinessCardData;
  onChange: (data: BusinessCardData) => void;
}

export default function CardForm({ data, onChange }: CardFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    contact: true,
    social: false,
    custom: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("La photo ne doit pas dépasser 5 Mo");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({
        ...data,
        personal: { ...data.personal, photo: ev.target?.result as string },
      });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    onChange({ ...data, personal: { ...data.personal, photo: null } });
  };

  const updatePersonal = (field: string, value: string) => {
    onChange({ ...data, personal: { ...data.personal, [field]: value } });
  };

  const updateContact = (field: string, value: string) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const updateSocial = (field: string, value: string) => {
    onChange({ ...data, socialLinks: { ...data.socialLinks, [field]: value } });
  };

  const addCustomField = () => {
    const newField: CustomField = {
      id: `cf-${Date.now()}`,
      type: "text",
      label: "",
      value: "",
    };
    onChange({ ...data, customFields: [...data.customFields, newField] });
    if (!expandedSections.custom) {
      setExpandedSections((prev) => ({ ...prev, custom: true }));
    }
  };

  const updateCustomField = (id: string, field: Partial<CustomField>) => {
    onChange({
      ...data,
      customFields: data.customFields.map((cf) =>
        cf.id === id ? { ...cf, ...field } : cf
      ),
    });
  };

  const removeCustomField = (id: string) => {
    onChange({
      ...data,
      customFields: data.customFields.filter((cf) => cf.id !== id),
    });
  };

  const SectionHeader = ({
    title,
    icon: Icon,
    section,
    count,
  }: {
    title: string;
    icon: React.ElementType;
    section: keyof typeof expandedSections;
    count?: number;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 px-4 touch-target"
      aria-expanded={expandedSections[section]}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-semibold text-base">{title}</span>
        {count !== undefined && count > 0 && (
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Photo de profil */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative">
          {data.personal.photo ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-3 border-primary/20 paper-shadow">
              <img
                src={data.personal.photo}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
              <button
                onClick={removePhoto}
                className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md"
                aria-label="Supprimer la photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors touch-target"
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs">Photo</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        {data.personal.photo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs"
          >
            Changer la photo
          </Button>
        )}
      </div>

      {/* Informations personnelles */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <SectionHeader title="Informations personnelles" icon={User} section="personal" />
        <AnimatePresence>
          {expandedSections.personal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <Label htmlFor="fullName" className="text-sm flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5" /> Nom complet *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Ex: Kouassi Aya Marie"
                    value={data.personal.fullName}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
                <div>
                  <Label htmlFor="title" className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Fonction / Titre
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Directrice des Ressources Humaines"
                    value={data.personal.title}
                    onChange={(e) => updatePersonal("title", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
                <div>
                  <Label htmlFor="organization" className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Organisation / Ministère
                  </Label>
                  <Input
                    id="organization"
                    placeholder="Ex: Ministère de la Fonction Publique"
                    value={data.personal.organization}
                    onChange={(e) => updatePersonal("organization", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coordonnées */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <SectionHeader title="Coordonnées" icon={Phone} section="contact" />
        <AnimatePresence>
          {expandedSections.contact && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <Label htmlFor="mobile" className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5" /> Téléphone mobile
                  </Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-lg text-sm text-muted-foreground whitespace-nowrap">
                      +225
                    </span>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="07 XX XX XX XX"
                      value={data.contact.mobile}
                      onChange={(e) => updateContact("mobile", e.target.value)}
                      className="prevent-zoom"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="landline" className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5" /> Téléphone fixe
                  </Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-lg text-sm text-muted-foreground whitespace-nowrap">
                      +225
                    </span>
                    <Input
                      id="landline"
                      type="tel"
                      placeholder="27 XX XX XX XX"
                      value={data.contact.landline}
                      onChange={(e) => updateContact("landline", e.target.value)}
                      className="prevent-zoom"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email professionnel
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="prenom.nom@gouv.ci"
                    value={data.contact.email}
                    onChange={(e) => updateContact("email", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Globe className="w-3.5 h-3.5" /> Site web
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.exemple.gouv.ci"
                    value={data.contact.website}
                    onChange={(e) => updateContact("website", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Adresse professionnelle
                  </Label>
                  <Input
                    id="address"
                    placeholder="Abidjan, Plateau, Rue..."
                    value={data.contact.address}
                    onChange={(e) => updateContact("address", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Réseaux sociaux */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <SectionHeader title="Réseaux sociaux" icon={Share2} section="social" />
        <AnimatePresence>
          {expandedSections.social && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <Label className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </Label>
                  <Input
                    placeholder="https://linkedin.com/in/..."
                    value={data.socialLinks.linkedin || ""}
                    onChange={(e) => updateSocial("linkedin", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
                <div>
                  <Label className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Twitter className="w-3.5 h-3.5" /> Twitter / X
                  </Label>
                  <Input
                    placeholder="https://twitter.com/..."
                    value={data.socialLinks.twitter || ""}
                    onChange={(e) => updateSocial("twitter", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
                <div>
                  <Label className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Facebook className="w-3.5 h-3.5" /> Facebook
                  </Label>
                  <Input
                    placeholder="https://facebook.com/..."
                    value={data.socialLinks.facebook || ""}
                    onChange={(e) => updateSocial("facebook", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
                <div>
                  <Label className="text-sm flex items-center gap-1.5 mb-1.5">
                    <Instagram className="w-3.5 h-3.5" /> Instagram
                  </Label>
                  <Input
                    placeholder="https://instagram.com/..."
                    value={data.socialLinks.instagram || ""}
                    onChange={(e) => updateSocial("instagram", e.target.value)}
                    className="prevent-zoom"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Champs personnalisables */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <SectionHeader
          title="Champs personnalisés"
          icon={Plus}
          section="custom"
          count={data.customFields.length}
        />
        <AnimatePresence>
          {expandedSections.custom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                {data.customFields.map((field) => (
                  <div key={field.id} className="flex gap-2 items-start p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Select
                          value={field.type}
                          onValueChange={(val) =>
                            updateCustomField(field.id, { type: val as CustomField["type"] })
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">
                              <span className="flex items-center gap-1.5">
                                <Type className="w-3 h-3" /> Texte
                              </span>
                            </SelectItem>
                            <SelectItem value="url">
                              <span className="flex items-center gap-1.5">
                                <Link2 className="w-3 h-3" /> Lien
                              </span>
                            </SelectItem>
                            <SelectItem value="social">
                              <span className="flex items-center gap-1.5">
                                <Share2 className="w-3 h-3" /> Social
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Libellé"
                          value={field.label}
                          onChange={(e) =>
                            updateCustomField(field.id, { label: e.target.value })
                          }
                          className="prevent-zoom"
                        />
                      </div>
                      <Input
                        placeholder="Valeur"
                        value={field.value}
                        onChange={(e) =>
                          updateCustomField(field.id, { value: e.target.value })
                        }
                        className="prevent-zoom"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomField(field.id)}
                      className="text-destructive hover:text-destructive shrink-0 mt-1"
                      aria-label="Supprimer ce champ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                  className="w-full touch-target"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un champ
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
