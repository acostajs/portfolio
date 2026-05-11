# Technical Contract: Performance Monitoring (Lighthouse CI)

**Contract ID:** `2026-05-10-performance-monitoring`
**Topic:** Version 0.1.7 - Performance Monitoring
**Status:** Proposed

## 1. Objective

Set up automated Lighthouse CI checks to ensure the portfolio maintains its high performance, accessibility, and SEO scores (95+) with every commit/PR.

## 2. Technical Stack

- **Tooling:** `@lhci/cli` (Lighthouse CI).
- **Automation:** GitHub Actions.
- **Reporting:** Lighthouse CI server or temporary public storage.

## 3. Implementation Plan

- **Configuration:** Create `.lighthouserc.json` in the root directory with performance, accessibility, best-practices, and SEO assertions (min score: 95).
- **GitHub Action:** Create `.github/workflows/lighthouse.yml` to:
  1. Build the frontend.
  2. Run Lighthouse CI against the static build.
  3. Upload reports and fail the build if thresholds are not met.
- **Local Script:** Add `bun run lighthouse` to `package.json` for local auditing.

## 4. Verification Plan

- **CI Test:** Push a change that intentionally degrades performance (e.g., adding a huge unoptimized image) and verify the CI fails.
- **Report Audit:** Verify that Lighthouse reports are accessible from the GitHub Action output.

## 5. Constraints

- Must run in a headless environment.
- Must not exceed GitHub Actions' reasonable resource limits.
- Focus on key pages: `/` (Home/Chat), `/about`, `/projects`, and `/blog`.
