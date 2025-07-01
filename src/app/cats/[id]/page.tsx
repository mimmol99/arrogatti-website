// src/app/cats/[id]/page.tsx (versione FINALE e COMPLETA)

import type { Cat } from '@/types/cat';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Aggiunto CardFooter
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, Info } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Import degli strumenti di Firebase
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore'; // Aggiunto Timestamp

// ===== MODIFICA 1: Importiamo il nostro nuovo pulsante per la chat =====
import { StartChatButton } from '@/components/cats/StartChatButton'; 

// ===== MODIFICA 2: Aggiungiamo la funzione per calcolare l'età =====
function calcolaEta(nascita: Timestamp): string {
  if (!nascita) return "Età non specificata";
  const dataNascita = nascita.toDate();
  const oggi = new Date();
  let etaAnni = oggi.getFullYear() - dataNascita.getFullYear();
  let etaMesi = oggi.getMonth() - dataNascita.getMonth();
  if (etaMesi < 0 || (etaMesi === 0 && oggi.getDate() < dataNascita.getDate())) {
    etaAnni--;
    etaMesi += 12;
  }
  if (etaAnni > 0) return `${etaAnni} ${etaAnni === 1 ? 'anno' : 'anni'}`;
  if (etaMesi > 0) return `${etaMesi} ${etaMesi === 1 ? 'mese' : 'mesi'}`;
  return "Meno di un mese";
}


// Funzione per prendere i dati da Firestore (ora si aspetta i campi in inglese)
async function getCatById(id: string): Promise<Cat | null> {
  const docRef = doc(db, 'gatti_da_adottare', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Cat;
  }
  return null;
}

export default async function CatDetailPage({ params: { id } }: { params: { id: string } }) {
  const cat = await getCatById(id);

  if (!cat) {
    return <div className="text-center py-20 text-xl text-destructive">Arrogatto non trovato!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0">
          
          {/* Colonna Immagine - Carousel */}
          <div className="relative">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {cat.fotoURLs?.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] relative">
                      <Image src={url} alt={`Foto ${index + 1} di ${cat.name}`} fill={true} style={{objectFit:"cover"}} priority={index === 0} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4" />
              <CarouselNext className="absolute right-4" />
            </Carousel>
          </div>

          {/* Colonna Dettagli */}
          <div className="flex flex-col">
            <div className="p-6 flex-grow flex flex-col">
              <CardHeader className="p-0">
                <CardTitle className="text-4xl font-bold text-primary">{cat.name}</CardTitle>
                <CardDescription className="text-xl text-muted-foreground pt-1">{cat.breed}</CardDescription>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground mt-3 text-sm">
                    <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /><span>{cat.location}</span></div>
                    {/* ===== MODIFICA 3: Usiamo la funzione per calcolare l'età ===== */}
                    {cat.nascita && <div className="flex items-center gap-1"><Tag className="h-4 w-4" /><span>{calcolaEta(cat.nascita)}</span></div>}
                </div>
              </CardHeader>

              <CardContent className="p-0 pt-6 flex-grow space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">La sua storia</h3>
                  <p className="text-base text-foreground/90 leading-relaxed">{cat.description}</p>
                </div>

                {cat.personality && cat.personality.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Personalità</h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.personality.map((p) => (<Badge key={p} variant="secondary">{p}</Badge>))}
                    </div>
                  </div>
                )}
                 {cat.needs && cat.needs.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Esigenze Particolari</h3>
                    <ul className="space-y-1">
                       {cat.needs.map((need) => (
                         <li key={need} className="flex items-start gap-2">
                           <Info className="h-4 w-4 mt-1 text-primary flex-shrink-0"/>
                           <span>{need}</span>
                         </li>
                       ))}
                    </ul>
                  </div>
                 )}
              </CardContent>
            </div>

            {/* ===== MODIFICA 4: Aggiungiamo il CardFooter con il nostro pulsante per la chat ===== */}
            <CardFooter className="p-6 pt-0 mt-auto">
               <StartChatButton catId={cat.id} catName={cat.name} />
            </CardFooter>

          </div>
        </div>
      </Card>
    </div>
  );
}
