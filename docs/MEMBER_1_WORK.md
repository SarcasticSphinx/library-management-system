# Member 1 Execution Guide: Authentication, Member Directory & Dashboard Shell

**Course:** CSE 3206 – Software Engineering Sessional  
**Project:** RUET Library Management System  
**Assigned Member:** Member 1 (Lead / Auth & Core Platform)  
**Assigned Branch:** `feature/auth-and-members`  

---

## 1. Branch Strategy and Setup

Before writing any code, create and switch to your designated feature branch from the latest `main` branch.

### Commands to Run:
```bash
# Ensure local main is synchronized with remote
git checkout main
git pull origin main

# Create and switch to your feature branch
git checkout -b feature/auth-and-members
```

---

## 2. Phase-by-Phase Roadmap with Exact Commits

### Phase 1: Authentication Engine & Session Management

#### Objective:
Build the authentication backend logic, credential verification, and session state management without relying on heavy external third-party OAuth providers.

#### Deliverables:
1. Password hashing and verification using `bcryptjs`.
2. Session cookie creation and validation utilities (`src/lib/auth.ts`).
3. Server action for user registration (`registerAction`).
4. Server action for user login (`loginAction`) verifying email, password, and active status.
5. Server action for logout (`logoutAction`) clearing session cookies.

#### Files Created/Modified:
* `src/lib/auth.ts`
* `src/actions/authActions.ts`

#### Verification:
* Passwords must never be stored in plain text.
* Login action returns appropriate error messages for invalid credentials or suspended accounts.

#### Commit:
```bash
git add src/lib/auth.ts src/actions/authActions.ts
git commit -m "feat(auth): implement password hashing, session cookies, and login-register server actions"
```

---

### Phase 2: Authentication User Interface (Login & Register Pages)

#### Objective:
Create modern, clean, and responsive user interfaces for member sign-in and account registration with client-side form validation.

#### Deliverables:
1. **Login Page (`src/app/(auth)/login/page.tsx`):**
   * Form fields: Email, Password, and Role switcher or indicator.
   * Clear error display for invalid submissions.
   * Link to registration page.
2. **Registration Page (`src/app/(auth)/register/page.tsx`):**
   * Form fields: Full Name, University Email, Student ID, Department (dropdown), Phone, and Password.
   * Default registration assigns the `MEMBER` role.
3. Auth layout wrapper ensuring clean, distraction-free centered design.

#### Files Created/Modified:
* `src/app/(auth)/layout.tsx`
* `src/app/(auth)/login/page.tsx`
* `src/app/(auth)/register/page.tsx`
* `src/components/auth/LoginForm.tsx`
* `src/components/auth/RegisterForm.tsx`

#### Verification:
* Submitting valid credentials redirects user to `/dashboard`.
* Submitting invalid credentials displays an inline alert banner.

#### Commit:
```bash
git add src/app/\(auth\)/ src/components/auth/
git commit -m "feat(auth-ui): create login and registration forms with responsive styling"
```

---

### Phase 3: Global Shell, Navigation & Role-Based Layout

#### Objective:
Construct the dashboard container, sidebar navigation, top header, and role-based route guard to protect administrative routes from unauthorized student access.

#### Deliverables:
1. **Top Header (`src/components/layout/Navbar.tsx`):**
   * Displays application title, logged-in user name, role badge (`ADMIN` or `MEMBER`), and logout button.
2. **Sidebar Navigation (`src/components/layout/Sidebar.tsx`):**
   * Common links: Dashboard Overview, Book Catalog.
   * Member links: My Borrowed Books, Profile.
   * Admin-only links: Member Directory, Circulation / Issue Book, Inventory Management.
3. **Protected Layout (`src/app/dashboard/layout.tsx`):**
   * Verifies user session before rendering protected child views.
   * Unauthenticated requests are redirected to `/login`.

#### Files Created/Modified:
* `src/app/dashboard/layout.tsx`
* `src/components/layout/Navbar.tsx`
* `src/components/layout/Sidebar.tsx`
* `src/middleware.ts` (or layout-level session check)

#### Verification:
* Logged-in admin sees full administrative sidebar options.
* Logged-in member sees restricted options.
* Direct URL access without cookie redirects to login.

#### Commit:
```bash
git add src/app/dashboard/layout.tsx src/components/layout/ src/middleware.ts
git commit -m "feat(layout): build responsive dashboard shell, sidebar navigation, and auth guard"
```

---

