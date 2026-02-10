'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { VehicleTable } from '@/app/admin/components/vehicle-table';
import type { Vehicle } from '@/lib/types';
import { getVehicles } from '@/lib/data';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getVehicles();
      setVehicles(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const { allVehicles, availableVehicles, incomingVehicles, soldVehicles } =
    useMemo(() => {
      const all = vehicles || [];
      return {
        allVehicles: all,
        availableVehicles: all.filter((v) => v.status === 'Available'),
        incomingVehicles: all.filter((v) => v.status === 'Incoming'),
        soldVehicles: all.filter((v) => v.status === 'Sold'),
      };
    }, [vehicles]);

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Vehicle Inventory
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/vehicles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <VehicleTable vehicles={allVehicles} />
          </TabsContent>
          <TabsContent value="available">
            <VehicleTable vehicles={availableVehicles} />
          </TabsContent>
          <TabsContent value="incoming">
            <VehicleTable vehicles={incomingVehicles} />
          </TabsContent>
          <TabsContent value="sold">
            <VehicleTable vehicles={soldVehicles} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
