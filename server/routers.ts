import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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

  // ==================== CARTE DE VISITE ====================
  card: router({
    // Récupérer les données de la carte de l'utilisateur connecté
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

    // Mettre à jour les données de la carte
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

    // Récupérer la carte publique d'un utilisateur par ID
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
    // Dashboard stats
    stats: adminProcedure.query(async () => {
      return db.getDashboardStats();
    }),

    // Liste de tous les utilisateurs
    listUsers: adminProcedure.query(async () => {
      return db.getAllUsers();
    }),

    // Modifier le statut d'une carte
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

    // Modifier le rôle d'un utilisateur
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

    // Gestion des domaines
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

    // Logs
    recentLogs: adminProcedure.query(async () => {
      return db.getRecentLogs(100);
    }),
  }),
});

export type AppRouter = typeof appRouter;
