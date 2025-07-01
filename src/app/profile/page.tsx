// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Stati per i campi del form, inizializzati con i dati dell'utente
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [citta, setCitta] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quando l'utente viene caricato, popoliamo i campi del form
  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setCognome(user.cognome || '');
      setCitta(user.citta || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        nome: nome,
        cognome: cognome,
        citta: citta,
      });
      toast({ title: "Successo!", description: "Il tuo profilo è stato aggiornato." });
    } catch (error) {
      console.error("Errore aggiornamento profilo:", error);
      toast({ title: "Errore", description: "Impossibile aggiornare il profilo.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="text-center py-20">Caricamento...</div>;
  }

  if (!user) {
    // Se l'utente non è loggato, lo reindirizziamo al login
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Il Mio Profilo</CardTitle>
          <CardDescription>Visualizza e aggiorna i tuoi dati personali.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cognome">Cognome</Label>
                <Input id="cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="citta">Città</Label>
              <Input id="citta" value={citta} onChange={(e) => setCitta(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (non modificabile)</Label>
              <Input id="email" type="email" value={user.email || ''} disabled />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : "Salva Modifiche"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
