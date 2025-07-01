// src/app/browse/page.tsx (versione finale e corretta)
'use server'; // Questa pagina ora è un Server Component, più veloce ed efficiente

import type { Cat } from '@/types/cat';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CatCard } from '@/components/cats/cat-card'; // Importiamo il nostro componente riutilizzabile

// Funzione per caricare tutti i gatti disponibili dal database
async function getGattiDisponibili(): Promise<Cat[]> {
  try {
    const gattiCollection = collection(db, 'gatti_da_adottare');
    // La query prende i gatti non adottati e li ordina per data di creazione
    const q = query(
      gattiCollection, 
      where('adottato', '==', false), 
      orderBy('createdAt', 'desc')
    );
    const gattiSnapshot = await getDocs(q);
    
    // Mappiamo i dati nel nostro tipo 'Cat'
    return gattiSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Cat[];
  } catch (error) {
    console.error("Errore nel caricare i gatti:", error);
    return []; // Restituisce una lista vuota in caso di errore
  }
}

export default async function BrowsePage() {
  // Chiamiamo la funzione per ottenere i dati
  const cats = await getGattiDisponibili();
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        I nostri Arrogatti in cerca di casa
      </h1>
      
      {cats.length === 0 ? (
        // Messaggio mostrato se non ci sono gatti disponibili
        <p className="text-center text-muted-foreground py-10">Al momento non ci sono gatti disponibili per l'adozione. Riprova più tardi!</p>
      ) : (
        // Griglia che mostra le schede dei gatti
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Usiamo il componente riutilizzabile CatCard per ogni gatto */}
          {cats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
