import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - RUET Library Management System",
  description: "Create a library member account to borrow books and access RUET academic resources.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
