// src/app/chats/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Definiamo un tipo per le nostre chat
interface ChatSnippet {
  id: string;
  catInfo: { name: string };
  lastMessage: string;
  lastMessageTimestamp?: Timestamp;
}

export default function UserChatsPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log(`Caricamento chat per l'utente: ${user.uid}`);
        
        // Questa è la query chiave: prende solo le chat dove l'ID dell'utente
        // è presente nell'array 'partecipanti'.
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef, 
          where('partecipanti', 'array-contains', user.uid),
          orderBy('lastMessageTimestamp', 'desc') // Ordina per messaggio più recente
        );

        const querySnapshot = await getDocs(q);
        const userChats = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatSnippet[];
        
        setChats(userChats);
        console.log(`Trovate ${userChats.length} chat.`);

      } catch (error) {
        console.error("Errore nel caricare le chat dell'utente:", error);
        // Qui potrebbe apparire un errore se manca un indice in Firestore!
      } finally {
        setLoading(false);
      }
    };

    fetchUserChats();
  }, [user]); // Esegui ogni volta che l'utente cambia

  if (loading) {
    return <div className="text-center py-10">Caricamento delle tue chat...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">Devi accedere per vedere le tue chat.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Le Mie Conversazioni</CardTitle>
        </CardHeader>
        <CardContent>
          {chats.length === 0 ? (
            <p className="text-muted-foreground">Non hai ancora nessuna conversazione attiva.</p>
          ) : (
            <ul className="divide-y">
              {chats.map(chat => (
                <li key={chat.id}>
                  <Link href={`/chat/${chat.id}`} className="block p-4 hover:bg-secondary">
                    <p className="font-semibold">Conversazione per: {chat.catInfo.name}</p>
                    <p className="text-sm text-muted-foreground truncate italic">"{chat.lastMessage}"</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
