type FeatureItemProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

export default function FeatureItem({ icon, title, desc }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-start text-left group">
      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed text-[15px]">{desc}</p>
    </div>
  );
}
