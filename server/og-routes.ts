/**
 * Routes Express pour les métadonnées Open Graph
 * 
 * 1. GET /api/og/:userId — Sert l'image OG en SVG pour la carte de visite
 * 2. Middleware SSR — Intercepte /carte/:id pour les crawlers sociaux et injecte les balises OG
 */

import type { Express, Request, Response, NextFunction } from "express";
import { getUserById } from "./db";
import { generateOgSvg, generateOgMeta } from "./og-image";

/**
 * Liste des User-Agents des crawlers de réseaux sociaux
 * qui ont besoin des balises OG dans le HTML
 */
const SOCIAL_CRAWLERS = [
  "facebookexternalhit",
  "Facebot",
  "LinkedInBot",
  "Twitterbot",
  "WhatsApp",
  "Slackbot",
  "TelegramBot",
  "Discordbot",
  "Googlebot",
  "bingbot",
  "Pinterestbot",
];

/**
 * Vérifie si le User-Agent correspond à un crawler de réseau social
 */
function isSocialCrawler(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  return SOCIAL_CRAWLERS.some((bot) => userAgent.includes(bot));
}

/**
 * Obtient l'URL de base à partir de la requête
 */
function getBaseUrl(req: Request): string {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  return `${protocol}://${host}`;
}

/**
 * Enregistre les routes OG sur l'application Express
 */
export function registerOgRoutes(app: Express): void {
  /**
   * Route 1 : Servir l'image OG en SVG
   * GET /api/og/:userId
   */
  app.get("/api/og/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId) || userId <= 0) {
        res.status(400).send("Invalid user ID");
        return;
      }

      const user = await getUserById(userId);
      if (!user || user.cardStatus !== "active") {
        // Retourner une image OG par défaut pour les cartes inactives
        const defaultSvg = generateOgSvg({
          prenom: "Carte",
          nom: "Introuvable",
          fonction: null,
          direction: null,
          organisation: "CarteCI — ANSUT",
          email: null,
          telephone: null,
          photoUrl: null,
        });
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "public, max-age=60");
        res.send(defaultSvg);
        return;
      }

      const svg = generateOgSvg({
        prenom: user.prenom,
        nom: user.nom,
        fonction: user.fonction,
        direction: user.direction,
        organisation: user.organisation,
        email: user.email,
        telephone: user.telephone,
        photoUrl: user.photoUrl,
      });

      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
      res.send(svg);
    } catch (error) {
      console.error("[OG Image] Error generating OG image:", error);
      res.status(500).send("Internal server error");
    }
  });

  /**
   * Route 2 : Middleware SSR pour les crawlers sociaux
   * Intercepte les requêtes /carte/:id des bots et injecte les balises OG
   */
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    // Ne traiter que les requêtes GET sur /carte/:id
    const match = req.path.match(/^\/carte\/(\d+)$/);
    if (!match || req.method !== "GET") {
      next();
      return;
    }

    // Ne traiter que les crawlers sociaux
    const userAgent = req.headers["user-agent"];
    if (!isSocialCrawler(userAgent)) {
      next();
      return;
    }

    try {
      const userId = parseInt(match[1]);
      if (isNaN(userId) || userId <= 0) {
        next();
        return;
      }

      const user = await getUserById(userId);
      const baseUrl = getBaseUrl(req);

      if (!user || user.cardStatus !== "active") {
        // Carte introuvable — servir un HTML minimal avec OG par défaut
        const html = buildOgHtml({
          title: "Carte introuvable — CarteCI",
          description: "Cette carte de visite n'existe pas ou n'est plus active.",
          imageUrl: `${baseUrl}/api/og/${userId}`,
          cardUrl: `${baseUrl}/carte/${userId}`,
        }, baseUrl);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(html);
        return;
      }

      const meta = generateOgMeta({ ...user, userId }, baseUrl);
      const html = buildOgHtml(meta, baseUrl);

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=300");
      res.send(html);
    } catch (error) {
      console.error("[OG SSR] Error serving OG meta:", error);
      next();
    }
  });
}

/**
 * Construit un document HTML minimal avec les balises Open Graph
 * pour les crawlers sociaux
 */
function buildOgHtml(
  meta: { title: string; description: string; imageUrl: string; cardUrl: string },
  baseUrl: string
): string {
  return `<!DOCTYPE html>
<html lang="fr" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:image" content="${escapeHtml(meta.imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/svg+xml">
  <meta property="og:url" content="${escapeHtml(meta.cardUrl)}">
  <meta property="og:site_name" content="CarteCI — ANSUT">
  <meta property="og:locale" content="fr_CI">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  <meta name="twitter:image" content="${escapeHtml(meta.imageUrl)}">
  <meta name="twitter:image:alt" content="Carte de visite de ${escapeHtml(meta.title)}">

  <!-- LinkedIn specific -->
  <meta property="og:image:secure_url" content="${escapeHtml(meta.imageUrl)}">

  <!-- Canonical URL -->
  <link rel="canonical" href="${escapeHtml(meta.cardUrl)}">

  <!-- Redirect browsers (non-crawlers) to the SPA -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(meta.cardUrl)}">
</head>
<body>
  <h1>${escapeHtml(meta.title)}</h1>
  <p>${escapeHtml(meta.description)}</p>
  <p><a href="${escapeHtml(meta.cardUrl)}">Voir la carte de visite</a></p>
  <p>Propulsé par <a href="${escapeHtml(baseUrl)}">CarteCI</a> — ANSUT, Côte d'Ivoire</p>
</body>
</html>`;
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
