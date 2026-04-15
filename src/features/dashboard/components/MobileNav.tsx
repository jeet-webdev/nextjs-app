"use client";

import { X } from "lucide-react";
import { useState } from "react";
import NavItem from "./NavItem";
import { LayoutDashboard, Store, Users } from "lucide-react";

type DashboardSection = "overview" | "users" | "restaurants";

type MobileNavProps = {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  isOpen?: boolean;
  onToggle?: () => void;
};

export default function MobileNav({ activeSection, onSectionChange, isOpen: externalIsOpen, onToggle }: MobileNavProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleClose = () => {
    if (externalIsOpen !== undefined && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleSectionChange = (section: DashboardSection) => {
    onSectionChange(section);
    handleClose();
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#020205] border-r border-white/5 p-6 space-y-8 z-50 lg:hidden transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-500 px-2">RestroAdminOS</div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/5 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={activeSection === "overview"}
            onClick={() => handleSectionChange("overview")}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Users"
            active={activeSection === "users"}
            onClick={() => handleSectionChange("users")}
          />
          <NavItem
            icon={<Store size={20} />}
            label="Restaurants"
            active={activeSection === "restaurants"}
            onClick={() => handleSectionChange("restaurants")}
          />
        </nav>
      </aside>
    </>
  );
}
