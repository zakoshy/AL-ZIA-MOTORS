
"use client";

import { useState } from "react";
import type { Salesperson } from "@/lib/types";
import { AddSalespersonDialog } from "./add-salesperson-dialog";
import { SalespeopleTable } from "./salespeople-table";

export function SalespeopleClient({ initialSalespeople }: { initialSalespeople: Salesperson[] }) {
  const [salespeople, setSalespeople] = useState(initialSalespeople);

  // This is a simple way to refresh the list. In a real app, you might re-fetch.
  const handleSalespeopleChange = () => {
    // For now, we assume the action was successful and don't re-fetch.
    // A more robust solution might involve re-validating the path or re-fetching the data.
  };

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Manage Salespeople
        </h2>
        <AddSalespersonDialog onSalespersonAdded={handleSalespeopleChange} />
      </div>
      <SalespeopleTable salespeople={salespeople} />
    </div>
  );
}
