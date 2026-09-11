import rules from "@/data/health-rules.json";

export type AlertLevel = "green" | "yellow" | "orange" | "red";

export interface AlertInput {
  cycleLengths: number[];
  periodDurations: (number | null)[];
  heavyDays: number;
  severePainDays: number;
  heavyPlusDizzyDays: number;
  spottingBetween: number;
}

export interface HealthAlertOut { ruleId: string; level: AlertLevel; title: string; message: string; evidence: string }

// Screening/support logic — NEVER diagnostic wording. All messages come from rule config.
export function evaluateRules(input: AlertInput): HealthAlertOut[] {
  const out: HealthAlertOut[] = [];
  const byId = Object.fromEntries((rules as any[]).map((r) => [r.rule_id, r]));
  const short = input.cycleLengths.filter((l) => l < 21).length;
  if (short >= 2) out.push(mk(byId["very_short_cycle"], `${short} recorded cycles under 21 days.`));
  const long = input.cycleLengths.filter((l) => l > 45).length;
  if (long >= 2) out.push(mk(byId["very_long_cycle"], `${long} recorded cycles over 45 days.`));
  if (input.cycleLengths.length >= 3) {
    const range = Math.max(...input.cycleLengths) - Math.min(...input.cycleLengths);
    if (range > 10) out.push(mk(byId["high_variation"], `Range of ${range} days across recent cycles.`));
  }
  if (input.periodDurations.some((d) => (d ?? 0) >= 8))
    out.push(mk(byId["prolonged_bleeding"], "At least one recorded period lasted 8+ days."));
  if (input.severePainDays >= 3) out.push(mk(byId["severe_pain"], `${input.severePainDays} days with pain 8–10 recorded.`));
  if (input.heavyPlusDizzyDays >= 1) out.push(mk(byId["heavy_plus_dizzy"], "Heavy flow recorded alongside dizziness."));
  return out;
}

function mk(rule: any, evidence: string): HealthAlertOut {
  return { ruleId: rule.rule_id, level: rule.severity as AlertLevel, title: rule.rule_name, message: rule.recommendation_text, evidence };
}

const URGENT = [/faint/i, /passed out/i, /collapse/i, /soak.*pad.*hour/i, /bleeding.*(heavily|uncontroll|very heavy)/i, /severe.*(pelvic|abdominal).*pain/i, /suicid/i, /kill myself/i, /pregnant.*bleed/i];

export function isUrgentDisclosure(text: string): boolean {
  return URGENT.some((r) => r.test(text));
}

export const URGENT_MESSAGE =
  "Your symptoms may require urgent medical attention. Please contact local emergency services, go to the nearest emergency department, or seek immediate help from a qualified healthcare professional.";

export const AI_DISCLAIMER =
  "I can help you understand menstrual-health information and your recorded patterns, but I cannot diagnose medical conditions or replace a qualified healthcare professional.";
