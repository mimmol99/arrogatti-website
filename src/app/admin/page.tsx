// src/app/admin/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // "Guardia" di sicurezza: se l'utente non è un referente, non mostriamo nulla
  if (user?.role !== 'caretaker') {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Accesso Negato</h1>
        <p className="text-muted-foreground">Non hai i permessi per visualizzare questa pagina.</p>
      </div>
    );
  }

  // Se è un referente, mostriamo il cruscotto
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cruscotto Referente</h1>
      <p className="mb-4">Benvenuto, {user.name}. Da qui puoi gestire i gatti del rifugio.</p>
      
      <div className="space-x-4">
        <Link href="/admin/add-cat">
          <Button>Aggiungi un Nuovo Gatto</Button>
        </Link>
        {/* In futuro qui aggiungeremo un link per vedere/modificare i gatti esistenti */}
      </div>
    </div>
  );
}
