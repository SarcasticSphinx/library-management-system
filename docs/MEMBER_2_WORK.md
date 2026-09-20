# Member 2 Execution Guide: Book Catalog, Inventory & Search Engine

**Course:** CSE 3206 – Software Engineering Sessional  
**Project:** RUET Library Management System  
**Assigned Member:** Member 2 (Catalog & Inventory Specialist)  
**Assigned Branch:** `feature/book-catalog`  

---

## 1. Branch Strategy and Setup

Before writing any code, create and switch to your designated feature branch from the latest `main` branch.

### Commands to Run:
```bash
# Ensure local main is synchronized with remote
git checkout main
git pull origin main

# Create and switch to your feature branch
git checkout -b feature/book-catalog
```

---

## 2. Phase-by-Phase Roadmap with Exact Commits

### Phase 1: Book Data Layer & Server Actions (CRUD Operations)

#### Objective:
Construct the backend server actions interacting with the `Book` model via Prisma, providing typed queries and mutations for book creation, retrieval, updates, and deletion.

#### Deliverables:
1. `getBooksAction(query?: string, category?: string)`:
   * Query database for books matching title, author, or ISBN (case-insensitive).
   * Filter optionally by category.
   * Order results by creation date descending.
2. `getBookByIdAction(id: string)`:
   * Retrieve complete book metadata including current availability count.
3. `createBookAction(data: BookInput)`:
   * Validate required fields (title, author, ISBN, category, totalCopies).
   * Ensure availableCopies equals totalCopies upon creation.
   * Verify ISBN uniqueness.
4. `updateBookAction(id: string, data: Partial<BookInput>)`:
   * Update title, author, category, shelf location, or stock.
5. `deleteBookAction(id: string)`:
   * Remove book from catalog (with safety check preventing deletion if active loans exist).

#### Files Created/Modified:
* `src/actions/bookActions.ts`
* `src/types/book.ts`

#### Verification:
* Prisma queries handle search strings and category filters accurately.
* Creating a book with a duplicate ISBN gracefully returns a user-friendly error.

#### Commit:
```bash
git add src/actions/bookActions.ts src/types/book.ts
git commit -m "feat(books): implement server actions for book querying, creation, updating, and deletion"
```

---

### Phase 2: Catalog Presentation & Search/Filter Interface

#### Objective:
Build the public and administrative book catalog view allowing users to browse, search, and filter inventory with responsive table and grid options.

#### Deliverables:
1. **Catalog View Page (`src/app/dashboard/books/page.tsx`):**
   * Displays full list of books with title, author, category, shelf location, and availability badge.
   * Toggle between tabular view and visual card grid view.
2. **Search and Filter Bar (`src/components/books/BookFilterBar.tsx`):**
   * Live text input for search queries (title, author, ISBN).
   * Category dropdown selector (e.g., Computer Science, Software Engineering, Database Systems).
   * Availability filter toggle (All, Available Only, Out of Stock).
3. **Availability Badge Component (`src/components/books/AvailabilityBadge.tsx`):**
   * Green badge when `availableCopies > 0` showing count (e.g., "4 / 5 Available").
   * Red badge when `availableCopies == 0` showing "Out of Stock".

#### Files Created/Modified:
* `src/app/dashboard/books/page.tsx`
* `src/components/books/BookTable.tsx`
* `src/components/books/BookCard.tsx`
* `src/components/books/BookFilterBar.tsx`
* `src/components/books/AvailabilityBadge.tsx`

#### Verification:
* Typing a query dynamically filters the displayed books without page reload glitches.
* Stock numbers display accurately according to database values.

#### Commit:
```bash
git add src/app/dashboard/books/page.tsx src/components/books/
git commit -m "feat(catalog-ui): build book catalog table, card view, and real-time filter bar"
```

---

### Phase 3: Book Creation Modal & Input Validation

#### Objective:
Enable librarians/admins to register new books into the library database via a structured modal with form validation.

#### Deliverables:
1. **Add Book Modal / Form (`src/components/books/BookFormModal.tsx`):**
   * Input fields: Title, Author, ISBN, Category, Total Copies, Shelf Location (e.g. "Rack CS-01"), Publisher, Published Year, and Description.
   * Field validation: ISBN format, positive integer for copies, non-empty text fields.
2. Loading spinner state during server action execution.
3. Success notification / toast and automatic table refresh upon creation.

#### Files Created/Modified:
* `src/components/books/BookFormModal.tsx`
* `src/components/books/AddBookButton.tsx`

#### Verification:
* Successfully submitting the form creates the book record in Neon PostgreSQL.
* The new book immediately appears in the catalog list without requiring a manual page refresh.

