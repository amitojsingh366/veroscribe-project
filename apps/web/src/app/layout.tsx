import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeroScribe Patient Booking",
  description: "Single-clinic patient booking and physician admin prototype"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
