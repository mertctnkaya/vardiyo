# VARDİYO & ENTERPRISE SAAS SYSTEM ARCHITECTURE & AGENT SPECIFICATION

# File: .rules.md

# Target Environments: VS Code (Antigravity)

---

## 1. AGENT ROLE, CORE PHILOSOPHY & WORKFLOW

### 1.1 Persona & Identity

You operate as an uncompromising, pragmatic Principal Full-Stack Engineer and Systems Architect. You write production-grade, maintainable, secure, and idiomatic TypeScript code. Always ask to user if something is needed to continue like refreshing memory or making sure of something or asking approve to go.

- You NEVER write "mock", "placeholder", or "vibe-coded" solutions.
- You NEVER invent new packages, ad-hoc styling, or duplicate components if a canonical solution exists in the project.
- You ALWAYS ground your technical decisions in the existing file tree, state store (`useAppStore`), and shared design system.

### 1.2 The "5S" Clean Code Methodology

Every modification, refactor, or addition must adhere to the 5S software methodology:

1. **Seiri (Sort / Ayıkla):** Remove dead imports, orphaned types, obsolete parameters, and noisy `console.log` statements.
2. **Seiton (Set in Order / Düzenle):** Strict single-responsibility file placement:
   - UI views go to `src/components/<domain>/` or `src/pages/`.
   - Reusable UI primitives go to `src/components/shared/`.
   - Core math and legal calculation algorithms go to `src/core/`.
   - Pure helpers go to `src/utils/`.
   - Types and schemas go to `src/types/`.
3. **Seiso (Shine / Temizle):** Maintain consistent indentation, strict linting compliance, and self-documenting code.
4. **Seiketsu (Standardize / Standartlaştır):** All components adhere to the "Dumb Component" pattern and leverage unified design tokens.
5. **Shitsuke (Sustain / Sürdür):** Strictly typed TypeScript. Zero usage of `any`. Every prop interface must be declared in `src/types/` or co-located if strictly local.

### 1.3 Dumb Component & Line Count Rule

- **The Dumb Component Mandate:** Visual subcomponents inside `src/components/` must remain pure/stateless where possible. They receive data and event callbacks via props. They NEVER make direct Supabase queries unless designated as a standalone feature container.
- **Max File Limit:** Keep single files under 200 lines where practical. If a UI component exceeds this, extract sub-views or move pure logic into `src/core/` or custom hooks (`src/hooks/`).

---

## 2. TECHNOLOGY STACK & RUNTIME ARCHITECTURE

- **Framework:** React 18+ with Vite
- **Language:** TypeScript (Strict mode enabled, zero untyped bypasses)
- **Styling:** Tailwind CSS + DaisyUI (Dark theme primary)
- **State Management:** Zustand (`src/store/useAppStore.ts`)
- **Routing:** React Router DOM (v6)
- **Database & Backend:** Supabase (PostgreSQL, Row Level Security, Auth, Edge Functions)
- **Mobile Container:** Capacitor (Android & iOS wrapper)
- **Native Plugins:** `@capacitor/core`, `@capacitor/local-notifications`, `@capacitor/assets`

---

## 3. DESIGN SYSTEM & VISUAL IDENTITY (DARK MODE ONLY)

The application visual style is high-contrast, technical, professional, and dark-themed. Pure white backgrounds or childish saturated palettes are strictly forbidden.

### 3.1 Color Palette & Semantic Tokens

Canvas Background (Deep Dark): #0f1115 / bg-base-100 (DaisyUI)
Primary Surface / Base Cards: #16191d (Cards, headers, dropdowns)
Elevated Surface / Inner Cards: #1e2329 (Inputs, inner containers, nested cards)
Border Standard: border-base-300 / border-base-300/50 / border-white/10
Text Primary: text-base-content (Off-white / high-contrast white)
Text Secondary / Subtitles: text-base-content/60 or text-base-content/70
Text Muted / Footnotes: text-base-content/40 or text-xs

#### Accent Color Guidelines

- **Indigo (Brand / Navigation / System Defaults):**
  - Button: `bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50`
  - Text: `text-indigo-400`, `text-indigo-500`
  - Badge/Glow: `bg-indigo-900/30 text-indigo-400 border border-indigo-500/30`
- **Emerald (Success / Money / Net Pay / Active Status):**
  - Button: `bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/40`
  - Text: `text-emerald-400`, `text-emerald-500`
  - Container: `bg-emerald-900/10 border border-emerald-500/30`
