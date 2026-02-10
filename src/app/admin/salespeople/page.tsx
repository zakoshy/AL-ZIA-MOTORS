'use client';

import { useState, useEffect } from 'react';
import { SalespeopleClient } from './components/salespeople-client';
import type { Salesperson } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { getSalespeople } from '@/lib/data';

export default function SalespeoplePage() {
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getSalespeople();
      setSalespeople(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <SalespeopleClient initialSalespeople={salespeople || []} />;
}
