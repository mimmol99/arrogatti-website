// src/app/layout.tsx

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header'; // Lasciamo il tuo import corretto con la 'h' minuscola
import { Toaster } from "@/components/ui/toaster";

// ===== MODIFICA 1: Importiamo il nostro AuthProvider =====
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Arrogatti',
  description: 'Adotta un gatto o sostieni la nostra causa. Arrogatti - adozioni feline consapevoli.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        
        {/* ===== MODIFICA 2: Avvolgiamo tutto il contenuto nell'AuthProvider ===== */}
        <AuthProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
        {/* ==================================================================== */}

      </body>
    </html>
  );
}
