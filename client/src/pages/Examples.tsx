/**
 * Examples Page — Atelier Papetier Design
 * Showcase of business card examples with generated images
 */
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";

const CARD_MODERN = "https://private-us-east-1.manuscdn.com/sessionFile/wwWGnxSURVzpKJoRdf8CGi/sandbox/uJxCqLy4fhcCufLMHmPLi8-img-2_1770921973000_na1fn_Y2FyZC1wcmV2aWV3LW1vZGVybg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd3dXR254U1VSVnpwS0pvUmRmOENHaS9zYW5kYm94L3VKeENxTHk0ZmhjQ3VmTE1IbVBMaTgtaW1nLTJfMTc3MDkyMTk3MzAwMF9uYTFmbl9ZMkZ5WkMxd2NtVjJhV1YzTFcxdlpHVnliZy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=trpQAZCYG~gqOMOQYKqSzujEYw~B3BNlPw9mAoZQhrSiIur5Ka8bB4IhJeSD61mGKpTt5p2PCa6lIIjA9iYk4t3mN38MnpHG8rHmKzhl8QW320fKdybNNhwckmyCXxnnw2Kgm6Gzm8A-~mFRkdK43aVGtyyUjG1b2BdargIRpnvx~uy8lHk3rvk3tDey4FuhXm00CTlHODMVmBbCP2AA6BX~FszVyYfV83zDIcSSEeoR7FAoItM02zJ~tkT1G3XeF6ZEJWei1Y904A3RrK9XwVIyKsKvPLXvuNVwvZslHeLtgt1Nkcn2XJQaMfpuqOiZWXwz5LQcMye4g5mbOnQYhw__";

const CARD_CLASSIC = "https://private-us-east-1.manuscdn.com/sessionFile/wwWGnxSURVzpKJoRdf8CGi/sandbox/uJxCqLy4fhcCufLMHmPLi8-img-3_1770921984000_na1fn_Y2FyZC1wcmV2aWV3LWNsYXNzaWM.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd3dXR254U1VSVnpwS0pvUmRmOENHaS9zYW5kYm94L3VKeENxTHk0ZmhjQ3VmTE1IbVBMaTgtaW1nLTNfMTc3MDkyMTk4NDAwMF9uYTFmbl9ZMkZ5WkMxd2NtVjJhV1YzTFdOc1lYTnphV00uanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ToNbRlu2sswqSki9ofsEbONTbld0idgQfKaAPUi9a7GBpvplrSFyuVGxr2wVIxNHADn5bOwgIDwPdAn9Jvrx9W6K9j~b7nz93Rfb5vhKTfjBPK8iAm1uwu~1IwFRoPA6TVdVaF20Pl-w856tp-ZYsmTCrhLetsppAFPDh9kW29pbQykc4GMj0GXFLAf4~dJqK~7KWf044mcL9V0-ND6w9sHmebOaZqVe4apjWr9UZXBBs5ZNy7RSOgMawIWnefCSLPqY4Dv~et39wL-EBtHucDn12Ju~ALvK3ITDPQfprPsW6BoXPa0VUvobhFwKlxLzGhw71J7yNd74mFxgvyG0-A__";

const CARD_CREATIVE = "https://private-us-east-1.manuscdn.com/sessionFile/wwWGnxSURVzpKJoRdf8CGi/sandbox/uJxCqLy4fhcCufLMHmPLi8-img-4_1770921980000_na1fn_Y2FyZC1wcmV2aWV3LWNyZWF0aXZl.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd3dXR254U1VSVnpwS0pvUmRmOENHaS9zYW5kYm94L3VKeENxTHk0ZmhjQ3VmTE1IbVBMaTgtaW1nLTRfMTc3MDkyMTk4MDAwMF9uYTFmbl9ZMkZ5WkMxd2NtVjJhV1YzTFdOeVpXRjBhWFpsLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OY54xxqHzUc97wU2KYrBAc321Hmd3qK3wy6MONoBW5FOl27ILfq3y1JA2~xEi5Zmyi9RC7x-GQ8GZoAjVgUMVBuT7VBHaNpyeg5rt6arSLMzGfIsHAqsKkWTbij8yoT4xOa1YaqnmRfWzZ6jduKUeq0HGf~SUkfULLDi7XzuozIluaDx1g7Naco7bD8VTJxAsiBaWTrpTp7vAZJBLI1LBEMPgEjoe9rnjHkwWQP~e0-uNemxy3G~Xa17K9sslBpujxqX6OLdHfHMNdPT-Uy2Dp9fFQTZt0zLhMY6oxGXkU~PEELJFQCaCK~ER5Byk0yIn7ySrVP3apohSEZaY31W7g__";

const examples = [
  {
    id: 1,
    name: "Moderne Minimaliste",
    description: "Un design épuré avec une bande d'accent bleue. Idéal pour les professionnels du marketing et de la communication.",
    image: CARD_MODERN,
    category: "Moderne",
    templateId: 1,
  },
  {
    id: 2,
    name: "Classique Élégant",
    description: "Finitions cuivrées sur fond crème texturé. Parfait pour les architectes, avocats et consultants.",
    image: CARD_CLASSIC,
    category: "Classique",
    templateId: 2,
  },
  {
    id: 3,
    name: "Créatif Coloré",
    description: "Gradient corail-turquoise avec formes géométriques. Conçu pour les designers, artistes et créatifs.",
    image: CARD_CREATIVE,
    category: "Créatif",
    templateId: 3,
  },
];

export default function Examples() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page header */}
        <section className="container py-8 sm:py-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-1.5 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-3">
            Exemples de cartes de visite
          </h1>
          <p className="text-base text-muted-foreground max-w-xl">
            Découvrez nos réalisations et inspirez-vous pour créer votre propre carte de visite professionnelle.
          </p>
        </section>

        {/* Examples grid */}
        <section className="container pb-12 sm:pb-16">
          <div className="space-y-8 sm:space-y-12">
            {examples.map((example, index) => (
              <Card
                key={example.id}
                className="overflow-hidden paper-shadow-lg"
              >
                <div className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
                  {/* Image */}
                  <div className="lg:w-3/5 relative overflow-hidden">
                    <img
                      src={example.image}
                      alt={example.name}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="lg:w-2/5 p-5 sm:p-8 flex flex-col justify-center space-y-4">
                    <Badge variant="secondary" className="w-fit text-xs">
                      {example.category}
                    </Badge>
                    <h2 className="text-xl sm:text-2xl font-serif">{example.name}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {example.description}
                    </p>
                    <Link href={`/editor?template=${example.templateId}`}>
                      <Button className="w-full sm:w-auto touch-target gap-1.5">
                        Utiliser ce modèle
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/60 bg-card/50">
          <div className="container py-10 sm:py-14 text-center space-y-5">
            <h2 className="text-xl sm:text-2xl font-serif">
              Prêt à créer votre carte ?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Choisissez parmi nos 15+ modèles ou partez de zéro pour créer une carte unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/editor">
                <Button size="lg" className="w-full sm:w-auto font-medium touch-target">
                  Commencer maintenant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium touch-target">
                  Voir tous les modèles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/50 safe-area-bottom">
        <div className="container py-6">
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
