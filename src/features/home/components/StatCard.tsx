import { CheckCircle2 } from "lucide-react";

type HomeStatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export default function StatCard({ label, value, detail }: HomeStatCardProps) {
  return (
    <div className="group bg-gradient-to-b from-white/10 to-transparent p-[1px] rounded-3xl transition-transform hover:-translate-y-1">
      <div className="bg-[#0a0a0f] p-8 rounded-[23px] h-full">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">
          {label}
        </p>
        <p className="text-4xl font-bold mb-2 tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
          <CheckCircle2 size={12} /> {detail}
        </div>
      </div>
    </div>
  );
}//
