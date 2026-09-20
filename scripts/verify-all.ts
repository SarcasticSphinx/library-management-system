import "dotenv/config";
import prisma from "../src/lib/prisma";
import { loginAction } from "../src/actions/authActions";
import { getBooksAction, getAvailableBooksAction } from "../src/actions/bookActions";
import {
  getCirculationRecordsAction,
  getCirculationStatsAction,
  getUserBorrowHistoryAction,
  issueBookAction,
  returnBookAction,
} from "../src/actions/loanActions";
import { getMembersAction } from "../src/actions/memberActions";

async function runVerification() {
  console.log("==================================================");
  console.log("   RUET LMS END-TO-END SYSTEM VERIFICATION       ");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Database Counts
  const userCount = await prisma.user.count();
  const bookCount = await prisma.book.count();
  const loanCount = await prisma.borrowRecord.count();
  assert(userCount >= 5, `Database has ${userCount} users (expected >= 5)`);
  assert(bookCount >= 20, `Database has ${bookCount} books (expected >= 20)`);
  assert(loanCount >= 5, `Database has ${loanCount} circulation records (expected >= 5)`);

  // 2. Authentication: Admin Login
  const adminLogin = await loginAction("librarian@ruet.ac.bd", "password123");
  assert(adminLogin.success === true, "Admin login with librarian@ruet.ac.bd succeeds");

  // 3. Authentication: Student Login
  const studentLogin = await loginAction("student@ruet.ac.bd", "password123");
  assert(studentLogin.success === true, "Student login with student@ruet.ac.bd succeeds");

  // 4. Authentication: Invalid Password
  const invalidLogin = await loginAction("student@ruet.ac.bd", "wrongpassword");
  assert(invalidLogin.success === false, "Invalid password correctly rejected");

  // 5. Book Catalog: Fetch all books
  const allBooks = await getBooksAction();
  assert(allBooks.length >= 20, `getBooksAction returned ${allBooks.length} books`);

  // 6. Book Catalog: Search query
  const searchResults = await getBooksAction("Algorithms");
  assert(
    searchResults.some((b) => b.title.includes("Algorithms")),
    "Search for 'Algorithms' found matching book"
  );

  // 7. Book Catalog: Category filter
  const cseBooks = await getBooksAction("", "Computer Science");
  assert(cseBooks.length > 0, `Category filter 'Computer Science' returned ${cseBooks.length} books`);

  // 8. Book Catalog: Available books for loan modal
  const availableBooksRes = await getAvailableBooksAction();
  assert(
    availableBooksRes.success && (availableBooksRes.data?.length ?? 0) > 0,
    `getAvailableBooksAction returned ${availableBooksRes.data?.length} available titles`
  );

  // 9. Member Directory Action
  const members = await getMembersAction();
  assert(members.length >= 4, `getMembersAction returned ${members.length} registered students`);

  // 10. Circulation: Stats Action
  const statsRes = await getCirculationStatsAction();
  assert(statsRes.success === true, "getCirculationStatsAction succeeded");
  assert((statsRes.data?.totalActive ?? 0) > 0, `Active loans: ${statsRes.data?.totalActive}`);
  assert((statsRes.data?.totalOverdue ?? 0) > 0, `Overdue loans: ${statsRes.data?.totalOverdue}`);

  // 11. Circulation: Records
  const recordsRes = await getCirculationRecordsAction();
  assert(recordsRes.success === true, `getCirculationRecordsAction returned ${recordsRes.data?.length} records`);

  // 12. Student Personal History
  const suhail = await prisma.user.findUnique({ where: { email: "student@ruet.ac.bd" } });
  if (suhail) {
    const historyRes = await getUserBorrowHistoryAction(suhail.id);
    assert(
      historyRes.success && (historyRes.data?.length ?? 0) > 0,
      `getUserBorrowHistoryAction returned ${historyRes.data?.length} loans for student Suhail`
    );
  }

  // 13. Full Borrow -> Return Transaction Flow
  const targetBook = allBooks.find((b) => b.title.includes("Dragon Book")) || allBooks[0];
  const tahsin = await prisma.user.findUnique({ where: { email: "tahsin@ruet.ac.bd" } });

  if (targetBook && tahsin) {
    const initialCopies = targetBook.availableCopies;
    console.log(`\nTesting checkout flow for "${targetBook.title}" (initial copies: ${initialCopies})...`);

    // Issue book
    const issueRes = await issueBookAction({
      userId: tahsin.id,
      bookId: targetBook.id,
      loanDays: 14,
      notes: "Automated verification checkout test",
    });
    assert(issueRes.success === true, "issueBookAction succeeded");

    // Verify copy decremented
    const bookAfterIssue = await prisma.book.findUnique({ where: { id: targetBook.id } });
    assert(
      bookAfterIssue?.availableCopies === initialCopies - 1,
      `Available copies decremented from ${initialCopies} to ${bookAfterIssue?.availableCopies}`
    );

    // Return book
    if (issueRes.data) {
      console.log(`Testing return flow for record ${issueRes.data.id}...`);
      const returnRes = await returnBookAction({ recordId: issueRes.data.id });
      assert(returnRes.success === true, "returnBookAction succeeded");

      // Verify copy incremented back
      const bookAfterReturn = await prisma.book.findUnique({ where: { id: targetBook.id } });
      assert(
        bookAfterReturn?.availableCopies === initialCopies,
        `Available copies restored back to ${initialCopies}`
      );
    }
  }

  console.log("\n==================================================");
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runVerification().catch((err) => {
  console.error("Verification crashed:", err);
  process.exit(1);
});
