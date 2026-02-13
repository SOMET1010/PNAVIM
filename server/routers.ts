import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { sendEmail, generateOtpCode, buildOtpEmailHtml } from "./messaging";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== OTP VERIFICATION ====================
  otp: router({
    /**
     * Vérifier si l'email est dans un domaine autorisé
     */
    checkDomain: protectedProcedure.input(z.object({
      email: z.string().email(),
    })).mutation(async ({ input }) => {
      const allowed = await db.isDomainAllowed(input.email);
      return { allowed };
    }),

    /**
     * Envoyer un OTP par email via la gateway ANSUT
     * - Vérifie que le domaine est autorisé
     * - Limite le nombre de tentatives (max 5 en 5 minutes)
     * - Génère un code à 6 chiffres
     * - Envoie l'email via l'API ANSUT
     * - Stocke le code en BDD
     */
    sendEmail: protectedProcedure.input(z.object({
      email: z.string().email(),
    })).mutation(async ({ ctx, input }) => {
      // 1. Vérifier le domaine
      const allowed = await db.isDomainAllowed(input.email);
      if (!allowed) {
        return {
          success: false,
          error: "domain_not_allowed",
          message: "Ce domaine email n'est pas autorisé. Seuls les domaines professionnels de l'administration ivoirienne sont acceptés.",
        };
      }

      // 2. Rate limiting : max 5 OTP en 5 minutes
      const attempts = await db.getOtpAttempts(input.email, 5);
      if (attempts >= 5) {
        return {
          success: false,
          error: "rate_limited",
          message: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
        };
      }

      // 3. Générer le code OTP
      const code = generateOtpCode();

      // 4. Stocker en BDD
      await db.createOtp(input.email, code);

      // 5. Envoyer l'email via la gateway ANSUT
      const emailHtml = buildOtpEmailHtml(code);
      const result = await sendEmail({
        to: input.email,
        subject: "CarteCI — Code de vérification",
        content: emailHtml,
        isHtml: true,
      });

      // 6. Logger l'action
      await db.addLog({
        userId: ctx.user.id,
        action: "otp_send_email",
        details: `OTP envoyé à ${input.email} — ${result.success ? "succès" : "échec: " + result.error}`,
      });

      if (!result.success) {
        return {
          success: false,
          error: "send_failed",
          message: "L'envoi de l'email a échoué. Veuillez réessayer.",
        };
      }

      return {
        success: true,
        message: "Code de vérification envoyé à votre adresse email.",
      };
    }),

    /**
     * Vérifier le code OTP saisi par l'utilisateur
     * - Vérifie le code en BDD (non expiré, non utilisé)
     * - Met à jour l'email de l'utilisateur
     * - Active la carte de visite
     */
    verify: protectedProcedure.input(z.object({
      email: z.string().email(),
      code: z.string().length(6),
    })).mutation(async ({ ctx, input }) => {
      // 1. Vérifier le code OTP
      const valid = await db.verifyOtp(input.email, input.code);

      if (!valid) {
        await db.addLog({
          userId: ctx.user.id,
          action: "otp_verify_failed",
          details: `Vérification OTP échouée pour ${input.email}`,
        });
        return {
          success: false,
          error: "invalid_code",
          message: "Code invalide ou expiré. Veuillez réessayer.",
        };
      }

      // 2. Mettre à jour l'email de l'utilisateur et activer la carte
      await db.updateUserCard(ctx.user.id, { email: input.email });
      await db.updateUserStatus(ctx.user.id, "active");

      // 3. Logger le succès
      await db.addLog({
        userId: ctx.user.id,
        action: "otp_verify_success",
        details: `Email vérifié: ${input.email}`,
      });

      return {
        success: true,
        message: "Email vérifié avec succès. Votre carte est maintenant active.",
      };
    }),

    /**
     * Vérifier si l'utilisateur a déjà vérifié son email
     */
    status: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) return { verified: false, email: null };
      
      // Un utilisateur est considéré "vérifié" si son email est défini et sa carte est active
      const verified = !!user.email && user.cardStatus === "active";
      return { verified, email: user.email };
    }),
  }),

  // ==================== CARTE DE VISITE ====================
  card: router({
    getMyCard: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) return null;
      return {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        fonction: user.fonction,
        direction: user.direction,
        organisation: user.organisation,
        email: user.email,
        telephone: user.telephone,
        telephoneFixe: user.telephoneFixe,
        adresse: user.adresse,
        siteWeb: user.siteWeb,
        photoUrl: user.photoUrl,
        cardStatus: user.cardStatus,
      };
    }),

    updateMyCard: protectedProcedure.input(z.object({
      prenom: z.string().optional(),
      nom: z.string().optional(),
      fonction: z.string().optional(),
      direction: z.string().optional(),
      organisation: z.string().optional(),
      telephone: z.string().optional(),
      telephoneFixe: z.string().optional(),
      adresse: z.string().optional(),
      siteWeb: z.string().optional(),
      photoUrl: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await db.updateUserCard(ctx.user.id, input);
      await db.addLog({
        userId: ctx.user.id,
        action: "card_update",
        details: `Mise à jour carte de visite`,
      });
      return { success: true };
    }),

    getPublicCard: publicProcedure.input(z.object({
      userId: z.number(),
    })).query(async ({ input }) => {
      const user = await db.getUserById(input.userId);
      if (!user || user.cardStatus !== "active") return null;
      return {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        fonction: user.fonction,
        direction: user.direction,
        organisation: user.organisation,
        email: user.email,
        telephone: user.telephone,
        telephoneFixe: user.telephoneFixe,
        adresse: user.adresse,
        siteWeb: user.siteWeb,
        photoUrl: user.photoUrl,
      };
    }),
  }),

  // ==================== ADMIN ====================
  admin: router({
    stats: adminProcedure.query(async () => {
      return db.getDashboardStats();
    }),

    listUsers: adminProcedure.query(async () => {
      return db.getAllUsers();
    }),

    updateCardStatus: adminProcedure.input(z.object({
      userId: z.number(),
      status: z.enum(["active", "inactive", "pending"]),
    })).mutation(async ({ ctx, input }) => {
      await db.updateUserStatus(input.userId, input.status);
      await db.addLog({
        userId: ctx.user.id,
        action: "admin_card_status",
        details: `Statut carte #${input.userId} → ${input.status}`,
      });
      return { success: true };
    }),

    updateUserRole: adminProcedure.input(z.object({
      userId: z.number(),
      role: z.enum(["user", "admin", "superadmin"]),
    })).mutation(async ({ ctx, input }) => {
      await db.updateUserRole(input.userId, input.role);
      await db.addLog({
        userId: ctx.user.id,
        action: "admin_role_change",
        details: `Rôle utilisateur #${input.userId} → ${input.role}`,
      });
      return { success: true };
    }),

    listDomains: adminProcedure.query(async () => {
      return db.getAllDomains();
    }),

    addDomain: adminProcedure.input(z.object({
      domaine: z.string().min(3),
    })).mutation(async ({ ctx, input }) => {
      await db.addDomain(input.domaine);
      await db.addLog({
        userId: ctx.user.id,
        action: "admin_domain_add",
        details: `Domaine ajouté: ${input.domaine}`,
      });
      return { success: true };
    }),

    toggleDomain: adminProcedure.input(z.object({
      id: z.number(),
      actif: z.boolean(),
    })).mutation(async ({ ctx, input }) => {
      await db.toggleDomain(input.id, input.actif);
      await db.addLog({
        userId: ctx.user.id,
        action: "admin_domain_toggle",
        details: `Domaine #${input.id} → ${input.actif ? "actif" : "inactif"}`,
      });
      return { success: true };
    }),

    deleteDomain: adminProcedure.input(z.object({
      id: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await db.deleteDomain(input.id);
      await db.addLog({
        userId: ctx.user.id,
        action: "admin_domain_delete",
        details: `Domaine #${input.id} supprimé`,
      });
      return { success: true };
    }),

    recentLogs: adminProcedure.query(async () => {
      return db.getRecentLogs(100);
    }),
  }),
});

export type AppRouter = typeof appRouter;
