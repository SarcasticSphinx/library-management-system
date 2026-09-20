# RUET Library Management System - Team Onboarding & Developer Guide

**Course:** CSE 3206 – Software Engineering Sessional  
**Lab Milestone:** Lab 2 (Software Process Models, Requirements Analysis & MVP)  
**Repository:** `https://github.com/SarcasticSphinx/library-management-system`  

This guide is for our 3-person project team. Follow these exact steps to set up your local environment, connect to our shared cloud database, and start developing your assigned module without merge conflicts.

---

## 1. Prerequisites

Before starting, ensure your machine has:
* **Node.js:** v18.18 or higher (v20+ recommended). Check with `node -v`.
* **npm:** v9 or higher. Check with `npm -v`.
* **Git:** Installed and configured with your GitHub account.

---

## 2. Step-by-Step Initial Setup

Run the following commands in your terminal:

### Step 1: Clone the Repository
```bash
git clone https://github.com/SarcasticSphinx/library-management-system.git
cd library-management-system
```

### Step 2: Install Project Dependencies
Install all required packages (Next.js, Prisma v7, Neon adapter, Tailwind CSS, Lucide icons, etc.):
```bash
npm install
```

### Step 3: Configure Environment Variables
Create your local `.env` file from the provided template:
```bash
cp .env.example .env
```
Open `.env` in your code editor and set the shared team database URL:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```
*(Ask the team lead for the active Neon connection string if you do not have it).*

> **Note:** `.env` is already in `.gitignore`. Never commit or share your `.env` file to GitHub.

### Step 4: Generate Prisma Client
Generate the TypeScript database types:
```bash
npx prisma generate
```

### Step 5: Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The application should run without any errors.

---

## 3. Team Member Modules & Branch Assignment

Every member must work **only on their designated feature branch**. Do not commit directly to `main`.

| Team Member | Module Name | Assigned Branch | Execution Guide |
| :--- | :--- | :--- | :--- |
| **Member 1** | Auth, Member Directory & Dashboard Shell | `feature/auth-and-members` | [`docs/MEMBER_1_WORK.md`](./docs/MEMBER_1_WORK.md) |
| **Member 2** | Book Catalog, Inventory & Search | `feature/book-catalog` | [`docs/MEMBER_2_WORK.md`](./docs/MEMBER_2_WORK.md) |
| **Member 3** | Borrow, Return & Circulation Engine | `feature/borrow-return-system` | [`docs/MEMBER_3_WORK.md`](./docs/MEMBER_3_WORK.md) |

For complete project architecture, refer to [`docs/WORK_DISTRIBUTION.md`](./docs/WORK_DISTRIBUTION.md).

---

## 4. How to Work on Your Assigned Module

### Step 1: Switch to Your Feature Branch
Before writing code, make sure you are branched from the latest `main`:
```bash
git checkout main
git pull origin main

# Example for Member 1:
git checkout -b feature/auth-and-members

# Example for Member 2:
git checkout -b feature/book-catalog

# Example for Member 3:
git checkout -b feature/borrow-return-system
```

### Step 2: Follow Your Phase-by-Phase Guide
Open your designated guide in the `docs/` folder. It provides:
* Exact files you need to create/edit.
* Step-by-step feature breakdown.
* Pre-written conventional commit messages for each phase.

### Step 3: Commit Progress Regularly
Commit small, logical changes as you complete each phase:
```bash
git add <files-you-changed>
git commit -m "feat(module): description of what you completed"
```

### Step 4: Verify Before Pushing
Always verify that your code compiles cleanly without TypeScript or ESLint errors:
```bash
# Test production build
npm run build

# Run linter
npm run lint
```

### Step 5: Push Branch to GitHub
```bash
git push -u origin <your-feature-branch>
```

### Step 6: Create a Pull Request (PR)
1. Go to the repository on GitHub: `https://github.com/SarcasticSphinx/library-management-system`.
2. Click **Compare & pull request** for your branch.
3. Set base branch to `main`.
4. Add the description from your guide and assign your 2 teammates as reviewers.
5. After at least one teammate reviews and approves, merge the PR into `main`.

---

## 5. Useful Commands Cheat Sheet

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server at `localhost:3000`. |
| `npm run build` | Builds the application for production and validates TypeScript types. |
| `npm run lint` | Runs ESLint to check for syntax and style issues. |
| `npx prisma generate` | Regenerates Prisma Client types after schema modifications. |
| `npx prisma db push` | Pushes local `schema.prisma` updates directly to the Neon database. |
| `npx prisma studio` | Opens a local web GUI at `localhost:5555` to view/edit database records. |

---

## 6. Team Ground Rules

1. **Never commit directly to `main`:** All code enters `main` via approved Pull Requests to meet RUET's collaboration rubric.
2. **Never commit `.env`:** Keep your database credentials in `.env`. If you add a new environment variable, document it in `.env.example`.
3. **Pull `main` frequently:** Before continuing work on your feature branch, sync with `main` to prevent merge conflicts:
   ```bash
   git checkout main
   git pull origin main
   git checkout <your-feature-branch>
   git merge main
   ```
4. **Coordinate on Schema Changes:** If you need to add or edit a field in `prisma/schema.prisma`, inform the team first before modifying it.
