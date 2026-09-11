export const strings = {
  en: {
    appName: "HerCycle AI", tagline: "Track. Understand. Ask. Care.",
    logToday: "+ Log Today", nextPeriod: "Next period", currentCycle: "Current cycle",
    disclaimer: "HerCycle AI provides menstrual tracking, educational information, and supportive health insights. It does not provide medical diagnosis, treatment, or emergency services. Predictions and alerts are based on information you record and may not be accurate. Contact a qualified healthcare professional for medical concerns.",
    fertilityNote: "Cycle-based fertility predictions are estimates and should not be relied upon as the sole method of contraception.",
    needMoreData: "More cycle records are needed before reliable estimates can be shown.",
  },
};
export type Locale = keyof typeof strings;
export function t(locale: string, key: keyof (typeof strings)["en"]): string {
  const l = (strings as any)[locale] ?? strings.en;
  return l[key] ?? (strings.en as any)[key];
}
