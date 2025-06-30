// src/components/cats/cat-card.tsx

import type { Cat } from '@/types/cat';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface CatCardProps {
  cat: Cat;
}

export function CatCard({ cat }: CatCardProps) {
  // Prendiamo la prima foto dalla lista, se esiste
  const primaryImage = cat.fotoURLs && cat.fotoURLs.length > 0 ? cat.fotoURLs[0] : null;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      <CardHeader className="p-0 relative">
        <div className="aspect-[4/3] w-full relative">
          {/* Mostriamo l'immagine solo se ne abbiamo una */}
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={`Foto di ${cat.name}`}
              fill={true}
              style={{objectFit:"cover"}}
              className="transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            // Placeholder se non ci sono immagini
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <p className="text-muted-foreground">Foto non disponibile</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2 font-semibold text-primary">{cat.name}</CardTitle>
        <div className="text-sm text-muted-foreground mb-3 space-y-1">
          <p>{cat.breed} - {cat.age}</p>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{cat.location}</span>
          </div>
        </div>
        <p className="text-sm text-foreground/80 mb-4 line-clamp-3">{cat.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Link href={`/cats/${cat.id}`} className="w-full">
          <Button variant="outline" className="w-full">Scopri {cat.name}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
