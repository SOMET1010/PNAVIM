/**
 * Module d'envoi de messages via l'API ANSUT Gateway
 * Supporte : Email, SMS, Telegram
 * Endpoint : POST {baseUrl}/api/message/send
 */
import axios from "axios";
import { ENV } from "./_core/env";

const AXIOS_TIMEOUT = 15_000; // 15 secondes

interface SendEmailParams {
  to: string;
  subject: string;
  content: string;
  isHtml?: boolean;
  cc?: string;
  bcc?: string;
}

interface SendSmsParams {
  to: string;
  content: string;
  from?: string;
}

interface GatewayResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envoyer un email via la gateway ANSUT
 * Utilise le canal "Email" de l'API /api/message/send
 */
export async function sendEmail(params: SendEmailParams): Promise<GatewayResponse> {
  const { to, subject, content, isHtml = true, cc, bcc } = params;

  if (!ENV.ansutGatewayUrl || !ENV.ansutUsername || !ENV.ansutPassword) {
    console.error("[Messaging] ANSUT Gateway credentials not configured");
    return { success: false, error: "Gateway credentials not configured" };
  }

  try {
    const payload: Record<string, unknown> = {
      to,
      subject,
      content,
      ishtml: isHtml,
      username: ENV.ansutUsername,
      password: ENV.ansutPassword,
      channel: "Email",
    };

    if (cc) payload.cc = cc;
    if (bcc) payload.bcc = bcc;

    const response = await axios.post(
      `${ENV.ansutGatewayUrl}/api/message/send`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        timeout: AXIOS_TIMEOUT,
      }
    );

    console.log("[Messaging] Email sent to:", to, "Status:", response.status);
    return {
      success: response.status >= 200 && response.status < 300,
      messageId: response.data?.messageId,
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[Messaging] Failed to send email:", errMsg);
    return { success: false, error: errMsg };
  }
}

/**
 * Envoyer un SMS via la gateway ANSUT
 * Utilise l'endpoint /api/message/send (canal par défaut = SMS)
 */
export async function sendSms(params: SendSmsParams): Promise<GatewayResponse> {
  const { to, content, from = "ANSUT" } = params;

  if (!ENV.ansutGatewayUrl || !ENV.ansutUsername || !ENV.ansutPassword) {
    console.error("[Messaging] ANSUT Gateway credentials not configured");
    return { success: false, error: "Gateway credentials not configured" };
  }

  try {
    const payload = {
      to,
      from,
      content,
      username: ENV.ansutUsername,
      password: ENV.ansutPassword,
    };

    const response = await axios.post(
      `${ENV.ansutGatewayUrl}/api/message/send`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        timeout: AXIOS_TIMEOUT,
      }
    );

    console.log("[Messaging] SMS sent to:", to, "Status:", response.status);
    return {
      success: response.status >= 200 && response.status < 300,
      messageId: response.data?.messageId,
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[Messaging] Failed to send SMS:", errMsg);
    return { success: false, error: errMsg };
  }
}

/**
 * Générer un code OTP à 6 chiffres
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Construire le contenu HTML de l'email OTP
 */
export function buildOtpEmailHtml(code: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <!-- Tricolor bar -->
    <div style="display: flex; height: 4px;">
      <div style="flex: 1; background: #FF6B00;"></div>
      <div style="flex: 1; background: #FFFFFF;"></div>
      <div style="flex: 1; background: #009E60;"></div>
    </div>
    
    <div style="padding: 32px 24px;">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #FF6B00, #009E60); color: white; width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 20px; font-weight: bold;">CI</div>
        <p style="margin: 8px 0 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">CarteCI</p>
      </div>
      
      <!-- Message -->
      <h2 style="text-align: center; color: #1a1a1a; font-size: 18px; margin: 0 0 8px;">Vérification de votre email</h2>
      <p style="text-align: center; color: #666; font-size: 14px; line-height: 1.5; margin: 0 0 24px;">
        Voici votre code de vérification pour accéder à votre carte de visite numérique.
      </p>
      
      <!-- OTP Code -->
      <div style="text-align: center; margin: 24px 0;">
        <div style="display: inline-block; background: #f0f4f0; border: 2px dashed #009E60; border-radius: 12px; padding: 16px 32px;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: 'Courier New', monospace;">${code}</span>
        </div>
      </div>
      
      <p style="text-align: center; color: #999; font-size: 12px; margin: 24px 0 0;">
        Ce code expire dans <strong>10 minutes</strong>.<br>
        Si vous n'avez pas demandé ce code, ignorez cet email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #eee;">
      <p style="margin: 0; font-size: 11px; color: #999;">
        ANSUT — Agence Nationale du Service Universel des Télécommunications<br>
        République de Côte d'Ivoire
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}

/**
 * Construire le contenu SMS de l'OTP
 */
export function buildOtpSmsContent(code: string): string {
  return `CarteCI - Votre code de vérification est : ${code}. Valable 10 minutes. Ne partagez ce code avec personne.`;
}
