"use client";
import { useState } from "react";
import { validateUserForm } from "@/features/users/userValidation";
import type { UserType } from "@/features/users/types";
import { setStoredUserRole } from "@/shared/lib/auth-storage";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ email?: boolean; password?: boolean }>({});

  const validateLoginForm = (nextEmail: string, nextPassword: string) =>
    validateUserForm(
      {
        email: nextEmail,
        password: nextPassword,
      },
      {
        requireName: false,
        requirePhone: false,
        requirePassword: true,
        requireConfirmPassword: false,
        validatePasswordConfirmation: false,
        requireUserType: false,
      },
    );

  const syncFieldErrors = (nextEmail: string, nextPassword: string) => {
    setFieldErrors(validateLoginForm(nextEmail, nextPassword));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError("");

    if (touchedFields.email || Object.keys(fieldErrors).length > 0) {
      syncFieldErrors(value, password);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError("");

    if (touchedFields.password || Object.keys(fieldErrors).length > 0) {
      syncFieldErrors(email, value);
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    syncFieldErrors(email, password);
  };

  const getInputClassName = (field: "email" | "password") =>
    `w-full mt-2 p-2 sm:p-3 bg-white/5 border rounded-lg focus:ring-2 outline-none text-white text-sm ${fieldErrors[field] ? "border-red-300 focus:ring-rose-500" : "border-white/10 focus:ring-indigo-500"}`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateLoginForm(email, password);
    setTouchedFields({ email: true, password: true });
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setError("");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Invalid credentials.");
        return;
      }

      const data = (await response.json()) as {
        redirectPath?: string;
        userType?: UserType;
      };

      if (data.userType) {
        setStoredUserRole(data.userType);
      }

      window.location.assign(data.redirectPath ?? "/dashboard");
    } catch {
      setError("Unable to login right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Sign In</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-400">Enter your email and password</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            className={getInputClassName("email")}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <p className="mt-2 text-xs sm:text-sm text-rose-400">{fieldErrors.email}</p> : null}
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            className={getInputClassName("password")}
            placeholder="••••••••"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onBlur={() => handleBlur("password")}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password ? <p className="mt-2 text-xs sm:text-sm text-rose-400">{fieldErrors.password}</p> : null}
        </div>
        {error && <p className="text-xs sm:text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
        >
          {isLoading ? "Signing in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
