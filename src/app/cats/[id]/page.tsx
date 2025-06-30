import type { Cat } from '@/types/cat';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { MapPin, Tag, Heart, MessageSquare, Info } from 'lucide-react';

// Funzione per calcolare l'età
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

// Interfaccia Cat (già corretta)
interface Cat {
  id: string;
  nome: string;
  razza: string;
  nascita: Timestamp;
  descrizione: string;
  sesso?: string;
  luogo: string;
  fotoURL: string;
  personalità: string;
  esigenze: string;
}

// Funzione per prendere i dati da Firestore (invariata)
async function getCatById(id: string): Promise<Cat | null> {
  const docRef = doc(db, 'gatti_da_adottare', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Cat;
  } else {
    return null;
  }
}

export default async function CatDetailPage({ params: { id } }: { params: { id: string } }) {
  const cat = await getCatById(id);

  if (!cat) {
    return <div className="text-center py-20 text-xl text-destructive">Arrogatto non trovato!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-xl border border-primary/10">
        <div className="grid md:grid-cols-5 gap-0">
          {/* Colonna Immagine */}
          <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-full min-h-[300px]">
            {cat.fotoURL && (
              <Image src={cat.fotoURL} alt={`Foto di ${cat.nome}`} fill={true} style={{objectFit:"cover"}} priority />
            )}
          </div>

          {/* Colonna Dettagli */}
          <div className="md:col-span-3 flex flex-col">
            <CardHeader className="p-6 pb-4">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-4xl font-bold text-primary">{cat.nome}</CardTitle>
                <Button size="icon" variant="ghost"><Heart className="h-6 w-6" /></Button>
              </div>
              
              {cat.razza && <CardDescription className="text-xl text-muted-foreground pt-1">{cat.razza}</CardDescription>}

              {/* ===== NUOVA MODIFICA ===== */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground mt-3 text-sm">
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /><span>{cat.luogo}</span></div>
                <div className="flex items-center gap-1"><Tag className="h-4 w-4" /><span>{calcolaEta(cat.nascita)}</span></div>
                {/* Aggiunto il blocco per il sesso */}
                {cat.sesso && <div className="flex items-center gap-1"><span>·</span><span>{cat.sesso}</span></div>}
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-2 flex-grow space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">La sua storia</h3>
                <p className="text-base text-foreground/90 leading-relaxed">{cat.descrizione}</p>
              </div>

              {cat.personalità && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">Personalità</h3>
                  <p className="text-base text-foreground/90">{cat.personalità}</p>
                </div>
              )}

              {cat.esigenze && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">Esigenze Particolari</h3>
                  <p className="text-base text-foreground/90">{cat.esigenze}</p>
                </div>
              )}

              <div className="pt-6 border-t border-border">
                <Button size="lg" className="w-full text-lg">
                  <MessageSquare className="mr-2 h-5 w-5" /> Contatta il Referente per {cat.nome}
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

export const revalidate = 60;
