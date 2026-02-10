'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VehicleForm } from '@/app/admin/components/vehicle-form';
import { notFound } from 'next/navigation';
import type { Vehicle } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { getVehicleById } from '@/lib/data';

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const [vehicle, setVehicle] = useState<Vehicle | null | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      const v = await getVehicleById(params.id);
      setVehicle(v);
    }
    loadData();
  }, [params.id]);


  if (vehicle === undefined) {
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
        <CardDescription>
          Update the details for the {vehicle.year} {vehicle.make}{' '}
          {vehicle.model}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VehicleForm vehicle={vehicle} />
      </CardContent>
    </Card>
  );
}
