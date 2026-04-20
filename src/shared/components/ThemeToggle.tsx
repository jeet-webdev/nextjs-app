"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import SunnyIcon from '@mui/icons-material/Sunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
type Theme = "dark" | "light";

const STORAGE_KEY = "site-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  });

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="fixed right-4 bottom-4 z-[100] rounded-full border border-white/25 bg-black/40 p-2.5 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-black/60"
    >
      {theme === "dark"? <SunnyIcon style={{ color: "#fbbf24" }} /> : <NightlightIcon /> }
                  {/* {theme === "dark" ? <Sun size={18} /> : <Moon size={18} /> } */}
    </button>
  );
}
