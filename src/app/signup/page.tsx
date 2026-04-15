import UserSignupForm from "@/features/auth/components/UserSignupForm";

export default function SignupPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <UserSignupForm />
      </div>
    </main>
  );
}
