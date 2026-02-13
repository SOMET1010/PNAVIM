import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock le module messaging pour éviter les appels réseau réels
vi.mock("./messaging", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true, messageId: "mock-123" }),
  generateOtpCode: vi.fn().mockReturnValue("123456"),
  buildOtpEmailHtml: vi.fn().mockReturnValue("<html>OTP: 123456</html>"),
}));

// Mock le module db pour les fonctions OTP
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    isDomainAllowed: vi.fn().mockImplementation(async (email: string) => {
      const domain = email.split("@")[1];
      return ["gouv.ci", "ansut.ci", "telecom.gouv.ci"].includes(domain);
    }),
    getOtpAttempts: vi.fn().mockResolvedValue(0),
    createOtp: vi.fn().mockResolvedValue(undefined),
    verifyOtp: vi.fn().mockImplementation(async (_email: string, code: string) => {
      return code === "123456";
    }),
    getUserById: vi.fn().mockResolvedValue({
      id: 1,
      openId: "test-user",
      email: "test@gouv.ci",
      name: "Test User",
      prenom: "Test",
      nom: "User",
      fonction: "Agent",
      direction: "Direction Test",
      organisation: "Ministère Test",
      telephone: "0700000000",
      telephoneFixe: null,
      adresse: null,
      siteWeb: null,
      photoUrl: null,
      cardStatus: "active",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }),
    updateUserCard: vi.fn().mockResolvedValue(undefined),
    updateUserStatus: vi.fn().mockResolvedValue(undefined),
    addLog: vi.fn().mockResolvedValue(undefined),
  };
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(overrides?: Partial<AuthenticatedUser>) {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@gouv.ci",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return ctx;
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("otp routes", () => {
  describe("otp.checkDomain", () => {
    it("allows @gouv.ci domain", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.checkDomain({ email: "test@gouv.ci" });
      expect(result.allowed).toBe(true);
    });

    it("allows @ansut.ci domain", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.checkDomain({ email: "test@ansut.ci" });
      expect(result.allowed).toBe(true);
    });

    it("allows @telecom.gouv.ci domain", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.checkDomain({ email: "test@telecom.gouv.ci" });
      expect(result.allowed).toBe(true);
    });

    it("rejects @gmail.com domain", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.checkDomain({ email: "test@gmail.com" });
      expect(result.allowed).toBe(false);
    });

    it("rejects unauthenticated users", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.otp.checkDomain({ email: "test@gouv.ci" })).rejects.toThrow();
    });
  });

  describe("otp.sendEmail", () => {
    it("sends OTP to allowed domain", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.sendEmail({ email: "agent@gouv.ci" });
      expect(result.success).toBe(true);
      expect(result.message).toContain("envoyé");
    });

    it("rejects non-allowed domain", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.sendEmail({ email: "test@gmail.com" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("domain_not_allowed");
    });

    it("rejects unauthenticated users", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.otp.sendEmail({ email: "test@gouv.ci" })).rejects.toThrow();
    });
  });

  describe("otp.verify", () => {
    it("verifies correct OTP code", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.verify({ email: "agent@gouv.ci", code: "123456" });
      expect(result.success).toBe(true);
      expect(result.message).toContain("vérifié");
    });

    it("rejects incorrect OTP code", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.verify({ email: "agent@gouv.ci", code: "000000" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("invalid_code");
    });

    it("rejects unauthenticated users", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.otp.verify({ email: "test@gouv.ci", code: "123456" })).rejects.toThrow();
    });
  });

  describe("otp.status", () => {
    it("returns verified status for user with active card and email", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.otp.status();
      expect(result.verified).toBe(true);
      expect(result.email).toBe("test@gouv.ci");
    });

    it("rejects unauthenticated users", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      await expect(caller.otp.status()).rejects.toThrow();
    });
  });
});
