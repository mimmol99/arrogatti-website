// src/app/admin/edit-cat/[id]/page.tsx (versione con eliminazione foto corretta)
'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Cat } from '@/types/cat';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function EditCatPage({ params: { id } }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [catData, setCatData] = useState<any>({});
  const [newFotos, setNewFotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchCatData = async () => {
      const catDocRef = doc(db, 'gatti_da_adottare', id);
      const docSnap = await getDoc(catDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Cat;
        // Prepariamo i dati per il form
        const birthDate = (data.nascita as Timestamp).toDate().toISOString().split('T')[0];
        setCatData({
          ...data,
          nascita: birthDate,
          // Convertiamo gli array in stringhe con virgole per i campi di testo
          personality: Array.isArray(data.personality) ? data.personality.join(', ') : '',
          needs: Array.isArray(data.needs) ? data.needs.join(', ') : '',
        });
      } else {
        router.push('/admin');
      }
      setLoading(false);
    };
    if (id) fetchCatData();
  }, [id, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCatData({ ...catData, [e.target.id]: e.target.value });
  };

  // ===== FUNZIONE DI ELIMINAZIONE FOTO CORRETTA =====
  const handleDeletePhoto = async (photoURL: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa foto? L'azione è irreversibile.")) return;
    
    try {
      // 1. Estrarre il percorso del file dall'URL completo
      // es. da https://.../o/cats%2Ffile.jpg?alt=... a cats/file.jpg
      const filePath = decodeURIComponent(photoURL.split('/o/')[1].split('?')[0]);
      const photoRef = ref(storage, filePath);

      console.log("Tentativo di eliminare il file a questo percorso:", filePath);

      // 2. Cancellare il file da Firebase Storage
      await deleteObject(photoRef);
      
      // 3. Rimuovere l'URL dal documento in Firestore
      const catDocRef = doc(db, 'gatti_da_adottare', id);
      await updateDoc(catDocRef, {
        fotoURLs: arrayRemove(photoURL)
      });

      // 4. Aggiornare l'interfaccia utente all'istante
      setCatData((prev: any) => ({
        ...prev,
        fotoURLs: prev.fotoURLs?.filter((url: string) => url !== photoURL)
      }));

      toast({ title: "Foto eliminata con successo!" });

    } catch (error) {
      console.error("Errore eliminazione foto:", error);
      toast({ title: "Errore", description: "Impossibile eliminare la foto.", variant: "destructive" });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let currentFotoURLs = catData.fotoURLs || [];

    try {
      if (newFotos && newFotos.length > 0) {
        const uploadPromises = Array.from(newFotos).map(file => {
          const newFilePath = `cats/${Date.now()}-${file.name}`;
          const newStorageRef = ref(storage, newFilePath);
          return uploadBytes(newStorageRef, file).then(() => getDownloadURL(newStorageRef));
        });
        const newImageUrls = await Promise.all(uploadPromises);
        currentFotoURLs = [...currentFotoURLs, ...newImageUrls];
      }
      
      const catDocRef = doc(db, 'gatti_da_adottare', id);
      
      // Prepariamo i dati per il salvataggio
      const dataToUpdate = {
        ...catData,
        fotoURLs: currentFotoURLs,
        nascita: Timestamp.fromDate(new Date(catData.nascita)),
        // Riconvertiamo le stringhe con virgole in array
        personality: catData.personality.split(',').map((p:string) => p.trim()).filter(Boolean),
        needs: catData.needs.split(',').map((n:string) => n.trim()).filter(Boolean),
      };
      
      await updateDoc(catDocRef, dataToUpdate);
      
      toast({ title: "Successo!", description: `Dati di ${catData.name} aggiornati.` });
      router.push('/admin');
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error);
      toast({ title: "Errore", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) return <div>Caricamento...</div>;
  if (!user || user?.role !== 'caretaker') return <div>Accesso Negato</div>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>Modifica Scheda di {catData.name}</CardTitle></CardHeader>
      <CardContent>
        {/* ===== IL FORM ORA È COMPLETO ===== */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={catData.name || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="breed">Razza</Label>
            <Input id="breed" value={catData.breed || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Luogo</Label>
            <Input id="location" value={catData.location || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nascita">Data di Nascita</Label>
            <Input id="nascita" type="date" value={catData.nascita || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione / Storia</Label>
            <Textarea id="description" value={catData.description || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personality">Personalità (separate da virgola)</Label>
            <Input id="personality" value={catData.personality || ''} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="needs">Esigenze Particolari (separate da virgola)</Label>
            <Input id="needs" value={catData.needs || ''} onChange={handleChange} />
          </div>
          
          <div>
            <Label>Foto Attuali</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {catData.fotoURLs?.map((url: string) => (
                <div key={url} className="relative group">
                  <Image src={url} alt="Foto gatto" width={100} height={100} className="rounded-md object-cover" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleDeletePhoto(url)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
              <Label htmlFor="newFotos">Aggiungi Nuove Foto</Label>
              <Input id="newFotos" type="file" multiple onChange={(e) => setNewFotos(e.target.files)} />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Salvataggio..." : "Salva Modifiche"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
