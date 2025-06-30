// src/types/cat.ts
import { Timestamp } from 'firebase/firestore'; // <-- Aggiungi questo import

export interface Cat {
  id: string;
  name: string;
  breed: string;
  nascita: Timestamp; // <-- Assicurati che ci sia questo
  // age?: string; <-- Rimuovi o commenta questo se presente
  location: string;
  description: string;
  fotoURLs: string[];
  // ... resto dei campi
}
