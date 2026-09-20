# Work Distribution & Collaboration Plan
**Course:** CSE 3206 – Software Engineering Sessional  
**Lab 2 Milestone:** Software Process Models, Requirement Analysis & MVP Development  
**Project Title:** Library Management System  
**Team Size:** 3 Members  

---

## 1. Project Overview & Module Architecture

To ensure clean separation of concerns, eliminate merge conflicts, and satisfy RUET Lab 2's GitHub collaboration requirements, the system is decomposed into **three core modules**, with each module owned by one team member.

```text
                               ┌────────────────────────────────┐
                               │   Library Management System    │
                               └───────────────┬────────────────┘
                                               │
            ┌──────────────────────────────────┼──────────────────────────────────┐
            │                                  │                                  │
            ▼                                  ▼                                  ▼
┌────────────────────────┐         ┌────────────────────────┐         ┌────────────────────────┐
│        Module 1        │         │        Module 2        │         │        Module 3        │
│  Auth, Users & Nav     │         │ Book Catalog & Search  │         │ Borrow & Return Engine │
│  (Member 1)            │         │ (Member 2)             │         │ (Member 3)             │
└────────────────────────┘         └────────────────────────┘         └────────────────────────┘
```

---

## 2. Detailed Member Work Distribution

### Member 1: Authentication, Member Management & Core Layout
* **Feature Branch:** `feature/auth-and-members`
* **Module Scope:** Security, identity, member records, and global navigation.

#### Specific Deliverables & Tasks:
1. **User Authentication:**
   * User registration (Sign Up) and login (Sign In) screens.
   * Role management: Distinction between `ADMIN` (Librarian) and `MEMBER` (Student).
   * Secure credential storage using `bcryptjs`.
   * Session / cookie management and protected route middleware.
2. **Member / Student Management:**
   * Member directory page (table displaying Name, Email, Student ID, Phone, and Role).
   * Member profile summary (showing personal details and active borrowed books count).
3. **Global Navigation & Dashboard Shell:**
   * Responsive navigation bar / sidebar (with active user indicator, role badge, and logout trigger).
   * Dashboard landing overview with system metric widgets (Total Users, Active Borrowers).

#### Files to be created/modified:
* `src/app/(auth)/login/page.tsx`
* `src/app/(auth)/register/page.tsx`
* `src/app/dashboard/members/page.tsx`
* `src/components/layout/Navbar.tsx` & `Sidebar.tsx`
* `src/lib/auth.ts` / server action handlers for authentication

*For step-by-step roadmap, tasks, and exact commits, see [Member 1 Detailed Execution Guide](./MEMBER_1_WORK.md).*

---

### Member 2: Book Catalog, Inventory & Search System
* **Feature Branch:** `feature/book-catalog`
* **Module Scope:** Cataloging, inventory tracking, book CRUD, and filtering.

#### Specific Deliverables & Tasks:
1. **Book Catalog Presentation:**
   * Books inventory table and card grid view.
   * Visual indicators for availability (`Available` vs `Out of Stock`, copies badge).
2. **Search & Filter Engine:**
   * Real-time search bar (by Title, Author, or ISBN).
   * Category / Genre filter dropdown (e.g., Computer Science, Mathematics, Literature).
3. **Book CRUD Operations:**
   * **Create:** Modal / form to add a new book (Title, Author, ISBN, Category, Total Copies).
   * **Read:** Detailed view modal showing full description and current stock status.
   * **Update:** Edit book details and update inventory counts.
   * **Delete:** Soft or cascade delete for obsolete titles (with confirmation modal).

#### Files to be created/modified:
* `src/app/dashboard/books/page.tsx`
* `src/app/dashboard/books/new/page.tsx` (or modal component)
* `src/components/books/BookTable.tsx`
* `src/components/books/BookFilterBar.tsx`
* `src/components/books/BookFormModal.tsx`
* `src/actions/bookActions.ts` (Server actions for Book CRUD)

*For step-by-step roadmap, tasks, and exact commits, see [Member 2 Detailed Execution Guide](./MEMBER_2_WORK.md).*

---

### Member 3: Borrowing, Return Transactions & Overdue Management
* **Feature Guide:** `feature/borrow-return-system`
* **Module Scope:** Core circulation engine, loan transactions, and loan tracking.

