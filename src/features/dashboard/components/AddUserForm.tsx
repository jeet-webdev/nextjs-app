"use client";
import { type FormState, type UserType } from "@/features/users/types";

type AddUserFormProps = {
  form: FormState;
  isSubmitting: boolean;
  error: string;
  userTypeOptions: UserType[];
  title: string;
  submitLabel: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function AddUserForm({
  form,
  isSubmitting,
  error,
  userTypeOptions,
  title,
  submitLabel,
  onSubmit,
  onChange,
}: AddUserFormProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 mb-8">
      <h2 className="text-base sm:text-lg font-semibold mb-4">{title}</h2>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        onSubmit={onSubmit}
      >
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="email"
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          type="password"
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <input
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
        <select
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          value={form.userType}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              userType: e.target.value as UserType,
            }))
          }
        >
          {userTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option.toLowerCase()}
            </option>
          ))}
        </select>
        {/* //j */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : submitLabel}
        </button>
      </form>
      {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}
    </div>
  );
}
