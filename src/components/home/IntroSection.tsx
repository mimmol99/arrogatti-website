// src/components/home/IntroSection.tsx
'use client'; // Questo lo rende un componente interattivo

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // Importiamo il nostro hook!

export function IntroSection() {
  const { user } = useAuth();

  // Se l'utente è loggato (user esiste), non mostriamo nulla (restituiamo null).
  if (user) {
    return null;
  }

  // Se l'utente NON è loggato, mostriamo la sezione di invito a registrarsi.
  return (
    <section id="intro" className="w-full max-w-4xl space-y-4 px-4">
      <h2 className="text-3xl font-semibold text-primary">Trova il tuo compagno perfetto</h2>
      <p className="text-muted-foreground text-lg">
        Sfoglia i profili dei nostri Arrogatti disponibili per l'adozione in tutta Italia. Ogni gatto ha una storia unica e aspetta solo te per iniziare una nuova vita.
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <Link href="/browse"><Button size="lg" variant="outline">Sfoglia Gatti</Button></Link>
        <Link href="/register"><Button size="lg" variant="secondary">Registrati per Adottare</Button></Link>
      </div>
    </section>
  );
}
