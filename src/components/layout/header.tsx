// src/components/layout/header.tsx (versione FINALE con tutti i menu)
'use client';

import Link from 'next/link';
import { PawPrint, User, ShieldCheck, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

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
        <Link href="/" className="flex items-center gap-2 text-primary">
          <PawPrint className="h-7 w-7" />
          <span className="text-2xl font-bold text-foreground">Arrogatti</span>
        </Link>
        
        {/* ===== NAVIGAZIONE DESKTOP (ORA COMPLETA) ===== */}
        <nav className="hidden md:flex items-center gap-1">
            <Link href="/#about"><Button variant="ghost">Chi Siamo</Button></Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost">Come Sostenerci</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link href="/#donations">Donazioni</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/#fundraising">Raccolte Fondi</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/#gadgets"><Button variant="ghost">Arrogadget</Button></Link>
            <Link href="/browse"><Button variant="ghost">Adozioni</Button></Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost">Contatti</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link href="/#events">Iniziative/Eventi</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/#volunteer">Volontariato</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/#contact-info">Informazioni</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logica dinamica utente (invariata) */}
            <div className="ml-4 flex items-center gap-2">
              {user ? (
                <>
                  {user.role === 'caretaker' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="secondary" className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /><span>Admin</span></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href="/admin">Cruscotto Gatti</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/admin/chats">Gestione Chat</Link></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline" size="icon" className="rounded-full"><User className="h-5 w-5" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ciao, {user.name || user.email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/profile">Il mio profilo</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/chats">Le mie chat</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">Esci</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/login"><Button variant="ghost">Accedi</Button></Link>
                  <Link href="/register"><Button variant="outline">Registrati</Button></Link>
                </>
              )}
            </div>
        </nav>
        
        {/* ===== MENU MOBILE (invariato) ===== */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Apri menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-3 pt-6">
                <SheetClose asChild><Link href="/#about" className="text-lg">Chi Siamo</Link></SheetClose>
                <SheetClose asChild><Link href="/browse" className="text-lg">Adozioni</Link></SheetClose>
                <SheetClose asChild><Link href="/#gadgets" className="text-lg">Arrogadget</Link></SheetClose>
                <SheetClose asChild><Link href="/#donations" className="text-lg">Donazioni</Link></SheetClose>
                <SheetClose asChild><Link href="/#contact-info" className="text-lg">Contatti</Link></SheetClose>
                
                <hr className="my-4"/>

                {user ? (
                  <>
                    {user.role === 'caretaker' && (
                      <SheetClose asChild><Link href="/admin" className="text-lg font-semibold text-primary">Pannello Admin</Link></SheetClose>
                    )}
                    <SheetClose asChild><Link href="/profile" className="text-lg">Il mio profilo</Link></SheetClose>
                    <SheetClose asChild><Link href="/chats" className="text-lg">Le mie chat</Link></SheetClose>
                    <Button onClick={handleLogout} variant="ghost" className="justify-start p-0 text-lg text-red-600">Esci</Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild><Link href="/login" className="text-lg">Accedi</Link></SheetClose>
                    <SheetClose asChild><Link href="/register" className="text-lg">Registrati</Link></SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
