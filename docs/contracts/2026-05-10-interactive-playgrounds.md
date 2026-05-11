# Technical Contract: Interactive Code Playgrounds

**Contract ID:** `2026-05-10-interactive-playgrounds`
**Topic:** Version 0.1.7 - Interactive Code Playgrounds
**Status:** Proposed

## 1. Objective

Enable interactive, editable, and runnable code snippets within blog posts. This will allow visitors to experiment with the code examples provided in the articles directly in the browser.

## 2. Technical Stack

- **Library:** `@codesandbox/sandpack-react`.
- **Integration:** Custom component in `ReactMarkdown` to handle specific language types (e.g., `react-playground`, `js-playground`).
- **Styling:** Vanilla CSS/Tailwind to match the portfolio's glassmorphism aesthetic.

## 3. Frontend Changes

- **Dependency:** Add `@codesandbox/sandpack-react`.
- **Component:** Create `src/components/chat/Playground.tsx` (or a more suitable location, perhaps `src/components/blog/Playground.tsx`) to wrap Sandpack with the project's theme.
- **Blog Integration:** Update `src/pages/Blog.tsx` to detect custom code fences (e.g., `react-playground`) and render the `Playground` component instead of `SyntaxHighlighter`.
- **Theme Sync:** Ensure the playground matches the current system/manual theme (Dark/Light).

## 4. Markdown Syntax

To trigger a playground, the code block should use a specific language identifier:

````markdown
```react-playground
import React from 'react';

export default function App() {
  return <h1>Hello from the playground!</h1>;
}
```
````

## 5. Verification Plan

- **Manual Test:**
  1. Access the Admin panel.
  2. Create/Edit a blog post to include a `react-playground` block.
  3. View the blog post and verify the interactive playground loads, allows editing, and updates the preview.
- **Automated Test:**
  1. Add a test case to `Blog.test.tsx` (to be created) to verify that `react-playground` blocks are rendered using the `Playground` component.

## 6. Constraints

- Must not significantly impact initial page load (use dynamic imports if possible).
- Must adhere to the existing glassmorphism and color palette.
- Zero static text (use `lib/locales/` for any UI strings inside the playground).
