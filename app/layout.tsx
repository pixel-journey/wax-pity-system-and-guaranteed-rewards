import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Pity rates — educational example',
  description: 'Soft pity, a hard guarantee, and a seeded simulation. No Atomic drop is opened.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
