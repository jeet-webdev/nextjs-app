// app/layout.tsx
import './globals.css'; // Ensure this path is correct!
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0f] text-white`}>
        {children}
      </body>
    </html>
  );
}