# Health Rules

Source of truth: `src/data/health-rules.json` (mirrored to `health_rules` table by seed). Each rule: rule_id, rule_name, description, evidence_source, threshold, severity (yellow/orange/red), recommendation_text (cautious, non-diagnostic), clinician_review_required, date_last_reviewed.

Current placeholders REQUIRE clinician review against ACOG/NHS/WHO guidance before production — thresholds (e.g. <21 / >45 days, 8-day bleeding, pain≥8×3d) are conservative tripwires, not diagnoses. GREEN = no pattern; YELLOW = monitor/discuss; ORANGE = evaluation may be appropriate; RED = urgent care message.

Never add disease-naming text to recommendation_text. Tests enforce this.
