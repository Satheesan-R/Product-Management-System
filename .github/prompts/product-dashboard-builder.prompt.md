---
name: "Product Dashboard Builder"
description: "Build or upgrade a polished Product Management dashboard with CRUD, search, validation, persistence, and polished UX."
argument-hint: "Share stack constraints, product fields, and any style or behavior overrides"
agent: "agent"
---
Build or upgrade the current workspace into a polished Product Management dashboard.

Primary outcome:
- A clean, production-ready dashboard inspired by Linear and Notion.
- Warm neutral palette with a coral accent.
- Minimal, intentional UI with clear hierarchy and responsive behavior.

Default functional requirements:
1. Product CRUD:
- Create, read, update, and delete product records.
- Use modal dialogs for add and edit flows.
- Add delete confirmation safeguards.

2. Search and filtering:
- Real-time filtering by product name and description.
- Keep UX snappy for moderate local datasets.

3. Validation:
- Use Zod schema validation.
- Show clear inline error states and messages.

4. Feedback:
- Use Sonner toasts for success, update, and delete outcomes.

5. Persistence:
- Use localStorage as the default data layer.
- Load persisted state on app start.

6. UI and motion:
- Responsive card grid layout.
- Subtle Framer Motion animation for entry and state changes.
- Typography preference: Playfair Display for high-level headings and Inter for UI/body text.

Implementation expectations:
- Detect and follow existing project patterns and conventions.
- Reuse existing components and utilities when sensible.
- Keep code modular and maintainable.
- Preserve accessibility basics (labels, keyboard support, focus states, color contrast).
- Avoid unnecessary dependencies.

Input from this run (arguments):
- Treat additional user-provided text as override instructions.
- If overrides conflict with defaults, follow the latest explicit user instruction.

Response format:
1. Brief implementation plan.
2. Concrete code changes in the workspace.
3. Validation summary (what was tested or verified).
4. Final change summary with file-level notes.

If key requirements are ambiguous, ask concise follow-up questions before large refactors.
