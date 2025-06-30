// src/app/admin/add-cat/page.tsx (versione con Data di Nascita)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function AddCatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Stati per i campi del form (con 'nascita' invece di 'age')
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [location, setLocation] = useState('');
  const [nascita, setNascita] = useState(''); // Stato per la data di nascita
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');
  const [needs, setNeeds] = useState('');
  const [fotos, setFotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user.role !== 'caretaker') return <div>Accesso Negato</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotos || fotos.length === 0 || !nascita) return;
    setIsSubmitting(true);

    try {
      const uploadPromises = Array.from(fotos).map(file => {
        const filePath = `cats/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, filePath);
        return uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
      });
      const fotoURLs = await Promise.all(uploadPromises);

      // Convertiamo la data e usiamo 'nascita' nel documento da salvare
      const dataNascita = Timestamp.fromDate(new Date(nascita));

      await addDoc(collection(db, "gatti_da_adottare"), {
        name,
        breed,
        location,
        description,
        personality: personality.split(',').map(p => p.trim()).filter(p => p),
        needs: needs.split(',').map(n => n.trim()).filter(n => n),
        nascita: dataNascita, // Usiamo il campo 'nascita'
        fotoURLs,
        caretakerName: user.name,
        adottato: false,
        createdAt: Timestamp.now(),
      });
      
      toast({ title: "Successo!", description: `Scheda creata per ${name}.` });
      router.push('/admin');
    } catch (err) {
      console.error("Errore:", err);
      toast({ title: "Errore", description: "Impossibile creare la scheda.", variant: "destructive"});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>Aggiungi una Nuova Scheda Gatto</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
           <div className="space-y-2">
            <Label htmlFor="breed">Razza</Label>
            <Input id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Luogo</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nascita">Data di Nascita (approssimativa)</Label>
            <Input id="nascita" type="date" value={nascita} onChange={(e) => setNascita(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione / Storia</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
           <div className="space-y-2">
            <Label htmlFor="personality">Personalità (separate da virgola)</Label>
            <Input id="personality" value={personality} onChange={(e) => setPersonality(e.target.value)} placeholder="Giocherellone, Timido" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="needs">Esigenze Particolari (separate da virgola)</Label>
            <Input id="needs" value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="Dieta speciale, Casa tranquilla" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fotos">Foto (seleziona più file)</Label>
            <Input id="fotos" type="file" multiple onChange={(e) => setFotos(e.target.files)} required />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio..." : "Salva Scheda Gatto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
