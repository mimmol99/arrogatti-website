// src/app/cats/[id]/page.tsx

import type { Cat } from '@/types/cat';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, Info } from 'lucide-react';

// Importiamo i nuovi componenti per il Carousel
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Importiamo gli strumenti di Firebase
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Funzione per prendere i dati da Firestore (invariata)
async function getCatById(id: string): Promise<Cat | null> {
  const docRef = doc(db, 'gatti_da_adottare', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Cat;
  }
  return null;
}

// Questa è una pagina SERVER, quindi possiamo renderla async
export default async function CatDetailPage({ params }: { params: { id: string } }) {
  // Prendiamo l'id dai params
  const id = params.id;
  // Chiamiamo la funzione per ottenere i dati del gatto
  const cat = await getCatById(id);

  if (!cat) {
    return <div className="text-center py-20 text-xl text-destructive">Arrogatto non trovato!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0">
          
          {/* Colonna Immagine - ORA È UN CAROUSEL */}
          <div className="relative">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {/* Creiamo una "slide" per ogni URL nella lista fotoURLs */}
                {cat.fotoURLs?.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={url}
                        alt={`Foto ${index + 1} di ${cat.name}`}
                        fill={true}
                        style={{objectFit:"cover"}}
                        priority={index === 0} // Carica la prima immagine più velocemente
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4" />
              <CarouselNext className="absolute right-4" />
            </Carousel>
          </div>

          {/* Colonna Dettagli */}
          <div className="flex flex-col p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-4xl font-bold text-primary">{cat.name}</CardTitle>
              <CardDescription className="text-xl text-muted-foreground pt-1">{cat.breed}</CardDescription>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground mt-3 text-sm">
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /><span>{cat.location}</span></div>
                  <div className="flex items-center gap-1"><Tag className="h-4 w-4" /><span>{cat.age}</span></div>
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
                    {cat.personality.map((p) => (
                      <Badge key={p} variant="secondary">{p}</Badge>
                    ))}
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
        </div>
      </Card>
    </div>
  );
}
