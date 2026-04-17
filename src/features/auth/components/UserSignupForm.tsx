"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRecord, UserType } from "@/features/users/types";

type FormUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
};

type UserSignupFormProps = {
  onSuccess?: () => void;
  userTypeOptions?: UserType[];
  userToEdit?: UserRecord | null;
  apiPath?: string;
  onCreated?: (user: FormUser) => void;
  onUpdated?: (user: FormUser) => void;
  method?: "POST" | "PATCH";
};

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  userType: "CUSTOMER" as UserType,
};

function getDefaultUserType(userTypeOptions?: UserType[]) {
  return userTypeOptions && userTypeOptions.length > 0 ? userTypeOptions[0] : INITIAL_FORM.userType;
}

export default function UserSignupForm({
  onSuccess,
  userTypeOptions,
  apiPath = "/api/auth/register",
  onCreated,
  onUpdated,
  method = "POST",
  userToEdit,
}: UserSignupFormProps) {
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    userType: getDefaultUserType(userTypeOptions),
  }));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isUpdateMode = method === "PATCH";
  const isChangingPassword = form.password.trim().length > 0 || form.confirmPassword.trim().length > 0;

  useEffect(() => {
    if (userToEdit) {
      setForm({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        password: "",
        confirmPassword: "",
        userType: userToEdit.userType,
      });
      return;
    }

    setForm({
      ...INITIAL_FORM,
      userType: getDefaultUserType(userTypeOptions),
    });
  }, [userToEdit, userTypeOptions]);

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

    const creatingUserViaAdmin = apiPath === "/api/users" && !isUpdateMode;
    if (creatingUserViaAdmin && !form.phone.trim()) {
      setError("Phone is required");
      setIsSubmitting(false);
      return;
    }

    if ((!isUpdateMode || isChangingPassword) && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (isUpdateMode && isChangingPassword && form.password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    const payload: Record<string, string> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    if (!isUpdateMode || (userTypeOptions && userTypeOptions.length > 0)) {
      payload.userType = form.userType;
    }

    if (!isUpdateMode || isChangingPassword) {
      payload.password = form.password;
    }

    try {
      const response = await fetch(apiPath, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError((data && data.error) || (isUpdateMode ? "Unable to update account." : "Unable to create account."));
        return;
      }

      if (data && data.user) {
        if (isUpdateMode) {
          onUpdated?.(data.user);
          setForm((prev) => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            userType: data.user.userType,
            password: "",
            confirmPassword: "",
          }));
        } else {
          onCreated?.(data.user);
          setForm({
            ...INITIAL_FORM,
            userType: getDefaultUserType(userTypeOptions),
          });
        }

        onSuccess?.();
        return;
      }

      setForm({
        ...INITIAL_FORM,
        userType: getDefaultUserType(userTypeOptions),
      });
      onSuccess?.();
      router.push((data && data.redirectPath) || "/dashboard");
      router.refresh();
    } catch {
      setError(isUpdateMode ? "Unable to update account." : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight  text-white">
          {isUpdateMode ? "Update user account" : "Create user account"}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-300">
          {isUpdateMode
            ? "Edit the user's details and optionally set a new password."
            : "Create a new user to explore restaurants and manage marketplace experience."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <label className="block text-xs  sm:text-sm font-medium text-gray-200">
          Full Name
            <input
         type="text"
             value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
              placeholder="User name"
              className="mt-2 w-full rounded-2xl border border-white/40 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>

          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Phone
            <input
        type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder={isUpdateMode ? "Phone number" : "phone"}
              className="mt-2 w-full rounded-2xl border border-white/40 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
          />
          </label>
        </div>

        <label className="block text-xs sm:text-sm font-medium text-gray-200">
        User Type
          {userTypeOptions && userTypeOptions.length > 0 ? (
       <select
              value={form.userType}
           onChange={(event) => handleChange("userType", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/40 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
         >
              {userTypeOptions.map((option) => (
                <option key={option} value={option}>
               {option.toLowerCase()}
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
         className="mt-2 w-full rounded-2xl border border-white/40 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
          />
        </label>

     <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Password
            <input
           type="password"
              required={!isUpdateMode}
            minLength={isUpdateMode ? undefined : 6}
             value={form.password}
             onChange={(event) => handleChange("password", event.target.value)}
            placeholder={isUpdateMode ? "Leave blank to keep current password" : "Minimum 6 characters"}
              className="mt-2 w-full rounded-2xl border border-white/40 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
          />
          </label>

          <label className="block text-xs sm:text-sm font-medium text-gray-200">
            Confirm Password
            <input
              type="password"
              required={!isUpdateMode || isChangingPassword}
              minLength={isUpdateMode && !isChangingPassword ? undefined : 6}
              value={form.confirmPassword}
              onChange={(event) => handleChange("confirmPassword", event.target.value)}
              placeholder={isUpdateMode ? "Repeat new password if changing it" : "Re-enter password"}
              className="mt-2 w-full rounded-2xl border border-white/40 bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"
            />
          </label>
        </div>

        {error ? <p className="text-xs sm:text-sm text-rose-300">{error}</p> : null}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-[#04110e] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? isUpdateMode
                ? "Saving changes..."
                : "Creating account..."
              : isUpdateMode
                ? "Save User Changes"
                : "Create User Account"}
          </button>
        </div>
      </form>
    </>
  );
}