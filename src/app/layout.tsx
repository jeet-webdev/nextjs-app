// // app/layout.tsx
// import './globals.css'; // Ensure this path is correct!
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-[#0a0a0f] text-white`}>
//         {children}
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/shared/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Multi-restaurant marketplace platform",
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