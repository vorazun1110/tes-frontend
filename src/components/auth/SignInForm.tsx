"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiAction } from "@/lib/api"; // adjust import if different
import { AUTH_TOKEN_KEY } from "@/lib/auth";

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token?: string; // adapt keys to your API response
    user?: unknown;
  };
  // add refreshToken, expiresIn, etc. if your API returns them
};

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // remember me
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // basic guard
    if (!username || !password) {
      setError("Нэвтрэх нэр болон нууц үгээ бөглөнө үү.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiAction<LoginResponse>("/auth/login", "POST", {
        username,
        password,
      });
      if (!res.success) {
        throw new Error(res.message);
      }
      // normalize token key
      const token = res.data.token ?? res.data.token;
      if (!token) {
        throw new Error("Токен олдсонгүй. Серверийн хариуг шалгана уу.");
      }

      const storage = isChecked ? window.localStorage : window.sessionStorage;
      storage.setItem(AUTH_TOKEN_KEY, token);


      // Navigate after successful login
      router.replace("/");
    } catch (err: unknown) {
      // handleResponse likely throws on non-2xx; surface message
      const msg =
        err instanceof Error ? err.message : "Нэвтрэх оролдлого амжилтгүй боллоо. Дахин оролдоно уу.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Нэвтрэх
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Системд тавтай морилно уу
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                <div>
                  <Label>
                    Нэвтрэх нэр <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Нэвтрэх нэр"
                    type="text"
                    defaultValue={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUsername(e.target.value)
                    }
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label>
                    Нууц үг <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Нууц үг"
                      defaultValue={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      disabled={submitting}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харах"}
                      role="button"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onChange={setIsChecked}
                      disabled={submitting}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Сануулах
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Нууц үг мартсан уу?
                  </Link>
                </div>

                {error && (
                  <p className="text-sm text-error-600 dark:text-error-400">
                    {error}
                  </p>
                )}

                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting ? "Нэвтэрч байна…" : "Нэвтрэх"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
