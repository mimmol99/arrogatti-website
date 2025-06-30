// src/components/cats/cat-card.tsx

import type { Cat } from '@/types/cat';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Tag } from 'lucide-react';
import { Timestamp } from 'firebase/firestore'; // MODIFICA: Importiamo Timestamp per la funzione calcolaEta

// MODIFICA: Aggiungiamo la stessa funzione helper per calcolare l'età
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
  return `${etaMesi} ${etaMesi === 1 ? 'mese' : 'mesi'}`;
}


interface CatCardProps {
  cat: Cat;
}

export function CatCard({ cat }: CatCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group bg-card border border-border hover:border-primary/30">
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="aspect-[4/3] w-full relative">
          
          {/* MODIFICA: Controlliamo e usiamo 'fotoURL' invece di 'imageUrl' */}
          {cat.fotoURL && (
            <Image
              src={cat.fotoURL} 
              alt={`Foto di ${cat.nome}, un Arrogatto`}
              fill={true}
              style={{objectFit:"cover"}}
              className="transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-xl mb-2 font-semibold text-primary">{cat.nome}</CardTitle>
        <div className="text-sm text-muted-foreground mb-3 space-y-1">
          
          {/* MODIFICA: Usiamo 'razza' e la funzione 'calcolaEta' */}
          <p>{cat.razza} - {cat.nascita ? calcolaEta(cat.nascita) : ''}</p>
          
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            {/* MODIFICA: Usiamo 'luogo' */}
            <span className="truncate">{cat.luogo}</span>
          </div>
        </div>
        
        {/* MODIFICA: Usiamo 'descrizione' */}
        <p className="text-sm text-foreground/80 mb-4 line-clamp-3 flex-grow">{cat.descrizione}</p>

        {/* MODIFICA: Mostriamo 'personalità' come testo, non come lista di badge */}
        <div className="mt-auto pt-2">
            {cat.personalità && <Badge variant="secondary" className="cursor-default">{cat.personalità}</Badge>}
        </div>

      </CardContent>
      <CardFooter className="p-4 pt-0 mt-2">
        <Link href={`/cats/${cat.id}`} className="w-full">
          <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
            Scopri {cat.name}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
