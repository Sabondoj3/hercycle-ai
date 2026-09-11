# AI Safety

Her Companion rules (enforced in `HER_COMPANION_SYSTEM` + mock provider + tests):

1. Never diagnose (ban: “you have PCOS/endometriosis/are pregnant/infertile”).
2. Cautious language only (“may be worth discussing with a healthcare professional”).
3. Distinguish “Based on what you recorded…” from general info.
4. Fertility = estimates, never contraception-grade.
5. Urgent escalation: fainting/severe bleeding/severe sudden pain/suicidal disclosure → urgent message, stop wellness advice.
6. No shame/judgment/pressure; culturally sensitive; no assumptions about sexual activity/pregnancy intent.
7. Identify as AI; disclaimer on health content.
8. Minimal data to vendors; vendor keys server-side only; retrieval limited to reviewed articles.

Tests in `tests/safety.test.ts` assert: no diagnostic strings in any alert path, urgent regex coverage, insufficient-data behavior.
