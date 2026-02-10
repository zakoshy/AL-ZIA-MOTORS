// This file is now deprecated for data fetching.
// All data is now fetched directly from Firestore using client-side hooks.
// See use-collection.tsx and use-doc.tsx in /src/firebase/firestore.
import type { Vehicle, Salesperson } from "@/lib/types";

const makes = [
  "Acura",
  "BMW",
  "Honda",
  "Infiniti",
  "Isuzu",
  "Land Rover",
  "Lexus",
  "Mazda",
  "Mitsubishi",
  "Nissan",
  "Peugeot",
  "Subaru",
  "Suzuki",
  "Toyota",
  "Volkswagen",
];

export function getMakes() {
    return makes;
}

// The functions below are no longer used and will be removed in a future update.
export function getVehicles(): Vehicle[] {
  return [];
}

export function getVehicleById(id: string): Vehicle | undefined {
  return undefined;
}

export function getSalespeople(): Salesperson[] {
    return [];
}
