"use client";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Invalid credentials.");
        return;
      }

      const data = (await response.json()) as { redirectPath?: string };
      window.location.assign(data.redirectPath ?? "/dashboard");
    } catch {
      setError("Unable to login right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Sign In</h1>
        <p className="mt-2 text-gray-400">Enter your email and password</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
        >
          {isLoading ? "Signing in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
