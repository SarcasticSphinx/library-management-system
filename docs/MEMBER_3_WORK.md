# Member 3 Execution Guide: Borrowing, Return Engine & Circulation Tracking

**Course:** CSE 3206 – Software Engineering Sessional  
**Project:** RUET Library Management System  
**Assigned Member:** Member 3 (Circulation & Transaction Specialist)  
**Assigned Branch:** `feature/borrow-return-system`  

---

## 1. Branch Strategy and Setup

Before writing any code, create and switch to your designated feature branch from the latest `main` branch.

### Commands to Run:
```bash
# Ensure local main is synchronized with remote
git checkout main
git pull origin main

# Create and switch to your feature branch
git checkout -b feature/borrow-return-system
```

---

## 2. Phase-by-Phase Roadmap with Exact Commits

### Phase 1: Circulation Data Layer & Atomic Server Actions

#### Objective:
Construct transactional backend server actions managing book checkouts and returns using Prisma transactions (`prisma.$transaction`) to maintain strict database consistency.

#### Deliverables:
1. `issueBookAction(userId: string, bookId: string, loanDays: number = 14, notes?: string)`:
   * Verify member exists and account is `ACTIVE`.
   * Check book stock (`availableCopies > 0`).
   * Atomically create a `BorrowRecord` with calculated `dueDate` and decrement the book's `availableCopies` by 1.
2. `returnBookAction(recordId: string)`:
   * Fetch active record and ensure it has not already been returned.
   * Atomically mark record status as `RETURNED`, set `returnDate = new Date()`, calculate overdue fines if applicable, and increment the book's `availableCopies` by 1.
3. `getCirculationRecordsAction(statusFilter?: BorrowStatus)`:
   * Fetch loans including joined `user` (name, studentId) and `book` (title, isbn, category) relations.
4. `getUserBorrowHistoryAction(userId: string)`:
   * Fetch all active and past loans for a specific member.

#### Files Created/Modified:
* `src/actions/loanActions.ts`
* `src/types/loan.ts`

#### Verification:
* Issuing a book decrements `availableCopies` accurately.
* Returning a book restores `availableCopies`.
* Attempting to checkout a book with zero copies remaining throws an error.

#### Commit:
```bash
git add src/actions/loanActions.ts src/types/loan.ts
git commit -m "feat(loans): implement atomic borrow and return server actions with stock synchronization"
```

---

### Phase 2: Circulation Dashboard & Loans Management Table

#### Objective:
Build the central loans management interface for librarians to view active book borrowings, filter by status, and monitor return deadlines.

#### Deliverables:
1. **Circulation Management Page (`src/app/dashboard/loans/page.tsx`):**
   * Data table displaying Book Title, Borrower Name, Student ID, Borrow Date, Due Date, Status Badge, and Actions.
2. **Loan Status Badges (`src/components/loans/LoanStatusBadge.tsx`):**
   * Blue/Yellow badge for `BORROWED` (Active).
   * Green badge for `RETURNED` (Completed).
   * Red badge for `OVERDUE` (Past due date and unreturned).
3. **Filter and Search Bar (`src/components/loans/LoanFilterBar.tsx`):**
   * Quick filter tabs: All Loans, Active Loans, Overdue Only, Returned History.
   * Search input filtering by student name, student ID, or book title.

#### Files Created/Modified:
* `src/app/dashboard/loans/page.tsx`
* `src/components/loans/LoanTable.tsx`
* `src/components/loans/LoanStatusBadge.tsx`
* `src/components/loans/LoanFilterBar.tsx`

#### Verification:
* Loans accurately display the student and book names from database relations.
* Overdue records are visually distinguished.

#### Commit:
```bash
git add src/app/dashboard/loans/page.tsx src/components/loans/
git commit -m "feat(loans-ui): build circulation management page, filter tabs, and loan status badges"
```

---

### Phase 3: Book Checkout / Issue Modal & Student Selector

#### Objective:
Provide a streamlined workflow for librarians to issue books by selecting a student and an available book from searchable dropdowns.

#### Deliverables:
1. **Issue Book Modal (`src/components/loans/IssueBookModal.tsx`):**
   * Student selector (searchable by Name or Student ID).
   * Book selector (displays available titles and remaining copies count).
   * Loan duration selector (default 14 days, with 7 or 30 days options).
   * Optional notes input field.
2. Form submission handling with error alerts (e.g., student suspended or book unavailable).
3. Automatic table revalidation after successful checkout.

#### Files Created/Modified:
* `src/components/loans/IssueBookModal.tsx`
* `src/components/loans/IssueBookButton.tsx`

#### Verification:
* Modal prevents selection of books that are out of stock.
* Successful submission adds the borrow record immediately to the table.

#### Commit:
```bash
git add src/components/loans/IssueBookModal.tsx src/components/loans/IssueBookButton.tsx
git commit -m "feat(loans-issue): implement book checkout modal with searchable member and title selector"
```

