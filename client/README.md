# MEMIGHTY CRUD Rehearsal — Frontend

Course registration CRUD app built with React, TypeScript, and shadcn/ui.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Vega preset)
- React Hook Form + Zod for form state and validation
- TanStack Query for server state and caching
- Axios for API requests

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend's URL (default `http://localhost:5000/api`)
3. Make sure the backend server is running first
4. `npm run dev` (starts on http://localhost:5173)

## Features
- **Multistep registration form** across 3 steps — Personal Info, Course Details, Preferences & Review — with per-step validation before advancing
- **10 field types**: text, email, phone, image upload, dropdown, radio group, date picker, textarea, and two checkboxes
- **Full CRUD**: create, list (table view), update (pre-filled edit dialog), and delete (with confirmation) — all wired to the backend via TanStack Query
- **Client-side validation** mirrors backend constraints (file size/type, required fields) via a shared Zod schema
- **Optimistic UX touches**: loading skeletons, toast notifications, disabled states during submission, image preview on edit

## Project Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives
│   └── registration/    # Step1-3, MultiStepForm, RegistrationsTable
├── hooks/                # TanStack Query hooks (create/read/update/delete)
├── lib/                  # schema.ts (Zod), api.ts, utils.ts, formDataUtils.ts
└── App.tsx
```