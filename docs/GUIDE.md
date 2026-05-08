# CareerOS Strategic Guide

Welcome to the **CareerOS** Command Center documentation. This guide provides a high-fidelity overview of the platform's architecture, design philosophy, and operational protocols.

---

## 🛰 Tactical Architecture

CareerOS is built on a modular foundation, designed for extreme speed and data integrity. It utilizes a **Pure Flexbox/Grid** layout to ensure 10/10 responsiveness across all professional devices.

### 1. Infiltration Hub (Jobs Module)
The primary intelligence node for tracking job acquisitions.
- **Pipeline Synchronization**: Real-time status updates via Firebase Firestore.
- **Conversion Analytics**: Visual funnel representation of your application efficiency.
- **Strategic Export**: One-click tactical CSV generation for offline intel review.

### 2. Identity Partition (Profile Module)
Management of your professional "Proof of Work".
- **Stack Mastery**: Categorized technical domain management with real-time proficiency sliders.
- **Project Dossier**: High-fidelity project cards with integrated GitHub and Live URL synchronization.

### 3. Secure Vault (Asset Module)
Encrypted document management sector.
- **Categorical Isolation**: Automatic classification of Resumes, Cover Letters, and Credentials.
- **Visual Inspection**: Built-in high-fidelity previewer for rapid document verification.

### 4. Communication Hub (CRM Module)
Strategic outreach management.
- **Transmission Log**: Comprehensive history of recruiter interactions.
- **Cadence Logic**: Intelligent follow-up tracking with urgency-based visual indicators (Critical/Urgent/Stable).

---

## 🎨 Design Philosophy: "Void-Indigo"

The **Void-Indigo** design system is engineered for long-session focus and high-fidelity aesthetics.
- **Base Background**: `#050505` (Deep Void)
- **Primary Accent**: `#6366f1` (Indigo Glow)
- **Success Accent**: `#10b981` (Emerald Pulse)
- **Glassmorphism**: 20px blur with `0.02` opacity white borders for depth simulation.

### Design Tokens
We use standardized CSS variables for all tactical elements:
- `--color-background`: Main shell color.
- `--color-indigo-500`: Primary action color.
- `--primary-glow`: Shadow token for high-intensity glow effects.

---

## 🚦 Deployment & Initialization

### Environment Variables
Ensure your tactical credentials are set in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=***
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=careeros.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=careeros
...
```

### Installation
```bash
# Standard dependency hydration
npm install

# Initialize tactical shell
npm run dev
```

---

## 🛠 Strategic Components

Every component in CareerOS follows the **Atomic Design** principle:
- **UI Atoms**: Located in `@/components/ui/`. These are the smallest tactical units (Badges, ProgressRings).
- **Layout Nodes**: Located in `@/components/layout/`. Global shell elements (Sidebar, Navbar).
- **Feature Modules**: Located in `@/components/features/`. Complex business logic partitions.

---

*End of Strategic Guide — CareerOS v1.0.0-STABLE*
