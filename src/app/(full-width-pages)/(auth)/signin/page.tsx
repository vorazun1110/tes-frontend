import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ти Эм Ойл Транс | Нэвтрэх",
  description: "Ти Эм Ойл Транс | Нэвтрэх",
};

export default function SignIn() {
  return <SignInForm />;
}
