import "dotenv/config";
import { Role, BorrowStatus, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Starting comprehensive database seeding...");

  // Clean existing circulation records, books, and users
  await prisma.borrowRecord.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Seed Users (Admin & Students across RUET Departments)
  const admin = await prisma.user.create({
    data: {
      email: "librarian@ruet.ac.bd",
      name: "Dr. Central Librarian",
      password: passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      department: "Library Administration",
      phone: "+8801711000001",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: "student@ruet.ac.bd",
      name: "Suhail Ahmed",
      password: passwordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      studentId: "2003001",
      department: "Computer Science & Engineering",
      phone: "+8801711000002",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "rahul@gmail.com",
      name: "Rahul Chandraw Dash",
      password: passwordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      studentId: "2003002",
      department: "Computer Science & Engineering",
      phone: "+8801711000003",
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: "tahsin@ruet.ac.bd",
      name: "Tahsin Islam",
      password: passwordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      studentId: "2005014",
      department: "Electrical & Electronic Engineering",
      phone: "+8801711000004",
    },
  });

  const student4 = await prisma.user.create({
    data: {
      email: "anika@ruet.ac.bd",
      name: "Anika Tabassum",
      password: passwordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      studentId: "2002045",
      department: "Mechanical Engineering",
      phone: "+8801711000005",
    },
  });

  console.log("Users created successfully:");
  console.log(`- Admin: ${admin.email} (password123)`);
  console.log(`- Students: ${student1.email}, ${student2.email}, ${student3.email}, ${student4.email} (password123)`);

  // 2. Seed Realistic Academic Catalog Books
  const booksData = [
    // Computer Science & Engineering
    {
      title: "Introduction to Algorithms (CLRS)",
      author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
      isbn: "978-0262033848",
      category: "Computer Science",
      publisher: "MIT Press",
      publishedYear: 2009,
      shelfLocation: "Rack CS-01",
      description: "A comprehensive update of the leading algorithms text, with new material on matchings in bipartite graphs, online algorithms, machine learning, and other topics.",
      coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
      totalCopies: 6,
      availableCopies: 4,
    },
    {
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Software Engineering",
      publisher: "Prentice Hall",
      publishedYear: 2008,
      shelfLocation: "Rack SE-03",
      description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 3,
    },
    {
      title: "Database System Concepts (7th Edition)",
      author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
      isbn: "978-0078022159",
      category: "Database Systems",
      publisher: "McGraw-Hill",
      publishedYear: 2019,
      shelfLocation: "Rack DB-02",
      description: "Presents the fundamental concepts of database management in an intuitive manner geared toward allowing students to begin working with databases as quickly as possible.",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: "Operating System Concepts",
      author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
      isbn: "978-1118063330",
      category: "Operating Systems",
      publisher: "Wiley",
      publishedYear: 2018,
      shelfLocation: "Rack OS-05",
      description: "The tenth edition of Operating System Concepts provides a solid theoretical foundation for understanding operating systems.",
      coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: "Computer Networks (5th Edition)",
      author: "Andrew S. Tanenbaum, David J. Wetherall",
      isbn: "978-0132126953",
      category: "Computer Networks",
      publisher: "Pearson",
      publishedYear: 2010,
      shelfLocation: "Rack NET-01",
      description: "Appropriate for Computer Networking or Introduction to Networking courses at both the undergraduate and graduate level.",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 3,
    },
    {
      title: "Artificial Intelligence: A Modern Approach (4th Edition)",
      author: "Stuart Russell, Peter Norvig",
      isbn: "978-0134610993",
      category: "Artificial Intelligence",
      publisher: "Pearson",
      publishedYear: 2020,
      shelfLocation: "Rack AI-04",
      description: "The most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence.",
      coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      isbn: "978-0201633610",
      category: "Software Engineering",
      publisher: "Addison-Wesley",
      publishedYear: 1994,
      shelfLocation: "Rack SE-01",
      description: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple, succinct solutions to commonly occurring design problems.",
      coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
      totalCopies: 3,
      availableCopies: 3,
    },
    {
      title: "Compilers: Principles, Techniques, and Tools (Dragon Book)",
      author: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
      isbn: "978-0321486813",
      category: "Computer Science",
      publisher: "Addison-Wesley",
      publishedYear: 2006,
      shelfLocation: "Rack CS-08",
      description: "The classic compiler design handbook covering lexical analysis, parsing, syntax-directed translation, code generation, and optimization.",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
      totalCopies: 3,
      availableCopies: 3,
    },
    {
      title: "Introduction to the Theory of Computation",
      author: "Michael Sipser",
      isbn: "978-1133187790",
      category: "Computer Science",
      publisher: "Cengage Learning",
      publishedYear: 2012,
      shelfLocation: "Rack CS-04",
      description: "Highly accessible book that introduces students to the computational theory behind finite automata, context-free languages, and Turing machines.",
      coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },

    // Electrical & Electronic Engineering
    {
      title: "Microelectronic Circuits (8th Edition)",
      author: "Adel S. Sedra, Kenneth C. Smith, Tony Chan Carusone, Vincent Gaudet",
      isbn: "978-0190853464",
      category: "Electrical Engineering",
      publisher: "Oxford University Press",
      publishedYear: 2019,
      shelfLocation: "Rack EEE-01",
      description: "The international standard for courses in microelectronic circuits, offering a thorough treatment of analog and digital circuit design.",
      coverImage: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
      totalCopies: 5,
      availableCopies: 5,
    },
    {
      title: "Electronic Devices and Circuit Theory",
      author: "Robert L. Boylestad, Louis Nashelsky",
      isbn: "978-0132622264",
      category: "Electrical Engineering",
      publisher: "Pearson",
      publishedYear: 2012,
      shelfLocation: "Rack EEE-03",
      description: "Offers students a complete, comprehensive survey focusing on all the essentials they need to succeed on the job.",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: "Electric Circuits (11th Edition)",
      author: "James W. Nilsson, Susan A. Riedel",
      isbn: "978-0134746968",
      category: "Electrical Engineering",
      publisher: "Pearson",
      publishedYear: 2018,
      shelfLocation: "Rack EEE-05",
      description: "The most widely used introductory circuits textbook of the past 25 years. Known for clear explanations and real-world examples.",
      coverImage: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
      totalCopies: 3,
      availableCopies: 3,
    },
    {
      title: "Signals and Systems (2nd Edition)",
      author: "Alan V. Oppenheim, Alan S. Willsky, S. Hamid Nawab",
      isbn: "978-0138147570",
      category: "Electrical Engineering",
      publisher: "Prentice Hall",
      publishedYear: 1996,
      shelfLocation: "Rack EEE-08",
      description: "A comprehensive exploration of signals and systems develops continuous-time and discrete-time concepts and methods in parallel.",
      coverImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },

    // Mechanical & Civil Engineering
    {
      title: "Engineering Mechanics: Statics & Dynamics (14th Edition)",
      author: "Russell C. Hibbeler",
      isbn: "978-0133915426",
      category: "Mechanical Engineering",
      publisher: "Pearson",
      publishedYear: 2015,
      shelfLocation: "Rack ME-02",
      description: "Empowers students to succeed by drawing upon Professor Hibbeler's everyday classroom experience and his knowledge of how students learn.",
      coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: "Thermodynamics: An Engineering Approach (9th Edition)",
      author: "Yunus A. Cengel, Michael A. Boles, Mehmet Kanoglu",
      isbn: "978-1259822674",
      category: "Mechanical Engineering",
      publisher: "McGraw-Hill",
      publishedYear: 2018,
      shelfLocation: "Rack ME-05",
      description: "The subject of thermodynamics deals with energy and has long been an essential part of engineering curricula all over the world.",
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: "Fundamentals of Fluid Mechanics (8th Edition)",
      author: "Bruce R. Munson, Alric P. Rothmayer, Theodore H. Okiishi",
      isbn: "978-1119080701",
      category: "Civil Engineering",
      publisher: "Wiley",
      publishedYear: 2016,
      shelfLocation: "Rack CE-03",
      description: "Offers comprehensive topical coverage, with varied examples and problems, application of visual component of fluid mechanics, and strong focus on effective learning.",
      coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      totalCopies: 3,
      availableCopies: 3,
    },

    // Mathematics & Basic Sciences
    {
      title: "Calculus: Early Transcendentals (8th Edition)",
      author: "James Stewart",
      isbn: "978-1285741550",
      category: "Mathematics",
      publisher: "Cengage Learning",
      publishedYear: 2015,
      shelfLocation: "Rack MATH-01",
      description: "Success in your calculus course starts here! James Stewart's CALCULUS texts are worldwide best-sellers for a reason.",
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80",
      totalCopies: 5,
      availableCopies: 5,
    },
    {
      title: "Elementary Linear Algebra (11th Edition)",
      author: "Howard Anton, Chris Rorres",
      isbn: "978-1118434413",
      category: "Mathematics",
      publisher: "Wiley",
      publishedYear: 2013,
      shelfLocation: "Rack MATH-04",
      description: "Gives an elementary treatment of linear algebra that is suitable for a first course for undergraduate students.",
      coverImage: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: "Fundamentals of Physics (11th Edition)",
      author: "David Halliday, Robert Resnick, Jearl Walker",
      isbn: "978-1119286240",
      category: "Physics",
      publisher: "Wiley",
      publishedYear: 2018,
      shelfLocation: "Rack PHY-02",
      description: "Renowned for its superior problem-solving skills development, reasoning skills development, and emphasis on conceptual understanding.",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
      totalCopies: 5,
      availableCopies: 5,
    },
    {
      title: "Advanced Engineering Mathematics (10th Edition)",
      author: "Erwin Kreyszig",
      isbn: "978-0470458365",
      category: "Mathematics",
      publisher: "Wiley",
      publishedYear: 2011,
      shelfLocation: "Rack MATH-07",
      description: "A comprehensive handbook covering differential equations, linear algebra, vector calculus, Fourier analysis, and complex analysis for engineers.",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },

    // Literature & General Reading
    {
      title: "1984",
      author: "George Orwell",
      isbn: "978-0451524935",
      category: "Literature",
      publisher: "Signet Classic",
      publishedYear: 1949,
      shelfLocation: "Rack LIT-01",
      description: "The dystopian masterpiece exploring surveillance, total control, language degradation, and the preservation of truth.",
      coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      isbn: "978-0062316097",
      category: "History & Philosophy",
      publisher: "Harper",
      publishedYear: 2015,
      shelfLocation: "Rack GEN-03",
      description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution from the Stone Age to Silicon Valley.",
      coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
      totalCopies: 3,
      availableCopies: 3,
    },
  ];

  const createdBooks = [];
  for (const b of booksData) {
    const book = await prisma.book.create({ data: b });
    createdBooks.push(book);
  }

  console.log(`Created ${createdBooks.length} textbooks across 8 academic categories.`);

  // 3. Seed Realistic Circulation Loans (Active, Overdue, and Returned)
  const now = new Date();

  // Active Loan 1: Suhail borrowed CLRS Algorithms
  const dueDate1 = new Date(now);
  dueDate1.setDate(now.getDate() + 10); // 10 days left
  await prisma.borrowRecord.create({
    data: {
      userId: student1.id,
      bookId: createdBooks[0].id, // CLRS
      borrowDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      dueDate: dueDate1,
      status: BorrowStatus.BORROWED,
      notes: "Semester exam preparation",
    },
  });

  // Active Loan 2: Rahul borrowed Clean Code
  const dueDate2 = new Date(now);
  dueDate2.setDate(now.getDate() + 7); // 7 days left
  await prisma.borrowRecord.create({
    data: {
      userId: student2.id,
      bookId: createdBooks[1].id, // Clean Code
      borrowDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      dueDate: dueDate2,
      status: BorrowStatus.BORROWED,
      notes: "Software Engineering lab assignment",
    },
  });

  // Active Loan 3: Tahsin borrowed Database Systems
  const dueDate3 = new Date(now);
  dueDate3.setDate(now.getDate() + 5); // 5 days left
  await prisma.borrowRecord.create({
    data: {
      userId: student3.id,
      bookId: createdBooks[2].id, // Database Systems
      borrowDate: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      dueDate: dueDate3,
      status: BorrowStatus.BORROWED,
      notes: "Project architecture study",
    },
  });

  // Overdue Loan: Suhail borrowed Operating Systems (due 4 days ago)
  const dueDateOverdue = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  const borrowDateOverdue = new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000);
  await prisma.borrowRecord.create({
    data: {
      userId: student1.id,
      bookId: createdBooks[3].id, // Operating Systems
      borrowDate: borrowDateOverdue,
      dueDate: dueDateOverdue,
      status: BorrowStatus.OVERDUE,
      fineAmount: 20.0, // 4 days * 5 BDT
      notes: "Notice sent to student email",
    },
  });

  // Active Loan: Anika borrowed Computer Networks
  const dueDate4 = new Date(now);
  dueDate4.setDate(now.getDate() + 12);
  await prisma.borrowRecord.create({
    data: {
      userId: student4.id,
      bookId: createdBooks[4].id, // Computer Networks
      borrowDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      dueDate: dueDate4,
      status: BorrowStatus.BORROWED,
      notes: "Network protocol analysis",
    },
  });

  // Returned Loan 1: Suhail previously borrowed & returned Signals and Systems on time
  await prisma.borrowRecord.create({
    data: {
      userId: student1.id,
      bookId: createdBooks[12].id, // Signals and Systems
      borrowDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
      returnDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
      status: BorrowStatus.RETURNED,
      fineAmount: 0.0,
      notes: "Returned in excellent condition",
    },
  });

  // Returned Loan 2: Rahul borrowed & returned Calculus late (paid 15 BDT fine)
  await prisma.borrowRecord.create({
    data: {
      userId: student2.id,
      bookId: createdBooks[16].id, // Calculus
      borrowDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
      returnDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      status: BorrowStatus.RETURNED,
      fineAmount: 15.0, // 3 days late
      notes: "Overdue fine of 15 BDT cleared at circulation desk",
    },
  });

  console.log("Circulation records created: 4 active loans, 1 overdue loan, 2 returned history entries.");
  console.log("Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
