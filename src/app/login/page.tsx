// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import per Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Import dei componenti UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function LoginPage() {
    // ===== INIZIO LOGICA =====
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Login riuscito, reindirizza alla homepage
            router.push('/');
        } catch (err: any) {
            // Questo è il blocco che ci aiuterà a trovare l'errore!
            console.error("ERRORE DI LOGIN:", err); // Stampa l'errore dettagliato nella console del browser
            setError("Email o password non validi. Riprova.");
        }
    };
    // ===== FINE LOGICA =====

    return (
        <div className="flex justify-center items-start pt-16">
            <Card className="w-full max-w-sm shadow-lg border-primary/20">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold text-primary">Accedi</CardTitle>
                    <CardDescription>Inserisci le tue credenziali per accedere ad Arrogatti.</CardDescription>
                </CardHeader>
                
                {/* Colleghiamo la funzione handleLogin al form */}
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            {/* Colleghiamo l'input allo stato 'email' */}
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="mario.rossi@email.com" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-xs underline hover:text-primary">
                                    Password dimenticata?
                                </Link>
                            </div>
                            {/* Colleghiamo l'input allo stato 'password' */}
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* Mostriamo un eventuale messaggio di errore */}
                        {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-6">
                        {/* Il pulsante ora è di tipo "submit" */}
                        <Button type="submit" className="w-full" size="lg">Accedi</Button>
                        <p className="text-sm text-center text-muted-foreground pt-2">
                            Non hai un account?{' '}
                            <Link href="/register" className="font-medium text-primary underline hover:text-primary/80">
                                Registrati
                            </Link>
                        </p>
                    </CardFooter>
                </form>

            </Card>
        </div>
    );
}
