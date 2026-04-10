type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

export default function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-400 hover:bg-white/5"
      }`}
    >
      {icon} <span>{label}</span>
    </div>
  );
}
//