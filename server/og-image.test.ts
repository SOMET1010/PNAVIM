import { describe, expect, it } from "vitest";
import { generateOgSvg, generateOgMeta } from "./og-image";

describe("og-image", () => {
  describe("generateOgSvg", () => {
    it("generates valid SVG with correct dimensions", () => {
      const svg = generateOgSvg({
        prenom: "Aya",
        nom: "Kouassi",
        fonction: "Directrice des Systèmes d'Information",
        direction: "DTDI",
        organisation: "ANSUT",
        email: "aya.kouassi@ansut.ci",
        telephone: "07 08 09 10 11",
        photoUrl: null,
      });

      expect(svg).toContain('width="1200"');
      expect(svg).toContain('height="630"');
      expect(svg).toContain("Aya Kouassi");
      expect(svg).toContain("ANSUT");
      expect(svg).toContain("DTDI");
      expect(svg).toContain("aya.kouassi@ansut.ci");
      expect(svg).toContain("+225");
      expect(svg).toContain("AK"); // initials
    });

    it("generates SVG with default values for empty data", () => {
      const svg = generateOgSvg({
        prenom: null,
        nom: null,
        fonction: null,
        direction: null,
        organisation: null,
        email: null,
        telephone: null,
        photoUrl: null,
      });

      expect(svg).toContain('width="1200"');
      expect(svg).toContain("Agent CI");
      expect(svg).toContain("CI"); // default initials
    });

    it("escapes XML special characters", () => {
      const svg = generateOgSvg({
        prenom: "Jean<script>",
        nom: 'Dupont&"test"',
        fonction: null,
        direction: null,
        organisation: null,
        email: null,
        telephone: null,
        photoUrl: null,
      });

      expect(svg).not.toContain("<script>");
      expect(svg).toContain("&lt;script&gt;");
      expect(svg).toContain("&amp;");
    });

    it("truncates long text", () => {
      const longName = "A".repeat(100);
      const svg = generateOgSvg({
        prenom: longName,
        nom: null,
        fonction: null,
        direction: null,
        organisation: null,
        email: null,
        telephone: null,
        photoUrl: null,
      });

      // Name should be truncated to 40 chars
      expect(svg).toContain("…");
    });

    it("includes CI tricolor elements", () => {
      const svg = generateOgSvg({
        prenom: "Test",
        nom: "User",
        fonction: null,
        direction: null,
        organisation: null,
        email: null,
        telephone: null,
        photoUrl: null,
      });

      expect(svg).toContain("#FF6B00"); // orange
      expect(svg).toContain("#009E60"); // green
      expect(svg).toContain("ANSUT");
    });
  });

  describe("generateOgMeta", () => {
    it("generates correct metadata for a complete card", () => {
      const meta = generateOgMeta({
        userId: 42,
        prenom: "Aya",
        nom: "Kouassi",
        fonction: "Directrice DSI",
        direction: "DTDI",
        organisation: "ANSUT",
        email: "aya@ansut.ci",
        telephone: "07 08 09 10 11",
        photoUrl: null,
      }, "https://carteci.manus.space");

      expect(meta.title).toBe("Aya Kouassi — CarteCI");
      expect(meta.description).toContain("Aya Kouassi");
      expect(meta.description).toContain("Directrice DSI");
      expect(meta.description).toContain("ANSUT");
      expect(meta.imageUrl).toBe("https://carteci.manus.space/api/og/42");
      expect(meta.cardUrl).toBe("https://carteci.manus.space/carte/42");
    });

    it("generates fallback metadata for minimal data", () => {
      const meta = generateOgMeta({
        userId: 1,
        prenom: null,
        nom: null,
        fonction: null,
        direction: null,
        organisation: null,
        email: null,
        telephone: null,
        photoUrl: null,
      }, "https://example.com");

      expect(meta.title).toBe("Agent CI — CarteCI");
      expect(meta.description).toContain("Agent CI");
      expect(meta.imageUrl).toBe("https://example.com/api/og/1");
    });
  });
});
