// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/ui/navbar"; // Pastikan path ini benar
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "  AuraFlow",
  description: "Track your wealth with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Pastikan html tag punya suppressHydrationWarning dan class "" (kosong)
    // agar next-themes bisa menambahkan 'dark' atau menghapusnya
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* 
          FIX: 
          - attribute="class" : untuk mengenali class 'dark' di tag html
          - defaultTheme="dark" : Mulai dengan dark mode
          - enableSystem : Gunakan setting OS jika ada
          - disableTransitionOnChange : Hilangkan animasi transisi tema yg kadang glitch
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster
            position="bottom-right"
            theme="system"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}