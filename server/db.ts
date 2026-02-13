import { eq, and, desc, sql, gte, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, domains, logs, otpCodes, type InsertDomain, type InsertLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USERS ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'superadmin';
      updateSet.role = 'superadmin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserCard(userId: number, data: {
  prenom?: string | null;
  nom?: string | null;
  fonction?: string | null;
  direction?: string | null;
  organisation?: string | null;
  telephone?: string | null;
  telephoneFixe?: string | null;
  adresse?: string | null;
  siteWeb?: string | null;
  photoUrl?: string | null;
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserStatus(userId: number, status: "active" | "inactive" | "pending") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ cardStatus: status }).where(eq(users.id, userId));
}

export async function updateUserRole(userId: number, role: "user" | "admin" | "superadmin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

// ==================== DOMAINS ====================

export async function getAllDomains() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(domains).orderBy(desc(domains.createdAt));
}

export async function getActiveDomains() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(domains).where(eq(domains.actif, true));
}

export async function addDomain(domaine: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(domains).values({ domaine }).onDuplicateKeyUpdate({ set: { actif: true } });
}

export async function toggleDomain(id: number, actif: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(domains).set({ actif }).where(eq(domains.id, id));
}

export async function deleteDomain(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(domains).where(eq(domains.id, id));
}

export async function isDomainAllowed(email: string): Promise<boolean> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  const activeDomains = await getActiveDomains();
  return activeDomains.some(d => domain.endsWith(d.domaine.toLowerCase()));
}

// ==================== LOGS ====================

export async function addLog(data: { userId?: number; action: string; details?: string; ipAddress?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(logs).values(data);
}

export async function getRecentLogs(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(logs).orderBy(desc(logs.timestamp)).limit(limit);
}

// ==================== OTP ====================

export async function createOtp(email: string, code: string) {
  const db = await getDb();
  if (!db) return;
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await db.insert(otpCodes).values({ email, code, expiresAt });
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(otpCodes).where(
    and(
      eq(otpCodes.email, email),
      eq(otpCodes.code, code),
      eq(otpCodes.used, false),
      gte(otpCodes.expiresAt, new Date())
    )
  ).limit(1);

  if (result.length === 0) return false;

  // Mark as used
  await db.update(otpCodes).set({ used: true }).where(eq(otpCodes.id, result[0].id));
  return true;
}

export async function getOtpAttempts(email: string, minutes = 5): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const since = new Date(Date.now() - minutes * 60 * 1000);
  const result = await db.select({ count: count() }).from(otpCodes).where(
    and(
      eq(otpCodes.email, email),
      gte(otpCodes.createdAt, since)
    )
  );
  return result[0]?.count ?? 0;
}

// ==================== STATS ====================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, activeCards: 0, inactiveCards: 0, pendingCards: 0 };

  const [totalResult] = await db.select({ count: count() }).from(users);
  const [activeResult] = await db.select({ count: count() }).from(users).where(eq(users.cardStatus, "active"));
  const [inactiveResult] = await db.select({ count: count() }).from(users).where(eq(users.cardStatus, "inactive"));
  const [pendingResult] = await db.select({ count: count() }).from(users).where(eq(users.cardStatus, "pending"));

  return {
    totalUsers: totalResult?.count ?? 0,
    activeCards: activeResult?.count ?? 0,
    inactiveCards: inactiveResult?.count ?? 0,
    pendingCards: pendingResult?.count ?? 0,
  };
}
