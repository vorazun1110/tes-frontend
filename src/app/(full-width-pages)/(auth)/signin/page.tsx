import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тэс Петролиум | Нэвтрэх",
  description: "Тэс Петролиум | Нэвтрэх",
};

export default function SignIn() {
  return <SignInForm />;
}
