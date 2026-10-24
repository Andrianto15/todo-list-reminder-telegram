import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo Reminder - Pengingat Tugas via Telegram",
  description: "Kelola tugas harian Anda dan dapatkan pengingat otomatis di Telegram tepat waktu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased font-['Public_Sans',system-ui,sans-serif]">
      <head>
        {/* Fonts: Public Sans, JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Public+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#f8fafc] dark:bg-[#090d16] text-[#0f172a] dark:text-[#f8fafc]">
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
