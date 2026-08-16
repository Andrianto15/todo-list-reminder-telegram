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
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-slate-900 text-[#404040] dark:text-slate-100">
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}

