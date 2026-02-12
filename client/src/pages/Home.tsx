/**
 * Home Page — CarteCI
 * Page d'accueil mobile first pour le générateur de cartes de visite CI
 * Couleurs nationales : Orange #FF6B00, Blanc, Vert #009E60
 */
import Header from "@/components/Header";
import TemplateGallery from "@/components/TemplateGallery";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CreditCard, QrCode, Download, Printer, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Tricolor top accent */}
        <div className="flex w-full h-1">
          <div className="flex-1" style={{ backgroundColor: "#FF6B00" }} />
          <div className="flex-1" style={{ backgroundColor: "#FFFFFF" }} />
          <div className="flex-1" style={{ backgroundColor: "#009E60" }} />
        </div>

        <div className="container py-12 sm:py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide"
                style={{ backgroundColor: "#FF6B0015", color: "#FF6B00" }}>
                <Shield className="h-3 w-3" />
                Outil officiel pour fonctionnaires CI
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif leading-[1.1] tracking-tight"
            >
              Créez votre carte de visite{" "}
              <span style={{ color: "#FF6B00" }}>professionnelle</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
            >
              Générez des cartes de visite aux couleurs de la Côte d'Ivoire avec QR code intégré,
              export vCard et impression directe. 5 modèles officiels disponibles.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/editor">
                <Button size="lg" className="w-full sm:w-auto font-medium text-base touch-target"
                  style={{ background: "linear-gradient(135deg, #FF6B00, #009E60)" }}>
                  Créer ma carte
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/editor?template=gouvernemental">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium text-base touch-target">
                  <Shield className="h-4 w-4 mr-2" />
                  Modèle officiel
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="container py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: CreditCard, label: "5 modèles", desc: "Designs officiels CI", color: "#FF6B00" },
              { icon: QrCode, label: "QR Code", desc: "Contact instantané", color: "#009E60" },
              { icon: Download, label: "Export vCard", desc: "Téléchargement direct", color: "#FF6B00" },
              { icon: Printer, label: "Impression", desc: "Format standard 85×55mm", color: "#009E60" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                custom={i + 4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-center space-y-2"
              >
                <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                  style={{ backgroundColor: feature.color + "12" }}>
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <p className="text-sm font-semibold">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates section */}
      <section className="py-10 sm:py-16">
        <div className="container">
          <div className="text-center mb-8 sm:mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif">Choisissez votre modèle</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Sélectionnez un modèle pour commencer, puis personnalisez-le avec vos informations
            </p>
          </div>
          <TemplateGallery />
        </div>
      </section>

      {/* How it works */}
      <section className="py-10 sm:py-16 bg-card/50 border-t border-border/60">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-serif text-center mb-8 sm:mb-12">Comment ça marche</h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Choisissez un modèle", desc: "Sélectionnez parmi 5 designs officiels adaptés aux fonctionnaires" },
              { step: "2", title: "Remplissez vos infos", desc: "Nom, fonction, ministère, téléphone, email, photo de profil" },
              { step: "3", title: "Exportez & imprimez", desc: "Téléchargez en vCard, imprimez ou partagez via QR code" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center space-y-3"
              >
                <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: "linear-gradient(135deg, #FF6B00, #009E60)" }}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/50 mt-auto safe-area-bottom">
        <div className="container py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #FF6B00, #009E60)" }}>
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-serif font-bold">CarteCI</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Générateur de cartes de visite pour fonctionnaires et agents de l'État ivoirien
            </p>
            {/* Tricolor accent */}
            <div className="flex gap-1">
              <div className="w-4 h-1 rounded-full" style={{ backgroundColor: "#FF6B00" }} />
              <div className="w-4 h-1 rounded-full" style={{ backgroundColor: "#FFFFFF", border: "0.5px solid #ddd" }} />
              <div className="w-4 h-1 rounded-full" style={{ backgroundColor: "#009E60" }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
