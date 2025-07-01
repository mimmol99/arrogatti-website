// src/app/admin/chats/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminChatList } from '@/components/admin/AdminChatList';
import { AdminChatWindow } from '@/components/admin/AdminChatWindow';

export default function AdminChatsPage() {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Guardia di sicurezza
  if (user?.role !== 'caretaker') {
    return <div className="text-center py-20"><h1 className="text-2xl font-bold">Accesso Negato</h1></div>;
  }

  return (
    <div className="flex h-[calc(100vh-120px)] border rounded-lg">
      <div className="w-1/3 border-r">
        {/* Pannello Sinistro: La lista di tutte le chat */}
        <AdminChatList onSelectChat={setSelectedChatId} />
      </div>
      <div className="w-2/3 flex flex-col">
        {/* Pannello Destro: La finestra con i messaggi della chat selezionata */}
        <AdminChatWindow chatId={selectedChatId} />
      </div>
    </div>
  );
}
