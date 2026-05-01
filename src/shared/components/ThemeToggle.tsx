"use client";

import { useEffect, useState } from "react";
import SunnyIcon from '@mui/icons-material/Sunny';
import NightlightIcon from '@mui/icons-material/Nightlight';

type Theme = "dark" | "light";
const STORAGE_KEY = "site-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark"); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const savedTheme = window.localStorage.getItem(STORAGE_KEY) as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);
  

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  if (!mounted) {
    return (
      <div className="fixed right-4 bottom-4 z-[100] p-2.5 w-[42px] h-[42px]" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="fixed right-4 bottom-4 z-[100] rounded-full border border-white/25 bg-black/40 p-2.5 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-black/60"
    >
      {theme === "dark" ? <SunnyIcon style={{ color: "#fbbf24" }} /> : <NightlightIcon />}
    </button>
  );
}
