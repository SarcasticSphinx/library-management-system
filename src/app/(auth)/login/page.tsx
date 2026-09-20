import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - RUET Library Management System",
  description: "Sign in to your library account to borrow books and manage loans.",
};

export default function LoginPage() {
  return <LoginForm />;
}
