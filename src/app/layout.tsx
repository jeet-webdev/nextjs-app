
import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/shared/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Multi-restaurant marketplace platform",
  icons: {
    icon: [
      { url: "/icons8-food-bubbles-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons8-food-bubbles-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons8-food-bubbles-96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/icons8-food-bubbles-32.png",
    apple: "/icons8-food-bubbles-96.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ThemeToggle />
        <div id="theme-root">{children}</div>
      </body>
    </html>
  );
}