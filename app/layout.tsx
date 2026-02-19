import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IQ Assessment",
  description: "A time-limited IQ-style assessment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
