// src/app/admin/add-cat/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Importiamo tutto ciò che serve da Firebase
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Importiamo i componenti UI
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

  const [nome, setNome] = useState('');
  const [razza, setRazza] = useState('');
  const [sesso, setSesso] = useState('');
  const [luogo, setLuogo] = useState('');
  const [nascita, setNascita] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [personalita, setPersonalita] = useState('');
  const [esigenze, setEsigenze] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.role !== 'caretaker') {
    return <div className="text-center py-20"><h1 className="text-2xl font-bold">Accesso Negato</h1></div>;
  }

  // QUESTA È L'UNICA E CORRETTA FUNZIONE HANDLESUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto) {
      setError("Per favore, seleziona una foto.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    console.log("Checkpoint 1: Inizio salvataggio...");

    try {
      const filePath = `cats/${Date.now()}-${foto.name}`;
      const storageRef = ref(storage, filePath);
      
      console.log("Checkpoint 2: Sto per caricare la foto su Storage...");
      await uploadBytes(storageRef, foto);
      console.log("Checkpoint 3: Foto caricata! Sto per ottenere l'URL...");

      const fotoURL = await getDownloadURL(storageRef);
      console.log("Checkpoint 4: URL ottenuto! Sto per salvare su Firestore...");
      
      const dataNascita = Timestamp.fromDate(new Date(nascita));

      await addDoc(collection(db, "gatti_da_adottare"), {
        nome,
        razza,
        sesso,
        luogo,
        nascita: dataNascita,
        descrizione,
        personalità: personalita,
        esigenze,
        fotoURL,
        adottato: false,
        createdAt: Timestamp.now(),
      });
      
      console.log("Checkpoint 5: Dati salvati su Firestore! Successo!");
      
      toast({
        title: "Successo!",
        description: `La scheda per ${nome} è stata creata.`,
      });
      router.push('/admin');

    } catch (err) {
      console.error("ERRORE CRITICO:", err);
      setError("Si è verificato un errore. Controlla la console per i dettagli.");
    } finally {
      console.log("Checkpoint 6: Eseguo il blocco 'finally'.");
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Aggiungi una Nuova Scheda Gatto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome del Gatto</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="razza">Razza</Label>
              <Input id="razza" value={razza} onChange={(e) => setRazza(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sesso">Sesso</Label>
              <Input id="sesso" value={sesso} onChange={(e) => setSesso(e.target.value)} placeholder="Maschio / Femmina" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="luogo">Luogo</Label>
              <Input id="luogo" value={luogo} onChange={(e) => setLuogo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nascita">Data di Nascita (approssimativa)</Label>
              <Input id="nascita" type="date" value={nascita} onChange={(e) => setNascita(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descrizione">Descrizione / Storia</Label>
            <Textarea id="descrizione" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personalita">Personalità (es. tranquillo, giocherellone...)</Label>
            <Input id="personalita" value={personalita} onChange={(e) => setPersonalita(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="esigenze">Esigenze Particolari</Label>
            <Input id="esigenze" value={esigenze} onChange={(e) => setEsigenze(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="foto">Foto</Label>
            <Input id="foto" type="file" onChange={(e) => e.target.files && setFoto(e.target.files[0])} required />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio in corso..." : "Salva Scheda Gatto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