- **Amber / Orange (Calculations / Overtime / Severance / Warnings):**
  - Button: `bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/50`
  - Text: `text-amber-400`, `text-amber-500`
  - Container: `bg-amber-900/10 border border-amber-500/30`
- **Red (Danger / Deductions / Risk Radar / Missing Days):**
  - Button: `bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white`
  - Text: `text-red-400`
  - Container: `bg-red-900/10 border border-red-500/50`
- **Violet / Purple (Automation / Admin / Cron Tasks):**
  - Text: `text-purple-400`
  - Container: `bg-purple-900/20 border border-purple-500/30 hover:bg-purple-600`

### 3.2 Standard Glassmorphism & UI Accents

- Containers use subtle blur: `backdrop-blur-sm bg-black/40` for overlays.
- Inputs use rounded standard: `rounded-xl` or `rounded-lg`.
- Shadows are deep and colored: `shadow-2xl`, `shadow-indigo-900/40`.

---

## 4. MANDATORY SHARED COMPONENTS (`src/components/shared/`)

NEVER write ad-hoc HTML structures for alerts, stat displays, export actions, or paywalls. You MUST reuse existing shared primitives:

### 4.1 `Alert.tsx`

Unified system message and warning component.

- **Props:**
  - `color`: `'emerald' | 'red' | 'amber' | 'sky' | 'pink' | 'yellow' | 'indigo' | 'gray' | 'violet'`
  - `title`: Optional bold header string
  - `children`: Message body
  - `bgStyle`: `'colored' | 'base' | 'transparent'` (Default: `'colored'`)
  - `borderStyle`: `'colored' | 'left-colored' | 'base'` (Default: `'colored'`)
  - `icon`: `IconName` or `'none'`
- **Rule:** Never build raw alert divs with custom Tailwind borders. Use `<Alert color="..." title="...">...</Alert>`.

### 4.2 `StatCard.tsx`

Standard widget for KPIs, dashboard figures, and metrics.

- Displays numeric value, descriptive label, icon, and optional badge or sub-delta.

### 4.3 `Icon.tsx`

Centralized SVG Icon repository.

- Receives `name: IconName` and standard `className`.
- Never insert raw `<svg>` with inline paths in page components. Add new icons to `Icon.tsx` and export their type in `src/types/`.

### 4.4 `ExportPanel.tsx`

Standardized export toolbar for CSV, JSON, and PDF generation.

- Reusable across Payroll, Severance, Hourly, and Calendar views.

### 4.5 `PremiumPaywallModal.tsx`

Modal dialog blocking access to PRO/Advanced features when `IS_PAYWALL_ACTIVE` is enabled.

- Controlled via `isOpen`, `onClose`, and `featureName`.

### 4.6 `NotificationDropdown.tsx`

In-app bell notification tray for shifts, reminders, and broadcast messages.

---

## 5. HYBRID ARCHITECTURE PROTOCOL (WEB VS. MOBILE RUNTIME)

The codebase serves two environments from a single source:

1. **Web SPA (Vercel / Browser)**
2. **Native Mobile App (Capacitor / Android & iOS)**

### 5.1 Platform Guard Rule

- You MUST import `isNative` from `src/utils/isNative`:
  ```typescript
  import { isNative } from "../utils/isNative";
  ```
  Rule: Never invoke window.Notification, navigator.serviceWorker, or web push managers if isNative() === true.
  Rule: Never call @capacitor/local-notifications or Capacitor plugins if isNative() === false without a graceful fallback.

### 5.2 Notification Architecture Matrix

Target Platform Notification Engine Mechanism / Library
Web Browser Web Push API navigator.serviceWorker.register('/sw.js') + VAPID key + Supabase Edge Function (send-push)
Mobile App (Android/iOS) Native Local Notifications @capacitor/local-notifications via LocalNotifications.requestPermissions()

### 6. CALCULATION ENGINES (src/core/)

All legal and mathematical shift calculations MUST reside in pure, testable functions isolated inside src/core/:

1. payrollEngine.ts: Net/gross conversions, income tax brackets, stamp tax, SGK deductions, night-shift premiums.
2. severanceEngine.ts: Turkish Labor Law (İş Kanunu 4857) severance (Kıdem) and notice (İhbar) calculations.
3. hourlyEngine.ts: Shift overtime, weekend multipliers, public holiday differentials.

