// src/app/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CatCard } from '@/components/cats/cat-card';
import type { Cat } from '@/types/cat';

// Funzioni e import per caricare i dati da Firebase (la parte dinamica)
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

async function getFeaturedGatti() {
  const gattiCollection = collection(db, 'gatti_da_adottare');
  const q = query(gattiCollection, where('adottato', '==', false), limit(3));
  const gattiSnapshot = await getDocs(q);
  const gattiList = gattiSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Cat[];
  return gattiList;
}

export default async function Home() {
  const featuredCats = await getFeaturedGatti(); // Prendiamo i dati veri

  return (
    <div className="flex flex-col items-center text-center space-y-12">
      {/* Hero Section */}
      <div className="relative w-full max-w-5xl h-72 md:h-96 rounded-lg overflow-hidden shadow-xl mt-4">
        <Image
          src="https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/3ee98be1-5d73-4f3b-9a76-c2405960861b/razze%20gatti.jpeg?w=1200&h=500&auto=format"
          alt="Gruppo di gatti di varie razze Arrogatti"
          fill={true}
          style={{objectFit:"cover"}}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-center justify-end p-6 md:p-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">Benvenuti su Arrogatti</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow-md font-medium">
            La piattaforma no-profit per l'adozione responsabile di gatti. Uniamo cuori felini e famiglie amorevoli.
          </p>
          <div className="mt-6">
            <Link href="/browse">
              <Button size="lg" variant="default">Trova il tuo Arrogatto</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
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

      {/* Featured Cats Section (ora dinamica) */}
      <section id="featured-cats" className="w-full max-w-6xl py-12 bg-secondary/30 rounded-lg shadow-inner px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">Arrogatti in cerca di casa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/browse"><Button variant="primary" size="lg">Vedi tutti gli Arrogatti</Button></Link>
        </div>
      </section>
      
      {/* ===== INIZIO SEZIONI MANCANTI RECUPERATE ===== */}

      {/* Chi Siamo */}
      <section id="about" className="w-full max-w-4xl py-10 px-4 text-left border-t border-border pt-12">
          <h2 className="text-3xl font-semibold mb-4 text-primary">Chi Siamo</h2>
          <p className="text-muted-foreground text-lg">
              Arrogatti è un'organizzazione <strong className="text-foreground">no-profit</strong> dedicata al benessere e all'adozione consapevole dei gatti meno fortunati in Italia. Lavoriamo instancabilmente per salvare, curare e trovare case amorevoli per gatti abbandonati, randagi o in difficoltà, operando grazie al supporto di volontari e donazioni.
              <br/><br/>
              La nostra missione è dare una seconda possibilità a ogni micio e promuovere una cultura di rispetto e amore per gli animali. Crediamo che ogni gatto meriti una vita felice e sicura. Collaboriamo con volontari appassionati ("Arruogatti"), rifugi partner e veterinari per garantire le migliori cure possibili ai nostri protetti prima dell'adozione.
          </p>
      </section>

      {/* Come Sostenerci */}
      <section id="support-us" className="w-full max-w-4xl py-10 px-4 text-left border-t border-border pt-12 bg-secondary/30 rounded-lg shadow-inner">
          <h2 className="text-3xl font-semibold mb-6 text-center text-primary">Come Sostenerci</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div id="donations" className="text-center p-6 bg-card rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Donazioni</h3>
                  <p className="text-muted-foreground mb-4">Ogni contributo, piccolo o grande, fa la differenza. Aiutaci a coprire spese veterinarie, cibo e cure.</p>
                  <Button variant="outline">Dona Ora</Button>
              </div>
              <div id="fundraising" className="text-center p-6 bg-card rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Raccolte Fondi</h3>
                  <p className="text-muted-foreground mb-4">Partecipa o organizza eventi di raccolta fondi. Scopri le iniziative in corso.</p>
                  <Button variant="outline">Scopri le Raccolte</Button>
              </div>
              <div id="distance-adoption" className="text-center p-6 bg-card rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Adozioni a Distanza</h3>
                  <p className="text-muted-foreground mb-4">Non puoi adottare? Sostieni un Arrogatto a distanza! Riceverai aggiornamenti e foto.</p>
                  <Button variant="outline">Adotta a Distanza</Button>
              </div>
          </div>
      </section>

      {/* Arrogadget */}
      <section id="gadgets" className="w-full max-w-4xl py-10 px-4 text-left border-t border-border pt-12">
          <h2 className="text-3xl font-semibold mb-4 text-primary">Arrogadget</h2>
          <p className="text-muted-foreground text-lg">
              Mostra il tuo supporto per Arrogatti con i nostri gadget esclusivi! Il ricavato delle vendite è interamente devoluto a sostegno dei nostri mici.
          </p>
           <div className="mt-6 text-center">
             <Button variant="primary">Visita lo Shop</Button>
           </div>
      </section>

      {/* Contatti */}
      <section id="contact" className="w-full max-w-4xl py-10 px-4 text-left border-t border-border pt-12 bg-secondary/30 rounded-lg shadow-inner">
           <h2 className="text-3xl font-semibold mb-6 text-center text-primary">Contatti e Partecipazione</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div id="events" className="p-6 bg-card rounded-lg shadow-md">
                   <h3 className="text-xl font-semibold mb-2">Iniziative ed Eventi</h3>
                   <p className="text-muted-foreground mb-4">Scopri i prossimi eventi, mercatini solidali e giornate di sensibilizzazione.</p>
                    <Button variant="outline">Vedi Calendario Eventi</Button>
               </div>
               <div id="volunteer" className="p-6 bg-card rounded-lg shadow-md">
                   <h3 className="text-xl font-semibold mb-2">Volontariato (Arruogatti!)</h3>
                   <p className="text-muted-foreground mb-4">Diventa un Arruogatto! Cerchiamo volontari per stalli, trasporti e tanto altro.</p>
                   <Button variant="outline">Diventa Volontario</Button>
               </div>
           </div>
      </section>
      
      {/* ===== FINE SEZIONI MANCANTI RECUPERATE ===== */}

    </div>
  );
}

export const revalidate = 60;
