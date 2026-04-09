"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@example.com' && password === 'admin123') {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials! Try admin@example.com / admin123');
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-5xl font-bold text-white mb-6">Welcome to the Command Center.</h2>
          <p className="text-indigo-100 text-lg">Manage your entire ecosystem from a single, unified interface.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Sign In</h1>
            <p className="text-gray-400 mt-2">Enter your admin credentials</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <input 
                type="email" 
                className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                placeholder="admin@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input 
                type="password" 
                className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}