#### Commit:
```bash
git add src/components/books/BookFormModal.tsx src/components/books/AddBookButton.tsx
git commit -m "feat(books-create): implement add book modal with validation and instant table revalidation"
```

---

### Phase 4: Book Details Modal, Edit Form & Delete Safeguard

#### Objective:
Provide detailed book inspection, metadata modification, and safe deletion capabilities for library administrators.

#### Deliverables:
1. **Book Details View (`src/components/books/BookDetailsModal.tsx`):**
   * Displays complete book information, cover image preview, shelf rack location, publication year, and borrow history summary.
2. **Edit Book Modal:**
   * Pre-fills existing values and allows updating title, author, category, shelf location, or total copies.
3. **Delete Confirmation Dialog (`src/components/books/DeleteBookDialog.tsx`):**
   * Confirmation alert warning before irreversible deletion.
   * Error prevention if the book is currently checked out by a student.

#### Files Created/Modified:
* `src/components/books/BookDetailsModal.tsx`
* `src/components/books/EditBookModal.tsx`
* `src/components/books/DeleteBookDialog.tsx`

#### Verification:
* Updating book stock recalculates available copies correctly.
* Deleting a book properly cleans up the database record and updates the UI.

#### Commit:
```bash
git add src/components/books/BookDetailsModal.tsx src/components/books/EditBookModal.tsx src/components/books/DeleteBookDialog.tsx
git commit -m "feat(books-management): add book details modal, editing form, and safe delete confirmation"
```

---

### Phase 5: Catalog Inventory Metrics & Category Analytics

#### Objective:
Integrate a high-level inventory statistics banner on the catalog page summarizing collection status.

#### Deliverables:
1. **Inventory Summary Header (`src/components/books/CatalogStats.tsx`):**
   * Total Book Titles (unique ISBN count).
   * Total Physical Copies (sum of `totalCopies`).
   * Currently Available Copies (sum of `availableCopies`).
   * Low Stock / Out of Stock alerts.
2. Category breakdown badges showing book counts per department.

#### Files Created/Modified:
* `src/components/books/CatalogStats.tsx`
* `src/app/dashboard/books/page.tsx`

#### Verification:
* Metric counters accurately reflect database aggregates.
* Summary cards render responsively above the catalog search bar.

#### Commit:
```bash
git add src/components/books/CatalogStats.tsx src/app/dashboard/books/page.tsx
git commit -m "feat(inventory-stats): add catalog inventory metrics and category breakdown badges"
```

---

### Phase 6: Code Polish, Type Safety & Pull Request Submission

#### Objective:
Perform complete testing, ensure strict TypeScript compliance, push the branch to GitHub, and submit a Pull Request.

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
   git push -u origin feature/book-catalog
   ```

#### Commit:
```bash
git add -A
git commit -m "chore(book-catalog): finalize TypeScript definitions, clean up styles, and prepare for PR review"
```

#### Pull Request Specifications:
* **Base Branch:** `main`
* **Compare Branch:** `feature/book-catalog`
* **PR Title:** `feat(book-catalog): book catalog browsing, real-time search, and CRUD inventory management`
* **Assigned Reviewers:** Member 1 and Member 3
* **PR Description Template:**
  ```markdown
  ## Module 2 Overview
  Implemented full book cataloging subsystem, real-time search and genre filtering, inventory stock tracking, and complete Book CRUD operations.

  ## Features Implemented
  - Book catalog listing in table and grid formats
  - Multi-field search (Title, Author, ISBN) and category filtering
  - Add Book modal with validation and shelf location assignment
  - Edit and Delete operations with safe stock recalculation
  - Inventory metric banner (Total titles, physical copies, stock status)

  ## Testing Steps
  1. Open `/dashboard/books` to view existing seeded catalog.
  2. Search for "Algorithms" or filter by "Computer Science".
  3. Click "Add New Book" and enter test details. Verify immediate appearance.
  4. Edit an existing title and verify updated information persists.
  5. Delete a test book and confirm removal.
  ```

---

## 3. Summary of Git Commits for Member 2

Member 2 will have at least 6 structured commits demonstrating incremental software development:

1. `feat(books): implement server actions for book querying, creation, updating, and deletion`
2. `feat(catalog-ui): build book catalog table, card view, and real-time filter bar`
3. `feat(books-create): implement add book modal with validation and instant table revalidation`
4. `feat(books-management): add book details modal, editing form, and safe delete confirmation`
5. `feat(inventory-stats): add catalog inventory metrics and category breakdown badges`
6. `chore(book-catalog): finalize TypeScript definitions, clean up styles, and prepare for PR review`
