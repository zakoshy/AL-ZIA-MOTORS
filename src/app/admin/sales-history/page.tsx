"use client";

import { useMemo } from 'react';
import { SalesHistoryTable } from "@/app/admin/components/sales-history-table";
import { useCollection, useFirestore } from "@/firebase";
import type { Vehicle } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function SalesHistoryPage() {
  const firestore = useFirestore();
  const soldVehiclesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "vehicles"), where("status", "==", "Sold"));
  }, [firestore]);
  const { data: soldVehicles, loading } = useCollection<Vehicle>(soldVehiclesQuery);

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
