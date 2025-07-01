// src/app/chat/[chatId]/page.tsx (versione finale senza avvisi)
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
  // ===== MODIFICA CHIAVE: estraiamo 'chatId' una sola volta =====
  const { chatId } = params;
  // =============================================================

  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  useEffect(() => {
    const prefilledMessage = searchParams.get('message');
    if (prefilledMessage) {
      setNewMessage(prefilledMessage);
    }
  }, [searchParams]);

  // Ascoltatore in tempo reale per i messaggi
  useEffect(() => {
    // Ora usiamo la variabile 'chatId'
    if (!user || !chatId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, chatId]); // La dipendenza ora è 'chatId', più pulita
  
  // Funzione per inviare un nuovo messaggio
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp()
    });
    setNewMessage('');
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return <p>Devi accedere per visualizzare la chat.</p>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] container mx-auto">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.senderId === user.uid ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-background border-t flex gap-2">
        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Scrivi un messaggio..." />
        <Button type="submit">Invia</Button>
      </form>
    </div>
  );
}
