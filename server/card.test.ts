import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type CookieCall = {
  name: string;
  options: Record<string, unknown>;
};

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUserContext(overrides: Partial<AuthenticatedUser> = {}): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-open-id",
    email: "agent@gouv.ci",
    name: "Agent Test",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    prenom: null,
    nom: null,
    fonction: null,
    direction: null,
    organisation: null,
    telephone: null,
    telephoneFixe: null,
    adresse: null,
    siteWeb: null,
    photoUrl: null,
    cardStatus: "pending",
    ...overrides,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createAdminContext(overrides: Partial<AuthenticatedUser> = {}): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  return createUserContext({ role: "admin", ...overrides });
}

function createSuperAdminContext(overrides: Partial<AuthenticatedUser> = {}): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  return createUserContext({ role: "superadmin", ...overrides });
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

describe("auth.me", () => {
  it("returns user data when authenticated", async () => {
    const { ctx } = createUserContext({ email: "agent@gouv.ci", name: "Agent Test" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeTruthy();
    expect(result?.email).toBe("agent@gouv.ci");
    expect(result?.name).toBe("Agent Test");
  });

  it("returns null when not authenticated", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

describe("card.getMyCard", () => {
  it("rejects unauthenticated access", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.card.getMyCard()).rejects.toThrow();
  });
});

describe("card.updateMyCard", () => {
  it("rejects unauthenticated access", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.card.updateMyCard({ prenom: "Test", nom: "User" })
    ).rejects.toThrow();
  });
});

describe("card.getPublicCard", () => {
  it("accepts public access with userId", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // Should not throw, even if user doesn't exist (returns null)
    const result = await caller.card.getPublicCard({ userId: 99999 });
    expect(result).toBeNull();
  });
});

describe("admin routes", () => {
  it("rejects non-admin access to stats", async () => {
    const { ctx } = createUserContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("rejects non-admin access to listUsers", async () => {
    const { ctx } = createUserContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.listUsers()).rejects.toThrow();
  });

  it("rejects non-admin access to listDomains", async () => {
    const { ctx } = createUserContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.listDomains()).rejects.toThrow();
  });

  it("allows admin access to stats", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.stats();
    expect(result).toHaveProperty("totalUsers");
    expect(result).toHaveProperty("activeCards");
    expect(result).toHaveProperty("inactiveCards");
    expect(result).toHaveProperty("pendingCards");
  });

  it("allows superadmin access to stats", async () => {
    const { ctx } = createSuperAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.stats();
    expect(result).toHaveProperty("totalUsers");
  });

  it("allows admin access to listDomains", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.listDomains();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows admin access to listUsers", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.listUsers();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows admin access to recentLogs", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.recentLogs();
    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects unauthenticated access to admin", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.stats()).rejects.toThrow();
  });
});
