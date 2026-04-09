"use client";
import Link from 'next/link';
import { Shield, Zap, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Visual Decor: Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
        <div className="flex justify-between items-center p-5 max-w-7xl mx-auto w-full">
          <div className="text-xl font-bold flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform" />
            <span className="tracking-tight">Next.App</span>
          </div>
          
          <div className="hidden md:flex gap-10 items-center text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Platform</a>
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-all active:scale-95">
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v2.0 is now live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.05] bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          The future of SaaS <br /> 
          <span className="text-white">management.</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          The only platform that combines deep infrastructure monitoring with user-level behavior analytics. Scale without the guesswork.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto bg-indigo-600 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95">
            Start Free Trial <ArrowRight size={20} />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-gray-300 hover:bg-white/5 transition-colors">
            View Documentation
          </button>
        </div>
      </header>

      {/* Stats Section with Glassmorphism */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
        <StatCard label="Live Connections" value="142.8k" detail="+12% today" />
        <StatCard label="Global Latency" value="18ms" detail="Avg. response" />
        <StatCard label="System Uptime" value="99.999%" detail="Enterprise SLA" />
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 pb-40">
        <FeatureItem 
          icon={<Shield size={26} />} 
          title="Bank-grade Security" 
          desc="AES-256 encryption at rest and in transit. Your data never leaves your VPC."
        />
        <FeatureItem 
          icon={<Zap size={26} />} 
          title="Instant Deploy" 
          desc="Push to production in seconds with our optimized CI/CD edge network."
        />
        <FeatureItem 
          icon={<BarChart3 size={26} />} 
          title="AI Forensics" 
          desc="Predict traffic spikes before they happen with our neural engine."
        />
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Next.App Inc. Built with Next.js 16 and Turbopack.</p>
      </footer>
    </div>
  );
}

/* Helper Components to keep the code clean */

function StatCard({ label, value, detail }: { label: string, value: string, detail: string }) {
  return (
    <div className="group bg-gradient-to-b from-white/10 to-transparent p-[1px] rounded-3xl transition-transform hover:-translate-y-1">
      <div className="bg-[#0a0a0f] p-8 rounded-[23px] h-full">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">{label}</p>
        <p className="text-4xl font-bold mb-2 tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
          <CheckCircle2 size={12} /> {detail}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-start text-left group">
      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-[15px]">{desc}</p>
    </div>
  );
}