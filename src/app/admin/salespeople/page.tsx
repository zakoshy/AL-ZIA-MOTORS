'use client';

import { useState, useMemo } from 'react';
import { SalespeopleClient } from './components/salespeople-client';
import type { Salesperson } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function SalespeoplePage() {
  const firestore = useFirestore();
  const salespeopleQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'salespeople');
  }, [firestore]);
  
  const { data: salespeople, loading } = useCollection<Salesperson>(salespeopleQuery);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <SalespeopleClient initialSalespeople={salespeople || []} />;
}
