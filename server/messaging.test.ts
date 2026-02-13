import { describe, expect, it, vi } from "vitest";
import { generateOtpCode, buildOtpEmailHtml, buildOtpSmsContent } from "./messaging";

describe("messaging module", () => {
  describe("generateOtpCode", () => {
    it("generates a 6-digit numeric code", () => {
      const code = generateOtpCode();
      expect(code).toMatch(/^\d{6}$/);
      expect(parseInt(code)).toBeGreaterThanOrEqual(100000);
      expect(parseInt(code)).toBeLessThanOrEqual(999999);
    });

    it("generates different codes on successive calls", () => {
      const codes = new Set<string>();
      for (let i = 0; i < 20; i++) {
        codes.add(generateOtpCode());
      }
      // At least 10 unique codes out of 20 (very unlikely to have many collisions)
      expect(codes.size).toBeGreaterThan(10);
    });
  });

  describe("buildOtpEmailHtml", () => {
    it("includes the OTP code in the HTML", () => {
      const code = "123456";
      const html = buildOtpEmailHtml(code);
      expect(html).toContain(code);
      expect(html).toContain("CarteCI");
      expect(html).toContain("Vérification");
      expect(html).toContain("10 minutes");
      expect(html).toContain("ANSUT");
    });

    it("produces valid HTML structure", () => {
      const html = buildOtpEmailHtml("654321");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
      expect(html).toContain("#FF6B00"); // CI orange
      expect(html).toContain("#009E60"); // CI green
    });
  });

  describe("buildOtpSmsContent", () => {
    it("includes the OTP code in the SMS text", () => {
      const code = "789012";
      const sms = buildOtpSmsContent(code);
      expect(sms).toContain(code);
      expect(sms).toContain("CarteCI");
      expect(sms).toContain("10 minutes");
    });
  });

  describe("ANSUT Gateway credentials", () => {
    it("has ANSUT_GATEWAY_URL configured", () => {
      const url = process.env.ANSUT_GATEWAY_URL;
      expect(url).toBeDefined();
      expect(url).toBeTruthy();
      expect(url).toContain("http");
    });

    it("has ANSUT_USERNAME configured", () => {
      const username = process.env.ANSUT_USERNAME;
      expect(username).toBeDefined();
      expect(username).toBeTruthy();
    });

    it("has ANSUT_PASSWORD configured", () => {
      const password = process.env.ANSUT_PASSWORD;
      expect(password).toBeDefined();
      expect(password).toBeTruthy();
    });
  });
});
