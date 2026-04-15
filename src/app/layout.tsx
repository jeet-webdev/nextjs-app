
import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/shared/components/ThemeToggle";
// import ChatLauncher from "@/shared/components/ChatLauncher";

export const metadata: Metadata = {
  title: "Multi-restaurant marketplace platform",
  icons: {
    icon: [
      { url: "/icons8-food-bubbles-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons8-food-bubbles-96.png", sizes: "192x192", type: "image/png" },
      { url: "/icons8-food-bubbles-96.png", sizes: "any", type: "image/png" },
    ],
    shortcut: "/icons8-food-bubbles-96.png",
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
        {/* <ChatLauncher /> */}
        <div id="theme-root">{children}</div>
      </body>
    </html>
  );
}