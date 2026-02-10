"use server";

// This file is being deprecated for database mutations.
// All Firestore writes are now handled on the client-side
// to align with best practices for optimistic UI updates and error handling.
// See /src/app/admin/components/vehicle-form.tsx for the new implementation.

export async function createVehicle(formData: FormData) {
  console.warn("createVehicle server action is deprecated.");
  return { error: "This function is deprecated. Use client-side mutations." };
}

export async function updateVehicle(id: string, formData: FormData) {
  console.warn("updateVehicle server action is deprecated.");
  return { error: "This function is deprecated. Use client-side mutations." };
}

export async function deleteVehicle(id: string) {
  console.warn("deleteVehicle server action is deprecated.");
  return { error: "This function is deprecated. Use client-side mutations." };
}

export async function createSalesperson(formData: FormData) {
  console.warn("createSalesperson server action is deprecated.");
  return { error: "This function is deprecated. Use client-side mutations." };
}

export async function deleteSalesperson(id: string) {
  console.warn("deleteSalesperson server action is deprecated.");
  return { error: "This function is deprecated. Use client-side mutations." };
}
