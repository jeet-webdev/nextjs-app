"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type UserFormValidationErrors,
  hasUserFormErrors,
  validateUserForm,
} from "@/features/users/userValidation";

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
  const [fieldErrors, setFieldErrors] = useState<UserFormValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof typeof INITIAL_FORM, boolean>>
  >({});
  const router = useRouter();

  const validateCustomerForm = (nextForm: typeof INITIAL_FORM) =>
    validateUserForm(nextForm, {
      requirePassword: true,
      requireConfirmPassword: true,
      validatePasswordConfirmation: true,
      requireUserType: false,
    });

  const handleChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    const nextForm = {
      ...form,
      [field]: value,
    };

    setForm(nextForm);
    setError("");

    if (touchedFields[field] || hasUserFormErrors(fieldErrors)) {
      setFieldErrors(validateCustomerForm(nextForm));
    }
  };

  const handleBlur = (field: keyof typeof INITIAL_FORM) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    setFieldErrors(validateCustomerForm(form));
  };

  const getInputClassName = (field: keyof typeof INITIAL_FORM) =>
    `mt-2 w-full rounded-2xl border bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition ${fieldErrors[field] ? "border-red-300 focus:border-red-300 focus:ring-2 focus:ring-rose-500/30" : "border-white/10 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCustomerForm(form);
    setTouchedFields({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });
    setFieldErrors(nextErrors);

    if (hasUserFormErrors(nextErrors)) {
      setError("");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });

      const data = (await response.json()) as SignupResponse;

      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      setForm(INITIAL_FORM);
  setFieldErrors({});
  setTouchedFields({});
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
              onBlur={() => handleBlur("name")}
              placeholder="Customer name"
              className={getInputClassName("name")}
              aria-invalid={Boolean(fieldErrors.name)}
            />
            {fieldErrors.name ? <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.name}</p> : null}
          </label>

          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="Phone"
              className={getInputClassName("phone")}
              aria-invalid={Boolean(fieldErrors.phone)}
            />
            {fieldErrors.phone ? <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.phone}</p> : null}
          </label>
        </div>

        <label className="block text-xs sm:text-sm font-medium text-gray-200">
          Email Address
          <input
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="customer@example.com"
            className={getInputClassName("email")}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.email}</p> : null}
        </label>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="Minimum 6 characters"
              className={getInputClassName("password")}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password ? <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.password}</p> : null}
          </label>

          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Confirm Password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) => handleChange("confirmPassword", event.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Re-enter password"
              className={getInputClassName("confirmPassword")}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />
            {fieldErrors.confirmPassword ? <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.confirmPassword}</p> : null}
          </label>
        </div>

        {error ? <p className="text-xs sm:text-sm text-red-400">{error}</p> : null}

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