import { differenceInCalendarDays, addDays } from "date-fns";

export interface CycleInput { startDate: Date; endDate?: Date | null }

export function periodDurationDays(start: Date, end?: Date | null): number | null {
  if (!end) return null;
  return differenceInCalendarDays(end, start) + 1;
}

export function cycleLengths(starts: Date[]): number[] {
  const sorted = [...starts].sort((a, b) => a.getTime() - b.getTime());
  const out: number[] = [];
  for (let i = 1; i < sorted.length; i++) out.push(differenceInCalendarDays(sorted[i], sorted[i - 1]));
  return out;
}

export interface CycleStats {
  count: number; // completed cycles (lengths available)
  avgCycleLength: number | null;
  avgPeriodLength: number | null;
  shortest: number | null;
  longest: number | null;
  variation: number | null;
}

export function summarizeCycles(starts: Date[], durations: (number | null)[]): CycleStats {
  const lengths = cycleLengths(starts);
  const validDur = durations.filter((d): d is number => typeof d === "number");
  const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  return {
    count: lengths.length,
    avgCycleLength: avg(lengths),
    avgPeriodLength: avg(validDur),
    shortest: lengths.length ? Math.min(...lengths) : null,
    longest: lengths.length ? Math.max(...lengths) : null,
    variation: lengths.length >= 2 ? Math.max(...lengths) - Math.min(...lengths) : null,
  };
}

export interface Prediction {
  nextPeriodStart: Date | null;
  nextPeriodEnd: Date | null;
  fertileStart: Date | null;
  fertileEnd: Date | null;
  ovulationDate: Date | null;
  confidence: "insufficient" | "low" | "moderate" | "high";
  explanation: string;
}

/** Estimate-based prediction. Fertile window/ovulation are ESTIMATES only. */
export function predictNext(starts: Date[], avgLen: number | null, avgPeriod: number | null): Prediction {
  const none: Prediction = {
    nextPeriodStart: null, nextPeriodEnd: null, fertileStart: null, fertileEnd: null,
    ovulationDate: null, confidence: "insufficient",
    explanation: "More cycle records are needed before reliable estimates can be shown (at least 2 completed cycles).",
  };
  if (!starts.length || avgLen == null) return none;
  const lengths = cycleLengths(starts);
  if (lengths.length < 1) return none;
  const last = [...starts].sort((a, b) => a.getTime() - b.getTime()).at(-1)!;
  const next = addDays(last, Math.round(avgLen));
  const periodLen = avgPeriod ? Math.round(avgPeriod) : 5;
  const ovulation = addDays(next, -14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);
  const variation = lengths.length >= 2 ? Math.max(...lengths) - Math.min(...lengths) : 99;
  const confidence = lengths.length < 2 ? "low" : variation <= 3 ? "high" : variation <= 7 ? "moderate" : "low";
  return {
    nextPeriodStart: next,
    nextPeriodEnd: addDays(next, periodLen - 1),
    fertileStart, fertileEnd, ovulationDate: ovulation, confidence,
    explanation:
      confidence === "high"
        ? `Based on ${lengths.length} completed cycles with low variation (±${variation} days). Fertility estimates are approximate.`
        : `Based on ${lengths.length} completed cycle(s) with variation of ${lengths.length >= 2 ? variation + " days" : "unknown"}. Estimates become more reliable as more cycles are recorded.`,
  };
}

export function regularityLabel(variation: number | null, count: number): string {
  if (count < 2 || variation == null) return "Not enough data";
  if (variation <= 3) return "Regular";
  if (variation <= 7) return "Some variation";
  return "Irregular pattern";
}