### Phase 4: Member Directory & Management (Admin View)

#### Objective:
Enable library administrators to inspect registered students/members, search by Student ID or department, and view individual member borrowing counts.

#### Deliverables:
1. **Members Listing Page (`src/app/dashboard/members/page.tsx`):**
   * Data table showing Name, Student ID, Email, Department, Phone, Status (`ACTIVE`/`SUSPENDED`), and Date Joined.
   * Search input filtering members by name or student ID.
   * Department filter dropdown (e.g., CSE, EEE, ME, CE).
2. **Member Server Actions (`src/actions/memberActions.ts`):**
   * Query functions fetching users with active borrow counts.
   * Action to toggle member status (`ACTIVE` vs `SUSPENDED`).

#### Files Created/Modified:
* `src/app/dashboard/members/page.tsx`
* `src/components/members/MemberTable.tsx`
* `src/components/members/MemberFilterBar.tsx`
* `src/actions/memberActions.ts`

#### Verification:
* Admin can quickly find a student by typing their ID.
* Active loans count correctly aggregates from `BorrowRecord`.

#### Commit:
```bash
git add src/app/dashboard/members/ src/components/members/ src/actions/memberActions.ts
git commit -m "feat(members): implement member directory table, department filter, and status toggle"
```

---

### Phase 5: Dashboard Overview & System Metrics

#### Objective:
Construct the main dashboard overview page providing high-level operational statistics and quick action shortcuts.

#### Deliverables:
1. **Metric Cards:**
   * Total Registered Students/Members.
   * Active Borrowers count.
   * System health and database status indicators.
2. **Recent Members Widget:**
   * Snapshot table of the 5 most recently registered students.
3. **Quick Navigation Actions:**
   * Direct shortcuts to Issue Book, Add Book, or Search Catalog.

#### Files Created/Modified:
* `src/app/dashboard/page.tsx`
* `src/components/dashboard/StatCard.tsx`
* `src/components/dashboard/RecentMembersCard.tsx`

#### Verification:
* Metrics calculate dynamically using Prisma database queries.
* Layout renders cleanly on both desktop and mobile screens.

#### Commit:
```bash
git add src/app/dashboard/page.tsx src/components/dashboard/
git commit -m "feat(dashboard): build overview statistics cards and recent user activity widget"
```

---

### Phase 6: Code Polish, Type Safety & Pull Request Submission

#### Objective:
Perform end-to-end verification, ensure zero TypeScript/ESLint errors, push the feature branch to GitHub, and open a Pull Request for team review.

#### Verification Steps:
1. Run local build to verify no compiler errors:
   ```bash
   npm run build
   ```
2. Verify formatting and linting:
   ```bash
   npm run lint
   ```
3. Push branch to GitHub:
   ```bash
   git push -u origin feature/auth-and-members
   ```

#### Commit:
```bash
git add -A
git commit -m "chore(auth-and-members): finalize types, resolve lint warnings, and prepare for PR review"
```

#### Pull Request Specifications:
* **Base Branch:** `main`
* **Compare Branch:** `feature/auth-and-members`
* **PR Title:** `feat(auth-and-members): user authentication, member directory, and dashboard shell`
* **Assigned Reviewers:** Member 2 and Member 3
* **PR Description Template:**
  ```markdown
  ## Module 1 Overview
  Implemented full authentication pipeline, session handling, dashboard navigation layout, and member management directory.

  ## Features Implemented
  - Credentials login and signup with bcrypt verification
  - Role-based navigation (`ADMIN` vs `MEMBER`)
  - Member management table with search and department filtering
  - Central dashboard overview with live metric cards

  ## Testing Steps
  1. Register a new user at `/register`.
  2. Log in with admin credentials (`librarian@ruet.ac.bd` / `password123`).
  3. Verify access to `/dashboard/members`.
  4. Test logout functionality.
  ```

---

## 3. Summary of Git Commits for Member 1

Member 1 will have at least 6 structured commits demonstrating incremental software development:

1. `feat(auth): implement password hashing, session cookies, and login-register server actions`
2. `feat(auth-ui): create login and registration forms with responsive styling`
3. `feat(layout): build responsive dashboard shell, sidebar navigation, and auth guard`
4. `feat(members): implement member directory table, department filter, and status toggle`
5. `feat(dashboard): build overview statistics cards and recent user activity widget`
6. `chore(auth-and-members): finalize types, resolve lint warnings, and prepare for PR review`
