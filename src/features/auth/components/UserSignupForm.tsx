"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRecord, UserType } from "@/features/users/types";
import {
  type UserFormValidationErrors,
  hasUserFormErrors,
  validateUserForm,
} from "@/features/users/userValidation";

type FormUser = Omit<UserRecord, "createdAt"> & { createdAt?: string };

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
  const [fieldErrors, setFieldErrors] = useState<UserFormValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof typeof INITIAL_FORM, boolean>>
  >({});
  const router = useRouter();
  const isUpdateMode = method === "PATCH";
  const isChangingPassword = form.password.trim().length > 0 || form.confirmPassword.trim().length > 0;

  const validateSignupForm = (nextForm: typeof form) =>
    validateUserForm(nextForm, {
      requirePassword: !isUpdateMode || isChangingPassword,
      requireConfirmPassword: !isUpdateMode || isChangingPassword,
      validatePasswordConfirmation: !isUpdateMode || isChangingPassword,
      requireUserType: Boolean(userTypeOptions && userTypeOptions.length > 0),
    });

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
      setFieldErrors({});
      setTouchedFields({});
      setError("");
      return;
    }

    setForm({
      ...INITIAL_FORM,
      userType: getDefaultUserType(userTypeOptions),
    });
    setFieldErrors({});
    setTouchedFields({});
    setError("");
  }, [userToEdit, userTypeOptions]);

  const handleChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    const nextForm = {
      ...form,
      [field]: value,
    };

    setForm(nextForm);
    setError("");

    if (touchedFields[field] || hasUserFormErrors(fieldErrors)) {
      setFieldErrors(validateSignupForm(nextForm));
    }
  };

  const handleBlur = (field: keyof typeof INITIAL_FORM) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    setFieldErrors(validateSignupForm(form));
  };

  const getInputClassName = (field: keyof typeof INITIAL_FORM) =>
    `mt-2 w-full rounded-2xl border bg-black/30 px-3 sm:px-4 py-2 sm:py-3 text-sm text-white outline-none transition ${fieldErrors[field] ? "border-red-300 focus:border-red-300 focus:ring-2 focus:ring-rose-500/30" : "border-white/40 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30"}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateSignupForm(form);
    setTouchedFields({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      userType: true,
    });
    setFieldErrors(nextErrors);

    if (hasUserFormErrors(nextErrors)) {
      setError("");
      return;
    }

    setError("");
    setIsSubmitting(true);

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

    if (!isUpdateMode) {
      payload.confirmPassword = form.confirmPassword;
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
          setFieldErrors({});
          setTouchedFields({});
        }

        onSuccess?.();
        return;
      }

      setForm({
        ...INITIAL_FORM,
        userType: getDefaultUserType(userTypeOptions),
      });
      setFieldErrors({});
      setTouchedFields({});
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
            onBlur={() => handleBlur("name")}
              placeholder="User name"
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
              placeholder={isUpdateMode ? "Phone number" : "phone"}
              className={getInputClassName("phone")}
              aria-invalid={Boolean(fieldErrors.phone)}
          />
            {fieldErrors.phone ? <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.phone}</p> : null}
          </label>
          {/* <label for="phone">Phone Number:</label>
<input 
  type="tel" 
  id="phone"
  name="phone"
  placeholder="+1234567890"
  oninput="this.value = this.value.replace(/[^0-9+]/g, '');" 
  pattern="^\+?[0-9]{10,15}$" 
  title="Please enter a valid phone number (10-15 digits, optional +)"
  required 
/> */}
        </div>

        <label className="block text-xs sm:text-sm font-medium text-gray-200">
        User Type
          {userTypeOptions && userTypeOptions.length > 0 ? (
       <select
              value={form.userType}
           onChange={(event) => handleChange("userType", event.target.value)}
            onBlur={() => handleBlur("userType")}
              className={getInputClassName("userType")}
            aria-invalid={Boolean(fieldErrors.userType)}
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
          {fieldErrors.userType ? <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.userType}</p> : null}
        </label>

       <label className="block text-xs sm:text-sm font-medium text-gray-200">
          Email Address
          <input
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="user@example.com"
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
            placeholder={isUpdateMode ? "Leave blank to keep current password" : "Minimum 6 characters"}
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
              placeholder={isUpdateMode ? "Repeat new password if changing it" : "Re-enter password"}
              className={getInputClassName("confirmPassword")}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />
            {fieldErrors.confirmPassword ? <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.confirmPassword}</p> : null}
          </label>
        </div>

        {error ? <p className="text-xs sm:text-sm text-red-400">{error}</p> : null}

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