---

### Phase 4: Return Book Processing & Overdue Fine Calculation

#### Objective:
Enable instantaneous one-click book return processing and automatic late fee calculation for overdue returns.

#### Deliverables:
1. **Return Book Button & Confirmation Modal (`src/components/loans/ReturnBookDialog.tsx`):**
   * Action button in each active loan row.
   * Confirmation prompt showing borrower name, book title, and return date.
2. **Overdue & Late Fee Computation:**
   * If return date is past due date, calculate overdue days and charge standard rate (e.g., 5 BDT / day).
   * Store calculated fee in `BorrowRecord.fineAmount`.
3. Success toast notification and automatic status update to `RETURNED`.

#### Files Created/Modified:
* `src/components/loans/ReturnBookDialog.tsx`
* `src/components/loans/ReturnActionButton.tsx`

#### Verification:
* Clicking return immediately updates the record status to `RETURNED`.
* Book's available stock increments by 1 on the catalog page.

#### Commit:
```bash
git add src/components/loans/ReturnBookDialog.tsx src/components/loans/ReturnActionButton.tsx
git commit -m "feat(loans-return): implement one-click book return flow with overdue fine computation"
```

---

### Phase 5: Student Borrow History & Circulation Analytics

#### Objective:
Build the dedicated student-facing borrowing history view and summary metric cards on the circulation dashboard.

#### Deliverables:
1. **Student Personal Loan View (`src/app/dashboard/my-loans/page.tsx`):**
   * Displays the current logged-in student's active books, due date countdowns, and past reading history.
2. **Circulation Summary Metrics Banner (`src/components/loans/LoanStats.tsx`):**
   * Total Active Borrows count.
   * Total Overdue Loans count.
   * Books Returned This Month count.
   * Total Accrued Overdue Fines.

#### Files Created/Modified:
* `src/app/dashboard/my-loans/page.tsx`
* `src/components/loans/LoanStats.tsx`
* `src/components/loans/UserLoanHistoryTable.tsx`

#### Verification:
* Students only see their own borrow records when viewing `my-loans`.
* Metric counters calculate accurately from the database.

#### Commit:
```bash
git add src/app/dashboard/my-loans/page.tsx src/components/loans/LoanStats.tsx src/components/loans/UserLoanHistoryTable.tsx
git commit -m "feat(loans-history): build student personal borrowing view and circulation metrics banner"
```

---

### Phase 6: Code Polish, Type Safety & Pull Request Submission

#### Objective:
Run complete verification across circulation workflows, guarantee zero TypeScript/ESLint warnings, push branch to GitHub, and submit a Pull Request.

#### Verification Steps:
1. Verify build passes without type errors:
   ```bash
   npm run build
   ```
2. Verify linting rules:
   ```bash
   npm run lint
   ```
3. Push branch to GitHub:
   ```bash
   git push -u origin feature/borrow-return-system
   ```

#### Commit:
```bash
git add -A
git commit -m "chore(borrow-return): finalize types, verify atomic transactions, and prepare for PR review"
```

#### Pull Request Specifications:
* **Base Branch:** `main`
* **Compare Branch:** `feature/borrow-return-system`
* **PR Title:** `feat(borrow-return-system): book circulation engine, checkout/return flow, and overdue tracking`
* **Assigned Reviewers:** Member 1 and Member 2
* **PR Description Template:**
  ```markdown
  ## Module 3 Overview
  Implemented the library circulation subsystem including atomic book checkout, return processing, status lifecycle (`BORROWED` -> `RETURNED`), and member borrow history.

  ## Features Implemented
  - Transactional book checkout with stock validation and decrement
  - Return processing with stock restoration and overdue fine calculation
  - Circulation table with status filter tabs (Active, Overdue, Returned)
  - Issue Book modal with student and title selection
  - Student personal borrow history page (`/dashboard/my-loans`)
  - Real-time circulation metric cards

  ## Testing Steps
  1. Navigate to `/dashboard/loans`.
  2. Click "Issue Book", choose a student and available book, and submit.
  3. Verify the book's available count decreases on `/dashboard/books`.
  4. In the loans table, click "Return" on the newly issued loan.
  5. Confirm the status changes to `RETURNED` and stock count restores.
  ```

---

## 3. Summary of Git Commits for Member 3

Member 3 will have at least 6 structured commits demonstrating incremental software development:

1. `feat(loans): implement atomic borrow and return server actions with stock synchronization`
2. `feat(loans-ui): build circulation management page, filter tabs, and loan status badges`
3. `feat(loans-issue): implement book checkout modal with searchable member and title selector`
4. `feat(loans-return): implement one-click book return flow with overdue fine computation`
5. `feat(loans-history): build student personal borrowing view and circulation metrics banner`
6. `chore(borrow-return): finalize types, verify atomic transactions, and prepare for PR review`
