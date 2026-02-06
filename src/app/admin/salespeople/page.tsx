
import { getSalespeople } from "@/lib/data";
import { SalespeopleClient } from "./components/salespeople-client";

export default function SalespeoplePage() {
  // In a real app, this would be a database call.
  const salespeople = getSalespeople();

  return <SalespeopleClient initialSalespeople={salespeople} />;
}
