# AI-Assisted Workflow Comparison

## Overview
This document compares two approaches to building a User Settings form using Claude: a vague prompt (Round 1) versus a precise, constraint-driven prompt (Round 2).

## Correctness & Architecture
In Round 1, the AI generated a monolithic HTML file containing inline CSS and tightly coupled JavaScript. While functional, it was hard to scale. In Round 2, the precise prompt forced a modular architecture (`index.html`, `styles.css`, `validators.js`, `app.js`). Extracting pure validation rules into `validators.js` made the logic testable outside the browser.

## Accessibility (A11y)
Round 1 completely ignored accessibility. Errors were just colored text, which is an AI mistake I caught during review. Round 2 explicitly implemented WAI-ARIA compliance. It correctly utilized `aria-describedby` for error linking, `aria-live="polite"` for dynamic error announcements, and `aria-invalid="true"`. 

## Edge Cases
The vague prompt missed several complex edge cases. For instance, in Round 1, the AI didn't handle conditional validation well. Round 2 handled this flawlessly (e.g., if 'Text alerts' is checked, 'Phone number' automatically becomes required) and instantly cleared errors upon typing valid input rather than waiting for another submit/blur event.

## Review Effort & Time
Reviewing Round 1 took more time because I had to untangle the JavaScript from the HTML to see what it was actually doing. Round 2 took slightly longer to prompt, but the review effort was drastically reduced because the AI wrote unit tests (using Node and `jsdom`) that mathematically proved the business logic worked. The time invested in the precise prompt made the end-to-end workflow much faster.