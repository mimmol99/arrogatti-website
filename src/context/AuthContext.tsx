// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, Firestore } from 'firebase/firestore'; // Import per leggere da Firestore
import { auth, db } from '@/lib/firebase';

// Creiamo un nuovo tipo per il nostro utente che include anche il ruolo
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'adopter' | 'caretaker'; // Il ruolo può essere uno di questi due
}

interface AuthContextType {
  user: UserProfile | null; // Ora il nostro utente ha anche il profilo!
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Se l'utente è loggato, andiamo a leggere il suo profilo da Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Se troviamo il profilo, lo impostiamo come nostro utente
          setUser(docSnap.data() as UserProfile);
        } else {
          // Caso strano: utente esiste in Auth ma non in Firestore. Lo slogghiamo.
          setUser(null);
        }
      } else {
        // Se l'utente non è loggato, l'utente è null.
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
