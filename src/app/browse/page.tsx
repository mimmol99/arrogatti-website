import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'; // Importa Timestamp

// Funzione per calcolare l'età a partire dalla data di nascita
function calcolaEta(nascita: Timestamp): string {
  const dataNascita = nascita.toDate(); // Converte il Timestamp di Firebase in una data standard
  const oggi = new Date();
  let etaAnni = oggi.getFullYear() - dataNascita.getFullYear();
  let etaMesi = oggi.getMonth() - dataNascita.getMonth();
  
  if (etaMesi < 0 || (etaMesi === 0 && oggi.getDate() < dataNascita.getDate())) {
    etaAnni--;
    etaMesi += 12;
  }

  if (etaAnni > 0) {
    return `${etaAnni} ${etaAnni === 1 ? 'anno' : 'anni'}`;
  } else {
    return `${etaMesi} ${etaMesi === 1 ? 'mese' : 'mesi'}`;
  }
}

// Aggiorniamo la nostra interfaccia per usare 'nascita'
interface Gatto {
  id: string;
  nome: string;
  nascita: Timestamp;
  descrizione: string;
  sesso: string;
  fotoURL: string;
}

async function getGatti() {
  const gattiCollection = collection(db, 'gatti_da_adottare');
  const q = query(gattiCollection, where('adottato', '==', false));
  const gattiSnapshot = await getDocs(q);
  const gattiList = gattiSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Gatto[];
  return gattiList;
}

export default async function BrowsePage() {
  const gatti = await getGatti();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Trova il tuo nuovo amico
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gatti.map((gatto) => (
          <div key={gatto.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="relative w-full h-60">
              <Image
                src={gatto.fotoURL}
                alt={`Foto di ${gatto.nome}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900">{gatto.nome}</h2>
              {/* Qui usiamo la nostra nuova funzione per mostrare l'età calcolata */}
              <p className="text-md text-gray-600 mt-1">{calcolaEta(gatto.nascita)}, {gatto.sesso}</p>
              <p className="text-gray-700 mt-4">{gatto.descrizione}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const revalidate = 60;
