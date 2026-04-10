import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-5xl font-bold text-white mb-6">
            Welcome to the Command Center.
          </h2>
          <p className="text-indigo-100 text-lg">
            Manage your entire ecosystem from a single, unified interface.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
}//