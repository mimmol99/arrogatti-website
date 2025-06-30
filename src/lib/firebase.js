// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importa anche getAuth
import { getStorage } from "firebase/storage"; // <-- 1. IMPORTA getStorage


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "",
  authDomain: "amici-felini.firebaseapp.com",
  projectId: "amici-felini",
  //storageBucket: "amici-felini.firebasestorage.app",
  storageBucket: "amici-felini.firebasestorage.app", 
  messagingSenderId: "382127018088",
  appId: "1:382127018088:web:1a13eb7cfe2789d76f6bdd"
};

// Questo codice controlla se l'app Firebase è già stata inizializzata.
// È una buona pratica in Next.js per evitare errori durante lo sviluppo.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inizializziamo i servizi e li esportiamo, pronti per l'uso
const db = getFirestore(app);
const auth = getAuth(app); // Inizializziamo auth QUI
const storage = getStorage(app); // <-- 3. INIZIALIZZA STORAGE

// Esportiamo tutto ciò che ci serve, così non dovremo più importare 'app'
export { app, db, auth, storage };
