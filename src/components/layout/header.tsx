// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { PawPrint, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Import per l'autenticazione
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
          <PawPrint className="h-7 w-7" />
          <span className="text-2xl font-bold text-foreground">Arrogatti</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
            {/* I TUOI MENU A TENDINA ORIGINALI */}
            <Link href="/#about"><Button variant="ghost">Chi Siamo</Button></Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost">Come Sostenerci</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link href="/#donations">Donazioni</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/#fundraising">Raccolte Fondi</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/#distance-adoption">Adozioni a Distanza</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/#gadgets"><Button variant="ghost">Arrogadget</Button></Link>
            <Link href="/browse"><Button variant="ghost">Adozioni</Button></Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost">Contatti</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link href="/#events">Iniziative/Eventi</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/#volunteer">Volontariato (Arruogatti)</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/#contact-info">Informazioni</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* LA LOGICA DINAMICA PER L'UTENTE */}
            <div className="ml-4 flex items-center gap-2">
              {user ? (
                // SE L'UTENTE È LOGGATO
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ciao, {user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/profile">Il mio profilo</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">Esci</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // SE L'UTENTE NON È LOGGATO
                <>
                  <Link href="/login"><Button variant="ghost">Accedi</Button></Link>
                  <Link href="/register"><Button variant="outline">Registrati</Button></Link>
                </>
              )}
            </div>
        </nav>
        
        <div className="md:hidden">
            <Button size="icon" variant="ghost"><PawPrint className="h-5 w-5" /></Button>
        </div>
      </div>
    </header>
  );
}
