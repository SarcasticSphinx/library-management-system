import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RUET Library Management System",
  description: "CSE 3206 Software Engineering Lab Project - RUET Library Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900"
      >
        {children}
      </body>
    </html>
  );
}
