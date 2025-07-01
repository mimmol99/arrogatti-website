// src/components/cats/StartChatButton.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { MessageSquare } from "lucide-react";

interface StartChatButtonProps {
  catId: string;
  catName: string;
}

export function StartChatButton({ catId, catName }: StartChatButtonProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleStartChat = async () => {
    if (!user) {
      // Se l'utente non è loggato, lo mandiamo alla pagina di login
      router.push('/login');
      return;
    }

    // Creiamo un ID unico per la chat combinando l'ID dell'utente e quello del gatto
    const chatId = `${user.uid}_${catId}`;
    const chatRef = doc(db, 'chats', chatId);

    try {
      // Controlliamo se una chat esiste già per non sovrascriverla
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          // Ora i partecipanti sono solo l'utente che inizia la chat.
          // Gli admin avranno accesso grazie alla nuova regola basata sul ruolo.
          partecipanti: [user.uid],
          createdAt: serverTimestamp(),
          lastMessage: `Richiesta per ${catName}`,
          catInfo: { id: catId, name: catName },
          userInfo: { id: user.uid, name: user.name },
          // Non serve più un adminInfo specifico, possiamo rimuoverlo o lasciarlo generico
          adminInfo: { name: 'Staff Arrogatti' }
        });
      }
      
      // Creiamo il messaggio precompilato
      const message = `Ciao! vorrei maggiori informazioni per adottare ${catName}`;
      
      // Reindirizziamo l'utente alla pagina della chat, passando il messaggio come parametro
      router.push(`/chat/${chatId}?message=${encodeURIComponent(message)}`);

    } catch (error) {
      console.error("Errore nell'avviare la chat:", error);
    }
  };

  return (
    <Button onClick={handleStartChat} size="lg" className="w-full text-lg">
      <MessageSquare className="mr-2 h-5 w-5" /> Adotta o chiedi info su {catName}
    </Button>
  );
}
