import { AI_DISCLAIMER, URGENT_MESSAGE, isUrgentDisclosure } from "./health-rules";

// Provider abstraction — swap implementations without touching routes/UI.
export interface AIProvider {
  name: string;
  respond(input: { message: string; history: { role: string; content: string }[]; contextSummary?: string; shameFree?: boolean }): Promise<string>;
}

export const HER_COMPANION_SYSTEM = `You are HER COMPANION, the HerCycle AI menstrual-health companion.
- Warm, respectful, non-judgmental, culturally sensitive, educational.
- NEVER diagnose (never say "you have PCOS/endometriosis/are pregnant/infertile").
- Use cautious language: "may be worth discussing with a healthcare professional".
- Distinguish "Based on what you recorded..." from general information.
- Explain uncertainty; never present estimates as certainty.
- Escalate urgent symptoms immediately with: "${URGENT_MESSAGE}"
- Never shame, judge sexual behavior, or pressure disclosure.
- Always identify as an AI assistant. Include disclaimer when giving health info: "${AI_DISCLAIMER}"
- Do not assume sexual activity, pregnancy intent, or partner status.`;

class MockProvider implements AIProvider {
  name = "mock";
  async respond({ message, contextSummary, shameFree }: { message: string; history: any[]; contextSummary?: string; shameFree?: boolean }): Promise<string> {
    if (isUrgentDisclosure(message)) return `${URGENT_MESSAGE}\n\n${AI_DISCLAIMER}`;
    const prefix = shameFree
      ? "There are no embarrassing menstrual-health questions here — thank you for trusting me. "
      : "";
    let body = "";
    const m = message.toLowerCase();
    if (m.includes("late")) body = "A late period can have several possible causes — including stress, sleep changes, illness, exercise changes, weight changes, or cycle variation. Based on what you recorded, check your cycle history and logged symptoms. If a period is significantly delayed or you have other concerning symptoms, consider a pregnancy test if applicable to you and/or speaking with a qualified healthcare professional.";
    else if (m.includes("cramp") || m.includes("pain")) body = "Cramps (abdominal or back pain around periods) are common and vary in intensity. Tracking when pain peaks, its score (0–10), locations, and what helps can be useful for a clinician. Severe, worsening, or function-limiting pain may be worth discussing with a healthcare professional.";
    else if (m.includes("heavy")) body = "Heavier-than-usual bleeding can have several possible causes. It may help to note flow levels (spotting/light/medium/heavy), pad/tampon changes, clots, and symptoms like dizziness or fatigue. Frequent heavy flow, or heavy flow with dizziness/faintness, deserves prompt medical attention.";
    else if (m.includes("irregular")) body = "Cycle length naturally varies. Your recorded pattern (range, shortest, longest) is shown in Insights. Persistent large variation can have several possible causes — your recorded cycle pattern may be worth discussing with a healthcare professional.";
    else if (m.includes("doctor") || m.includes("ask my doctor") || m.includes("appointment")) body = "For your appointment it can help to bring: last period dates, average cycle/period length, frequent symptoms, pain scores, medications, and 2–3 questions that matter most to you. I can help turn your notes into a short list — what concerns you most?";
    else if (m.includes("report")) body = "Your report summarizes recorded cycles, symptoms, pain and flow patterns plus cautious notable patterns. It is educational and based only on what you recorded — predictions and alerts may not be accurate.";
    else if (m.includes("stress")) body = "Stress, sleep disruption and illness can coincide with cycle changes for some people. Gentle self-care (sleep, hydration, movement you enjoy, journaling) may help wellbeing, though these do not treat medical conditions. Ongoing concerns deserve professional support.";
    else if (m.includes("embarrass")) body = "You deserve respectful, private support. Nothing you ask here is shameful. Ask in your own words, at your own pace — you never have to share more than you want to.";
    else body = "Thank you for sharing. I can explain cycle patterns, symptoms, tracking, reports, or help prepare questions for a clinician — all as educational information, not diagnosis. What would help most right now?";
    return `${prefix}${body}${contextSummary ? `\n\nBased on what you recorded: ${contextSummary}` : ""}\n\n${AI_DISCLAIMER}`;
  }
}

// Stubs for future vendors — implement `respond` with fetch to vendor API server-side only.
class VendorStub implements AIProvider {
  constructor(public name: string) {}
  async respond(): Promise<string> {
    return `${AI_DISCLAIMER}\n\nThe configured AI vendor is not enabled in this deployment. Please set server API keys. Meanwhile, I can still help with tracking, reports, and general educational information.`;
  }
}

export function getProvider(): AIProvider {
  const p = (process.env.AI_PROVIDER || "mock").toLowerCase();
  if (p === "openai" || p === "anthropic" || p === "gemini") return new VendorStub(p);
  return new MockProvider();
}
