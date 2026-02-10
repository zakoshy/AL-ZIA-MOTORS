"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleForm } from "@/app/admin/components/vehicle-form";
import { notFound } from "next/navigation";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Vehicle } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const vehicleRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "vehicles", params.id);
  }, [firestore, params.id]);
  const { data: vehicle, loading } = useDoc<Vehicle>(vehicleRef);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Vehicle</CardTitle>
        <CardDescription>Update the details for the {vehicle.year} {vehicle.make} {vehicle.model}.</CardDescription>
      </CardHeader>
      <CardContent>
        <VehicleForm vehicle={vehicle} />
      </CardContent>
    </Card>
  );
}
