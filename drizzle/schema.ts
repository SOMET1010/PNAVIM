import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Table USERS — Agents de l'administration ivoirienne
 * Combine l'auth Manus OAuth avec les données de carte de visite
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "superadmin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),

  // Champs carte de visite
  prenom: varchar("prenom", { length: 100 }),
  nom: varchar("nom", { length: 100 }),
  fonction: varchar("fonction", { length: 200 }),
  direction: varchar("direction", { length: 200 }),
  organisation: varchar("organisation", { length: 200 }),
  telephone: varchar("telephone", { length: 30 }),
  telephoneFixe: varchar("telephoneFixe", { length: 30 }),
  adresse: text("adresse"),
  siteWeb: varchar("siteWeb", { length: 300 }),
  photoUrl: text("photoUrl"),
  
  // Statut de la carte
  cardStatus: mysqlEnum("cardStatus", ["active", "inactive", "pending"]).default("pending").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Table DOMAINS — Whitelist des domaines email autorisés
 */
export const domains = mysqlTable("domains", {
  id: int("id").autoincrement().primaryKey(),
  domaine: varchar("domaine", { length: 200 }).notNull().unique(),
  actif: boolean("actif").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Domain = typeof domains.$inferSelect;
export type InsertDomain = typeof domains.$inferInsert;

/**
 * Table LOGS — Journalisation des actions
 */
export const logs = mysqlTable("logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 200 }).notNull(),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;

/**
 * Table OTP_CODES — Codes OTP pour vérification email
 */
export const otpCodes = mysqlTable("otp_codes", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  used: boolean("used").default(false).notNull(),
  attempts: int("attempts").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OtpCode = typeof otpCodes.$inferSelect;
export type InsertOtpCode = typeof otpCodes.$inferInsert;
