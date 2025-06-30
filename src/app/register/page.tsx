// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import di Firebase (ora più puliti)
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Import dei componenti UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('adopter');
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    // Non abbiamo più bisogno di inizializzare auth e db qui

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Le password non coincidono.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                role: accountType,
                createdAt: new Date(),
            });

            router.push('/');

        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError("Questa email è già stata registrata.");
            } else if (err.code === 'auth/weak-password') {
                setError("La password deve essere di almeno 6 caratteri.");
            } else {
                setError("Si è verificato un errore durante la registrazione. Riprova.");
            }
        }
    };

    return (
        <div className="flex justify-center items-start pt-16">
             <Card className="w-full max-w-md shadow-lg border-primary/20">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold text-primary">Crea un Account Arrogatti</CardTitle>
                    <CardDescription>Registrati per adottare o per gestire le adozioni.</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}> 
                    <CardContent className="space-y-5 pt-6">
                        <div className="space-y-3">
                            <Label htmlFor="account-type" className="text-base font-medium">Tipo di Account</Label>
                            <RadioGroup defaultValue={accountType} onValueChange={setAccountType} id="account-type" className="flex space-x-6 pt-1">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="adopter" id="r-adopter" />
                                    <Label htmlFor="r-adopter" className="text-base">Voglio Adottare</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="caretaker" id="r-caretaker" />
                                    <Label htmlFor="r-caretaker" className="text-base">Sono un Referente</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome / Nome Associazione</Label>
                            <Input id="name" placeholder="Mario Rossi / Arrogatti ODV" required value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="mario.rossi@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Conferma Password</Label>
                            <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-6">
                        <Button type="submit" className="w-full" size="lg">Registrati</Button>
                        <p className="text-sm text-center text-muted-foreground pt-2">
                            Hai già un account?{' '}
                            <Link href="/login" className="font-medium text-primary underline hover:text-primary/80">
                                Accedi
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