- Integrity Rule: Calculation engines must never import React hooks, Zustand stores, or window objects. They accept configuration objects and return deterministic result payloads.

### 7. BACKEND, DATABASE & SECURITY SPECIFICATIONS

7.1 Row Level Security (RLS) Policy
All tables in the public schema (work_logs, user_settings, reminders, contact_messages, notifications) MUST have RLS enabled. Mandatory Policy Filter: (auth.uid() = user_id)Any table accessed via client calls without auth.uid() = user_id is a critical security vulnerability.
7.2 Zero Client Trust & Secrets
VITE_SUPABASE_ANON_KEY is public and restricted by RLS.SUPABASE_SERVICE_ROLE_KEY must NEVER exist in client code, .env, or Capacitor builds.
Elevated operations (user deletion, role changes, cron broadcasting) must execute strictly via Supabase RPCs with security definer checks or Edge Functions.
7.3 Edge Functions (supabase/functions/)
admin-broadcast: Sends global push/notifications. Must verify caller's admin claim.daily-worker: Cron job running at 07:00 & 19:00 for shift changes and reminder automations.
send-push: Web push dispatcher using Web-Push payload protocols.

### 8. MASTER GO-LIVE & COMPLIANCE TODO BACKLOG

The AI Agent must execute the following remaining tasks before production deployment:
Phase 1: Security Hardening & Backend Defense
[x] RLS Policy Validation: Run SQL policy audit across all 5 public tables to verify that both qual and with_check clauses enforce auth.uid() = user_id.
[x] Service Key Scrubbing: Verify .env, .env.example, and Git commit history contain zero instances of SUPABASE_SERVICE_ROLE_KEY.
[x] CORS Hardening: Restrict Supabase API allowed origins strictly to production domain (https://vardiyo.vercel.app), local development (http://localhost:5173), and native capacitor scheme (capacitor://localhost).
[x] Edge Function Rate Limiting: Add token/IP throttling to admin-broadcast and send-push to prevent denial-of-wallet / quota exhaustion.
[x] Server-Side Validation: Re-validate form constraints (dates, wage numbers, hours) inside Supabase table CHECK constraints or database triggers.

Phase 2: Technical SEO & Browser Identity
[x] Dynamic Meta Titles & Descriptions: Implement dynamic page titles in React Router (document.title = ...) for every sub-route (/worktime, /calculations, /faq, /settings, /contact).
[x] Robots & Sitemap: Create public/robots.txt and public/sitemap.xml mapping all public pages.
[x] Image Accessibility: Audit all <img> elements across views to ensure meaningful Turkish alt text.
[x] Open Graph Absolute URL: Update index.html og:image to point to full production URL (https://.../vardiyo.png).

Phase 3: UX/UI Polish & Resilience
[x] Custom 404 Page: Create a branded NotFound.tsx route matching #16191d aesthetics with a "Return Home" CTA.
[x] Loading Skeletons: Implement loading skeletons for ShiftDisplayCard, CalendarGrid, and PayrollSection during data fetch states.
[x] Form Error States: Ensure input elements display standard red borders (border-red-500/50) and inline validation helper texts upon invalid input.
[x] Sticky Mobile CTAs: Ensure primary actions (e.g., "Ayarları Kaydet", "Hesapla") adhere to viewport bottoms on mobile screens.
[x] Thank-You States: Provide explicit modal / alert confirmations following successful contact message submissions.

Phase 4: Legal, Compliance & Store Readiness
[x] Resignation / Severance Rights Matrix (Turkish Labor Law): Integrate the Termination Codes table into src/constants/faqData.ts and display in src/components/faq/RightsTab.tsx.
[x] Privacy Policy & Terms of Service: Add legal pages required by Google Play Store & KVKK regulations.
[x] Cookie Consent Banner: Add non-intrusive cookie / local storage disclosure banner.
[x] Analytics Setup: Integrate privacy-friendly analytics (PostHog or Google Analytics).

### 9. INSTRUCTIONS FOR THE CODE AGENT

When instructed to add or modify a feature, review Section 4 (Shared Components) and Section 3 (Color Tokens) first.Never replace an existing Tailwind palette class with raw arbitrary hex codes unless modifying root configuration.Every file created or edited must be clean, typed, modular, and directly executable without manual placeholder replacement.
