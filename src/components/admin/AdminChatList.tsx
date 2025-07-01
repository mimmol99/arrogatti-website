// src/components/admin/AdminChatList.tsx
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Chat {
  id: string;
  userInfo: { name: string };
  catInfo: { name: string };
  lastMessage: string;
}

interface AdminChatListProps {
  onSelectChat: (chatId: string) => void;
}

export function AdminChatList({ onSelectChat }: AdminChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Conversazioni</h2>
      </div>
      <ul className="divide-y">
        {chats.map(chat => (
          <li key={chat.id}>
            <button onClick={() => onSelectChat(chat.id)} className="w-full text-left p-4 hover:bg-secondary">
              <p className="font-bold">{chat.userInfo?.name || 'Utente Sconosciuto'}</p>
              <p className="text-sm text-muted-foreground">Riguardo: {chat.catInfo.name}</p>
              <p className="text-sm text-muted-foreground truncate italic">"{chat.lastMessage}"</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
