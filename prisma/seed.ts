import "dotenv/config";
import { Role, BorrowStatus, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database...");

  // Clean existing records
  await prisma.borrowRecord.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "librarian@ruet.ac.bd",
      name: "Dr. Central Librarian",
      password: passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      department: "Library Administration",
      phone: "+8801700000001",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@ruet.ac.bd",
      name: "Suhail Ahmed",
      password: passwordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      studentId: "2003001",
      department: "Computer Science & Engineering",
      phone: "+8801700000002",
    },
  });

  console.log("Created users:", { admin: admin.email, student: student.email });

  // Create Books with realistic catalog metadata
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: "Introduction to Algorithms (CLRS)",
        author: "Thomas H. Cormen, Charles E. Leiserson",
        isbn: "978-0262033848",
        category: "Computer Science",
        publisher: "MIT Press",
        publishedYear: 2009,
        shelfLocation: "Rack CS-01",
        description: "Essential reference for algorithms, data structures, dynamic programming, and graph theory.",
        coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
        totalCopies: 5,
        availableCopies: 4,
      },
    }),
    prisma.book.create({
      data: {
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        isbn: "978-0132350884",
        category: "Software Engineering",
        publisher: "Prentice Hall",
        publishedYear: 2008,
        shelfLocation: "Rack SE-03",
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        totalCopies: 3,
        availableCopies: 3,
      },
    }),
    prisma.book.create({
      data: {
        title: "Database System Concepts (7th Edition)",
        author: "Abraham Silberschatz, Henry F. Korth",
        isbn: "978-0078022159",
        category: "Database Systems",
        publisher: "McGraw-Hill",
        publishedYear: 2019,
        shelfLocation: "Rack DB-02",
        description: "Foundations of relational database design, SQL, indexing, concurrency control, and transactions.",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        totalCopies: 4,
        availableCopies: 3,
      },
    }),
    prisma.book.create({
      data: {
        title: "Operating System Concepts",
        author: "Abraham Silberschatz, Peter B. Galvin",
        isbn: "978-1118063330",
        category: "Operating Systems",
        publisher: "Wiley",
        publishedYear: 2018,
        shelfLocation: "Rack OS-05",
        description: "Covers processes, threads, synchronization, CPU scheduling, deadlocks, and virtual memory.",
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
        totalCopies: 4,
        availableCopies: 4,
      },
    }),
  ]);

  console.log(`Created ${books.length} sample books.`);

  // Create a sample borrow record
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 14 days loan

  await prisma.borrowRecord.create({
    data: {
      userId: student.id,
      bookId: books[0].id,
      dueDate,
      status: BorrowStatus.BORROWED,
      notes: "First issue of the semester",
    },
  });

  console.log("Sample borrow record created.");
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
