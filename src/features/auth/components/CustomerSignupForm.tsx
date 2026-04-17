"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SignupResponse = {
  error?: string;
  redirectPath?: string;
};

type CustomerSignupFormProps = {
  onSuccess?: () => void;
};


const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function CustomerSignupForm({ onSuccess }: CustomerSignupFormProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as SignupResponse;

      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      setForm(INITIAL_FORM);
      onSuccess?.();
      router.push(data.redirectPath ?? "/dashboard/customer");
      router.refresh();
    } catch {
      setError("Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Create your account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-300">
          Sign up as a customer to explore restaurants and manage your marketplace experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Full Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Customer name"
              className="mt-2 w-full rounded-2xl border border-white/90 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>

          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder="Phone"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>
        </div>

        <label className="block text-xs sm:text-sm font-medium text-gray-200">
          Email Address
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="customer@example.com"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
          />
        </label>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="Minimum 6 characters"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>

          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Confirm Password
            <input
              type="password"
              required
              minLength={6}
              value={form.confirmPassword}
              onChange={(event) => handleChange("confirmPassword", event.target.value)}
              placeholder="Re-enter password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>
        </div>

        {error ? <p className="text-xs sm:text-sm text-rose-300">{error}</p> : null}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            Already registered? Use the <Link href="/login" className=" text-emerald-400">login</Link> button.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-[#04110e] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create Customer"}
          </button>
        </div>
      </form>
    </>
  );
}