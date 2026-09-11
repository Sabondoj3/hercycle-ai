import { describe, it, expect } from "vitest";
import { summarizeCycles, predictNext, periodDurationDays } from "../src/lib/cycle";
import { evaluateRules, isUrgentDisclosure } from "../src/lib/health-rules";
import { registerSchema } from "../src/lib/validation";

describe("cycle math", () => {
  it("computes lengths and averages", () => {
    const starts = [new Date("2026-05-01"), new Date("2026-05-29"), new Date("2026-06-26")];
    const s = summarizeCycles(starts, [5, 5, 5]);
    expect(s.count).toBe(2);
    expect(Math.round(s.avgCycleLength!)).toBe(28);
    expect(s.variation).toBe(0);
  });
  it("returns insufficient with <2 cycles", () => {
    const p = predictNext([new Date("2026-06-01")], null, null);
    expect(p.confidence).toBe("insufficient");
    expect(p.nextPeriodStart).toBeNull();
  });
  it("never fabricates: needs data", () => {
    const p = predictNext([], 28, 5);
    expect(p.nextPeriodStart).toBeNull();
  });
});

describe("health alerts — never diagnostic", () => {
  it("flags repeated short cycles with cautious wording", () => {
    const a = evaluateRules({ cycleLengths: [19, 20, 28], periodDurations: [5], heavyDays: 0, severePainDays: 0, heavyPlusDizzyDays: 0, spottingBetween: 0 });
    expect(a.some((x) => x.ruleId === "very_short_cycle")).toBe(true);
    for (const x of a) expect(x.message.toLowerCase()).not.toMatch(/you have (pcos|endometriosis|pmdd)/);
  });
  it("escalates heavy+dizzy as red urgent", () => {
    const a = evaluateRules({ cycleLengths: [28], periodDurations: [5], heavyDays: 2, severePainDays: 0, heavyPlusDizzyDays: 1, spottingBetween: 0 });
    expect(a.some((x) => x.level === "red")).toBe(true);
  });
  it("detects urgent disclosures", () => {
    expect(isUrgentDisclosure("I fainted and bleeding heavily")).toBe(true);
    expect(isUrgentDisclosure("mild cramps today")).toBe(false);
  });
  it("no alert message contains a diagnosis", () => {
    const banned = ["you have pcos", "you have endometriosis", "you are pregnant", "you are infertile"];
    const all = evaluateRules({ cycleLengths: [19, 18], periodDurations: [9], heavyDays: 5, severePainDays: 5, heavyPlusDizzyDays: 1, spottingBetween: 2 });
    for (const x of all) for (const b of banned) expect(x.message.toLowerCase()).not.toContain(b);
  });
});

describe("validation", () => {
  it("rejects weak passwords", () => {
    const r = registerSchema.safeParse({ fullName: "A B", email: "a@b.com", password: "weakpassword1", dateOfBirth: "2000-01-01", country: "SL", consentPrivacy: true, consentTerms: true });
    expect(r.success).toBe(false);
  });
});
