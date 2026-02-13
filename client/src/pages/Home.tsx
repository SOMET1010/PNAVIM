import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { CreditCard, Shield, QrCode, Download, Share2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

/**
 * Écran 1 — Page d'accueil / Connexion
 * Design system gouvernemental ivoirien
 * Parcours simplifié : connexion via Manus OAuth
 */
export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Vérifier le statut OTP
  const otpStatus = trpc.otp.status.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Rediriger selon le statut de vérification email
  useEffect(() => {
    if (isAuthenticated && user && otpStatus.data) {
      if (otpStatus.data.verified) {
        setLocation("/ma-carte");
      } else {
        setLocation("/verify-email");
      }
    }
  }, [isAuthenticated, user, otpStatus.data, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Tricolor bar */}
      <div className="tricolor-bar"><div /><div /><div /></div>

      {/* Header minimal */}
      <header className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">CarteCI</h1>
            <p className="text-[10px] text-muted-foreground leading-none">Administration ivoirienne</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-ci-orange" />
          <div className="w-2.5 h-2.5 rounded-full bg-white border border-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-ci-green" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Badge officiel */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ci-green/10 text-ci-green">
              <Shield className="w-3 h-3" />
              Outil officiel — ANSUT
            </span>
          </div>

          {/* Titre */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              Votre carte de visite<br />
              <span className="text-primary">numérique</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Générez et partagez votre carte de visite professionnelle en quelques secondes.
              Réservé aux agents de l'Administration.
            </p>
          </div>

          {/* Carte de prévisualisation */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1.5 flex">
              <div className="flex-1 bg-ci-orange" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-ci-green" />
            </div>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  CI
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="font-semibold text-sm">Nom Prénom</p>
                  <p className="text-xs text-primary">Fonction / Titre</p>
                  <p className="text-xs text-muted-foreground">Ministère / Direction</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span>+225 XX XX XX XX</span>
                <span>nom@gouv.ci</span>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de connexion */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full h-12 text-base font-medium touch-target"
              onClick={() => { window.location.href = getLoginUrl(); }}
            >
              Se connecter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Accès réservé aux emails professionnels<br />
              @gouv.ci · @ansut.ci · @telecom.gouv.ci
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-4 gap-3 pt-4">
            {[
              { icon: CreditCard, label: "Carte pro" },
              { icon: QrCode, label: "QR Code" },
              { icon: Download, label: "vCard" },
              { icon: Share2, label: "Partage" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <f.icon className="w-4.5 h-4.5 text-muted-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 text-center safe-area-bottom">
        <p className="text-[10px] text-muted-foreground">
          ANSUT — Agence Nationale du Service Universel des Télécommunications
        </p>
      </footer>
    </div>
  );
}
