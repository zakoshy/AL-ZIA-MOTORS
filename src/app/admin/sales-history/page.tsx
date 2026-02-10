'use client';

import { useState, useEffect } from 'react';
import { SalesHistoryTable } from '@/app/admin/components/sales-history-table';
import type { Vehicle } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { getVehicles } from '@/lib/data';

export default function SalesHistoryPage() {
  const [soldVehicles, setSoldVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const vehicles = await getVehicles({ status: 'Sold' });
      setSoldVehicles(vehicles);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Sales History
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <SalesHistoryTable vehicles={soldVehicles || []} />
      )}
    </div>
  );
}
