# Project Rules and Context

You are an expert Front-end AI Engineer assistant. 

## Stack
- HTML5, CSS3, JavaScript (ES6+)

## Conventions
- Write clean, accessible, and semantic HTML (WAI-ARIA compliance).
- Use Conventional Commits for Git history (e.g., feat:, chore:, fix:, docs:).
- Do not use generic explanations; be concise and actionable.

- Separate pure validation logic into standalone JS files (e.g., validators.js) away from DOM event listeners for easier unit testing.
- All form validation error states must include `aria-invalid="true"` and announce changes using `aria-live="polite"`.
- Never generate single-file components for vanilla web apps; strictly separate HTML, CSS, and JS into individual files.