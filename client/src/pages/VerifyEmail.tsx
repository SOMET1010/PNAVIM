/**
 * Page de vérification email — Flux OTP
 * S'intercale entre la connexion OAuth et l'accès à "Ma Carte"
 * L'utilisateur saisit son email professionnel, reçoit un OTP, et le valide
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Shield,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type Step = "email" | "otp" | "success";

export default function VerifyEmail() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Vérifier le statut OTP de l'utilisateur
  const otpStatus = trpc.otp.status.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const sendOtp = trpc.otp.sendEmail.useMutation();
  const verifyOtp = trpc.otp.verify.useMutation();

  // Rediriger si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Rediriger si déjà vérifié
  useEffect(() => {
    if (otpStatus.data?.verified) {
      setLocation("/ma-carte");
    }
  }, [otpStatus.data, setLocation]);

  // Countdown timer pour le renvoi
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Envoyer l'OTP
  const handleSendOtp = async () => {
    if (!email.trim()) {
      toast.error("Veuillez saisir votre email professionnel.");
      return;
    }

    try {
      const result = await sendOtp.mutateAsync({ email: email.trim().toLowerCase() });

      if (result.success) {
        toast.success("Code envoyé ! Vérifiez votre boîte email.");
        setStep("otp");
        setCountdown(60); // 60 secondes avant renvoi
      } else {
        if (result.error === "domain_not_allowed") {
          toast.error("Domaine non autorisé", {
            description: "Seuls les emails @gouv.ci, @ansut.ci et @telecom.gouv.ci sont acceptés.",
          });
        } else if (result.error === "rate_limited") {
          toast.error("Trop de tentatives", {
            description: "Veuillez patienter quelques minutes avant de réessayer.",
          });
        } else {
          toast.error(result.message || "Erreur lors de l'envoi.");
        }
      }
    } catch {
      toast.error("Erreur de connexion. Veuillez réessayer.");
    }
  };

  // Vérifier le code OTP
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error("Veuillez saisir le code à 6 chiffres.");
      return;
    }

    try {
      const result = await verifyOtp.mutateAsync({
        email: email.trim().toLowerCase(),
        code: otpCode,
      });

      if (result.success) {
        setStep("success");
        toast.success("Email vérifié avec succès !");
        // Rediriger après 1.5 secondes
        setTimeout(() => {
          setLocation("/ma-carte");
        }, 1500);
      } else {
        toast.error(result.message || "Code invalide ou expiré.");
        setOtpCode("");
      }
    } catch {
      toast.error("Erreur de vérification. Veuillez réessayer.");
      setOtpCode("");
    }
  };

  // Renvoyer le code
  const handleResend = async () => {
    if (countdown > 0) return;
    setOtpCode("");
    await handleSendOtp();
  };

  if (authLoading || otpStatus.isLoading) {
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
      <div className="tricolor-bar">
        <div />
        <div />
        <div />
      </div>

      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">CarteCI</h1>
            <p className="text-[10px] text-muted-foreground leading-none">
              Vérification du domaine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-ci-orange" />
          <div className="w-2.5 h-2.5 rounded-full bg-white border border-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-ci-green" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2">
            {["email", "otp", "success"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-primary text-primary-foreground scale-110"
                      : ["email", "otp", "success"].indexOf(step) > i
                      ? "bg-ci-green text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {["email", "otp", "success"].indexOf(step) > i ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-8 h-0.5 ${
                      ["email", "otp", "success"].indexOf(step) > i
                        ? "bg-ci-green"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ==================== ÉTAPE 1 : Email ==================== */}
          {step === "email" && (
            <Card className="border-0 shadow-lg">
              <div className="h-1 flex">
                <div className="flex-1 bg-ci-orange" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-ci-green" />
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Vérifiez votre email</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Saisissez votre email professionnel pour vérifier votre
                    appartenance à l'administration ivoirienne.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email professionnel
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="prenom.nom@gouv.ci"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendOtp();
                    }}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Domaines autorisés : @gouv.ci · @ansut.ci · @telecom.gouv.ci
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full h-12 text-base font-medium"
                  onClick={handleSendOtp}
                  disabled={sendOtp.isPending || !email.trim()}
                >
                  {sendOtp.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le code
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ==================== ÉTAPE 2 : Saisie OTP ==================== */}
          {step === "otp" && (
            <Card className="border-0 shadow-lg">
              <div className="h-1 flex">
                <div className="flex-1 bg-ci-orange" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-ci-green" />
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-ci-green/10 flex items-center justify-center mx-auto">
                    <Shield className="w-7 h-7 text-ci-green" />
                  </div>
                  <h2 className="text-xl font-bold">Saisissez le code</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Un code à 6 chiffres a été envoyé à{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Timer et renvoi */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Renvoyer le code dans{" "}
                      <span className="font-mono font-bold text-foreground">
                        {countdown}s
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                      disabled={sendOtp.isPending}
                    >
                      <RefreshCw className="w-3 h-3" />
                      Renvoyer le code
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12"
                    onClick={() => {
                      setStep("email");
                      setOtpCode("");
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 h-12 text-base font-medium"
                    onClick={handleVerifyOtp}
                    disabled={verifyOtp.isPending || otpCode.length !== 6}
                  >
                    {verifyOtp.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Vérification...
                      </>
                    ) : (
                      <>
                        Vérifier
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Info box */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Le code expire dans 10 minutes. Vérifiez vos spams si vous
                    ne recevez pas l'email.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ==================== ÉTAPE 3 : Succès ==================== */}
          {step === "success" && (
            <Card className="border-0 shadow-lg">
              <div className="h-1 flex">
                <div className="flex-1 bg-ci-orange" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-ci-green" />
              </div>
              <CardContent className="p-6 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-ci-green/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-ci-green" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Email vérifié !</h2>
                  <p className="text-sm text-muted-foreground">
                    Votre identité a été confirmée. Vous allez être redirigé
                    vers votre carte de visite.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Redirection en cours...
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bienvenue message */}
          {user && (
            <p className="text-center text-xs text-muted-foreground">
              Connecté en tant que{" "}
              <span className="font-medium">{user.name || "Utilisateur"}</span>
            </p>
          )}
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
