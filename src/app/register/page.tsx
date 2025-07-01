// src/app/register/page.tsx (versione potenziata)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Importa setDoc
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ===== NUOVI STATI PER I DATI AGGIUNTIVI =====
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [citta, setCitta] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Crea l'utente in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. SALVA I DATI AGGIUNTIVI SU FIRESTORE
      // Creiamo un documento nella collezione 'users' con lo stesso ID dell'utente (user.uid)
      await setDoc(doc(db, "users", user.uid), {
        nome: nome,
        cognome: cognome,
        citta: citta,
        email: user.email,
        role: 'adopter', // Assegniamo un ruolo di default
      });

      // 3. Reindirizza l'utente alla pagina di login o al profilo
      router.push('/login');

    } catch (err: any) {
      console.error("Errore di registrazione:", err);
      setError("Impossibile completare la registrazione. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crea il tuo account</CardTitle>
          <CardDescription>Entra nella famiglia di Arrogatti</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* ===== NUOVI CAMPI NEL FORM ===== */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cognome">Cognome</Label>
                <Input id="cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="citta">Città</Label>
              <Input id="citta" value={citta} onChange={(e) => setCitta(e.target.value)} required />
            </div>
            <hr />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registrazione..." : "Registrati"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Hai già un account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">Accedi</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
