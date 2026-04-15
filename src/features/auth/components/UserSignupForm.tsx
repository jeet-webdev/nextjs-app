"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserType } from "@/features/users/types";

type UserSignupFormProps = {
  onSuccess?: () => void;
  userTypeOptions?: UserType[];
  apiPath?: string;
  onCreated?: (user: { id: string; name: string; email: string; phone: string; userType: UserType }) => void;
};


const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  userType: "CUSTOMER",
};

export default function UserSignupForm({ onSuccess, userTypeOptions, apiPath = "/api/auth/register", onCreated }: UserSignupFormProps) {
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    userType: userTypeOptions && userTypeOptions.length > 0 ? userTypeOptions[0] : INITIAL_FORM.userType,
  }));
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

    // client-side validation: require phone when creating via /api/users (admin create)
    const creatingUserViaAdmin = apiPath === "/api/users";
    if (creatingUserViaAdmin && !form.phone.trim()) {
      setError("Phone is required when creating users from the dashboard.");
      setIsSubmitting(false);
      return;
    }

    // client-side confirm password check
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError((data && data.error) || "Unable to create account.");
        return;
      }

      
      if (data && data.user) {
        onCreated?.(data.user);
        setForm(INITIAL_FORM);
        onSuccess?.();
        return;
      }

      
      setForm(INITIAL_FORM);
      onSuccess?.();
      router.push((data && data.redirectPath) || "/dashboard");
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
          Create user account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-300">
          Create a new User to explore restaurants and manage marketplace experience.
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
              placeholder="User name"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>

          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder="Optional phone"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>
        </div>

         <label className="block text-xs sm:text-sm font-medium text-gray-200"> {/*//only for admin creating other users, normal users won't see this field */}
          User Type
          {userTypeOptions && userTypeOptions.length > 0 ? (
            <select
              value={form.userType}
              onChange={(e) => handleChange("userType", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            >
              {userTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toLowerCase()}
                </option>
              ))}
            </select>
          ) : (
            <input type="hidden" value={form.userType} />
          )}
        </label>

        <label className="block text-xs sm:text-sm font-medium text-gray-200">
          Email Address
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="user@example.com"
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
          {/* <p className="text-sm text-gray-400">Already registered? Use the <Link href="/login" className=" text-emerald-400">login</Link> button above.</p> */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-[#04110e] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create User Account"}
          </button>
        </div>
      </form>
    </>
  );
}