// src/app/admin/page.tsx (versione FINALE e COMPLETA)
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import type { Cat } from '@/types/cat';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCats = useCallback(async () => {
    setLoading(true);
    try {
      const gattiCollection = collection(db, 'gatti_da_adottare');
      const q = query(gattiCollection, orderBy('createdAt', 'desc'));
      const gattiSnapshot = await getDocs(q);
      const gattiList = gattiSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Cat[];
      setCats(gattiList);
    } catch (error) {
      console.error("Errore nel caricamento gatti:", error);
      toast({ title: "Errore", description: "Impossibile caricare la lista.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user?.role === 'caretaker') {
      fetchCats();
    }
  }, [user, fetchCats]);

  const handleArchive = async (catId: string, catName: string) => {
    if (window.confirm(`Sei sicuro di voler archiviare ${catName}? Il gatto verrà segnato come "adottato".`)) {
      const catDocRef = doc(db, 'gatti_da_adottare', catId);
      await updateDoc(catDocRef, { adottato: true });
      toast({ title: "Gatto Archiviato!", description: `${catName} è stato segnato come adottato.` });
      fetchCats();
    }
  };

  const handleReInstate = async (catId: string, catName: string) => {
    if (window.confirm(`Sei sicuro di voler reinserire ${catName} nella lista degli adottabili?`)) {
      const catDocRef = doc(db, 'gatti_da_adottare', catId);
      await updateDoc(catDocRef, { adottato: false });
      toast({ title: "Gatto Reinserito!", description: `${catName} è di nuovo disponibile.` });
      fetchCats();
    }
  };
  
  const handlePermanentDelete = async (catId: string, catName: string) => {
    if (window.confirm(`ATTENZIONE! Stai per eliminare PERMANENTEMENTE ${catName}. L'azione è IRREVERSIBILE. Sei sicuro?`)) {
      try {
        await deleteDoc(doc(db, 'gatti_da_adottare', catId));
        toast({ title: "Eliminazione Riuscita!", description: `${catName} è stato rimosso per sempre.` });
        fetchCats();
      } catch (error) {
        console.error("Errore eliminazione:", error);
        toast({ title: "Errore", variant: "destructive" });
      }
    }
  };
  
  if (user?.role !== 'caretaker') return <div className="text-center py-20"><h1 className="text-2xl font-bold">Accesso Negato</h1></div>;
  if (loading) return <p>Caricamento gatti in corso...</p>;

  return (
    <div>
 <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Gestione Gatti</h1>
    <div className="space-x-2"> {/* Aggiunto un contenitore per allineare i pulsanti */}
        <Link href="/admin/add-cat"><Button>+ Aggiungi Gatto</Button></Link>
        <Link href="/admin/chats"><Button variant="outline">Visualizza le Chat</Button></Link>
    </div>
  </div>
      
      {cats.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">Nessun gatto trovato. Inizia aggiungendone uno!</p>
      ) : (
        <div className="space-y-4">
          {cats.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
              <div>
                {/* ===== MODIFICA QUI: usiamo name, breed, location ===== */}
                <p className="font-bold text-lg">{cat.name} <span className={`text-sm font-normal ${cat.adottato ? 'text-green-600' : 'text-blue-600'}`}>({cat.adottato ? 'Adottato/Archiviato' : 'Disponibile'})</span></p>
                <p className="text-sm text-muted-foreground">{cat.breed} - {cat.location}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {cat.adottato ? (
                  <Button variant="secondary" size="sm" onClick={() => handleReInstate(cat.id, cat.name)}>Reinserisci</Button>
                ) : (
                  <>
                    <Link href={`/admin/edit-cat/${cat.id}`}><Button variant="outline" size="sm">Modifica</Button></Link>
                    <Button variant="destructive" size="sm" onClick={() => handleArchive(cat.id, cat.name)}>Archivia</Button>
                  </>
                )}
                <Button variant="link" className="text-xs text-red-700 hover:text-red-500" onClick={() => handlePermanentDelete(cat.id, cat.name)}>
                  Elimina Definitivamente
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
