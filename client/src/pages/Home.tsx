/**
 * Home Page — Atelier Papetier Design
 * Mobile first: stack vertical, cartes flottantes, ombres douces
 * Palette: Crème chaud, encre charbon, cuivre, vert sauge
 */
import { Header } from "@/components/Header";
import { TemplateGallery } from "@/components/TemplateGallery";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Download, Palette } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/wwWGnxSURVzpKJoRdf8CGi/sandbox/uJxCqLy4fhcCufLMHmPLi8-img-1_1770921977000_na1fn_aGVyby1iYW5uZXI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd3dXR254U1VSVnpwS0pvUmRmOENHaS9zYW5kYm94L3VKeENxTHk0ZmhjQ3VmTE1IbVBMaTgtaW1nLTFfMTc3MDkyMTk3NzAwMF9uYTFmbl9hR1Z5YnkxaVlXNXVaWEkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=r7VYe6-mCpBHlWTjISBVsCI7opdxVdKm0ZhWS6ZTjNd~XN3-9kfZO26d2SzyaOpVG6EFgB32z6Mj4GgVp~R7DuZS3Bk3QgHCpnh4pvKna9U9jpWDbd09xYwyAc-q5hPemLquCADx9zzkgtrTUBTp4UVO-rj5qwlDAGP9A8xSLP7S3~UDoOxavZXfZgPUKUZi3w99Tcq5IPEP7VVAm65AZ-5WEUVbq0tl51dmsV0a64m9XLs~TWPqtiVIH2wgHE4ftNnE4F2bT58o2CsK6RNKhVzRQ0ljVfXJW6WSI9N7AjZcsz7lMZ~-xZZTaZT8JREK~LI0TRljXU9Lr585pERY-w__";

const MOBILE_ILLUSTRATION = "https://private-us-east-1.manuscdn.com/sessionFile/wwWGnxSURVzpKJoRdf8CGi/sandbox/uJxCqLy4fhcCufLMHmPLi8-img-5_1770921974000_na1fn_bW9iaWxlLWVkaXRvci1pbGx1c3RyYXRpb24.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd3dXR254U1VSVnpwS0pvUmRmOENHaS9zYW5kYm94L3VKeENxTHk0ZmhjQ3VmTE1IbVBMaTgtaW1nLTVfMTc3MDkyMTk3NDAwMF9uYTFmbl9iVzlpYVd4bExXVmthWFJ2Y2kxcGJHeDFjM1J5WVhScGIyNC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fAjSoSGqK3IlOZx2iknKJl9fWw-weDt5w6JCuOxF4Z8rXJpY1A5gJnsrDnhf~eS5PabiLRou1FVioICWk~cKeLKCVIYPwLPCDzOK5lqMcZosCu-mkmvFa7KWuFAvRKdPb0SbdC6s2x55xWRmYcfoXxaYbjcoNyhSj7IOqi72suhAszaoWIFyRKENbMcFGBDKjmImkoUzvx39wRQCBhtubg19T3s521bz-yQ5PyFtADYmeVxVFY9lT-7aPlbIkz5gLEE0tdeX0dUx7KNwyrQ-5RU7tLXFpcHlQ5qXREDnCikv~YGiT773iJ-4dn7r0tulnM16BfgxSeGXYSuLm3OpUA__";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 } as const,
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background image - desktop only */}
        <div className="absolute inset-0 hidden lg:block">
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </div>

        <div className="container relative py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text content */}
            <div className="space-y-6 sm:space-y-8">
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-copper/10 text-copper rounded-full text-xs font-medium tracking-wide">
                  <Sparkles className="h-3 w-3" />
                  Créateur de cartes de visite
                </span>
              </motion.div>

              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif leading-[1.1] tracking-tight"
              >
                Votre carte de visite,{" "}
                <span className="text-copper">votre identité</span>
              </motion.h1>

              <motion.p
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg"
              >
                Créez, personnalisez et téléchargez des cartes de visite professionnelles
                en quelques minutes. Plus de 15 modèles prêts à l'emploi.
              </motion.p>

              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link href="/editor">
                  <Button size="lg" className="w-full sm:w-auto font-medium text-base touch-target">
                    Créer ma carte
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/examples">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium text-base touch-target">
                    Voir les exemples
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile illustration */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="relative lg:block"
            >
              <div className="relative mx-auto max-w-xs sm:max-w-sm lg:max-w-md">
                <img
                  src={MOBILE_ILLUSTRATION}
                  alt="Éditeur de cartes de visite mobile"
                  className="w-full h-auto rounded-2xl paper-shadow-lg"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="container py-6 sm:py-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Palette, label: "15+ modèles", desc: "Designs professionnels" },
              { icon: Sparkles, label: "Personnalisable", desc: "Couleurs, polices, logos" },
              { icon: Download, label: "Export facile", desc: "PNG, PDF, vCard" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                custom={i + 4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-center space-y-1.5"
              >
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-copper" />
                <p className="text-xs sm:text-sm font-medium">{feature.label}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{feature.desc}</p>
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
              Sélectionnez un modèle pour commencer, puis personnalisez-le à votre image
            </p>
          </div>
          <TemplateGallery />
        </div>
      </section>

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
