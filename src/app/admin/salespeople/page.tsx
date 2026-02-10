"use client";

import { SalespeopleClient } from "./components/salespeople-client";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Salesperson } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function SalespeoplePage() {
  const firestore = useFirestore();
  const { data: salespeople, loading } = useCollection<Salesperson>(
    firestore ? collection(firestore, "salespeople") : null
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <SalespeopleClient initialSalespeople={salespeople || []} />;
}