#### Specific Deliverables & Tasks:
1. **Issue / Borrow Book Flow:**
   * Book checkout modal/action: select book + select member.
   * Validation rules (e.g., cannot borrow if `availableCopies == 0`).
   * Automatic due date computation (e.g., 14 days from checkout).
   * Atomic decrement of book's `availableCopies`.
2. **Return Book Flow:**
   * Mark book as returned with timestamp recording.
   * Atomic increment of book's `availableCopies`.
   * Status transition: `BORROWED` -> `RETURNED`.
3. **Transaction History & Tracking View:**
   * Circulation log table: Member Name, Book Title, Issue Date, Due Date, Status (`BORROWED`, `RETURNED`, `OVERDUE`).
   * Filter between active loans and historical returned transactions.
   * Visual alert/highlight for overdue loans.

#### Files to be created/modified:
* `src/app/dashboard/loans/page.tsx` (or `borrow-records/page.tsx`)
* `src/components/loans/IssueBookModal.tsx`
* `src/components/loans/LoanTable.tsx`
* `src/components/loans/ReturnButton.tsx`
* `src/actions/loanActions.ts` (Server actions for Borrow and Return)

*For step-by-step roadmap, tasks, and exact commits, see [Member 3 Detailed Execution Guide](./MEMBER_3_WORK.md).*

---

## 3. Git & GitHub Collaboration Workflow

To score full marks on the **GitHub Collaboration Rubric (2 Marks)**, all members must adhere to this workflow:

```text
                     [ main ] (Stable Production Code)
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
[feature/auth-and-members]  [feature/book-catalog]  [feature/borrow-return-system]
       │                │                │
(Member 1 Commits)  (Member 2 Commits)  (Member 3 Commits)
       │                │                │
       ▼                ▼                ▼
   PR #1 (Review)   PR #2 (Review)   PR #3 (Review)
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼ (Merged after Peer Review)
                     [ main ]
```

### Step-by-Step GitHub Execution:
1. **Repository Setup:**
   * Initial codebase pushed to `main` branch.
   * Every member clones the repository and creates their `.env` file with the shared Neon `DATABASE_URL`.
2. **Branch Creation:**
   * Member 1: `git checkout -b feature/auth-and-members`
   * Member 2: `git checkout -b feature/book-catalog`
   * Member 3: `git checkout -b feature/borrow-return-system`
3. **Commit Best Practices:**
   * Write clear, imperative messages:
     * `feat(auth): implement user login with bcrypt verification`
     * `feat(books): add book creation modal and validation`
     * `feat(loans): add borrow transaction logic with stock decrement`
4. **Pull Requests (PRs):**
   * Do NOT push directly to `main`.
   * Push your feature branch: `git push origin feature/<branch-name>`.
   * Open a Pull Request with a clear description and screenshot of the feature.
5. **Code Review & Merge:**
   * Assign at least one other team member as a reviewer.
   * Reviewer leaves constructive feedback and approves the PR.
   * Merge using **"Squash and merge"** or standard **"Merge pull request"**.

---

## 4. Shared Database Contract (Prisma Models)

All three modules rely on the existing schema in `prisma/schema.prisma`:

| Model | Primary Owner | Secondary Consumers | Purpose |
| :--- | :--- | :--- | :--- |
| **`User`** | Member 1 | Member 3 (loan assignee) | Stores credentials, role (`ADMIN`/`MEMBER`), student info |
| **`Book`** | Member 2 | Member 3 (loan item) | Stores metadata, ISBN, and available copies |
| **`BorrowRecord`** | Member 3 | Member 1 (user profile history) | Connects `User` and `Book` with transaction timestamps |

---

## 5. Team Milestones & Timeline

| Phase | Milestone | Target Date | Responsible |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Project setup, Neon DB, shared schema | Day 1 | All Members |
| **Phase 2** | Feature branches created, core UI and Server Actions | Days 2–3 | Individual Assigned Member |
| **Phase 3** | Open Pull Requests, conduct peer code reviews | Day 4 | All Members |
| **Phase 4** | Merge all branches into `main` and test end-to-end | Day 5 | All Members |
| **Phase 5** | Write Design Report (`Requirement_Report.pdf`) & Viva Prep | Day 6 | All Members |
