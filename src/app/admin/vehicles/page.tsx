'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { VehicleTable } from '@/app/admin/components/vehicle-table';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';


export default function AdminVehiclesPage() {
  const db = useFirestore();
  const vehiclesQuery = useMemo(() => db ? query(collection(db, 'vehicles')) : null, [db]);
  const { data: allVehiclesData, loading } = useCollection<Vehicle>(vehiclesQuery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const searchedVehicles = useMemo(() => {
    const allVehicles = allVehiclesData || [];
    if (!debouncedSearchTerm) return allVehicles;
    
    return allVehicles.filter((vehicle) =>
      `${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.referenceNumber || ''} ${vehicle.chassisNumber}`
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [allVehiclesData, debouncedSearchTerm]);


  const { availableVehicles, incomingVehicles, soldVehicles } =
    useMemo(() => {
      return {
        availableVehicles: searchedVehicles.filter((v) => v.status === 'Available'),
        incomingVehicles: searchedVehicles.filter((v) => v.status === 'Incoming'),
        soldVehicles: searchedVehicles.filter((v) => v.status === 'Sold'),
      };
    }, [searchedVehicles]);

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Vehicle Inventory
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild size="sm">
            <Link href="/admin/vehicles/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Vehicle
            </Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({searchedVehicles.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableVehicles.length})</TabsTrigger>
          <TabsTrigger value="incoming">Incoming ({incomingVehicles.length})</TabsTrigger>
          <TabsTrigger value="sold">Sold ({soldVehicles.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <VehicleTable vehicles={searchedVehicles} isLoading={loading} />
        </TabsContent>
        <TabsContent value="available">
          <VehicleTable vehicles={availableVehicles} isLoading={loading} />
        </TabsContent>
        <TabsContent value="incoming">
          <VehicleTable vehicles={incomingVehicles} isLoading={loading} />
        </TabsContent>
        <TabsContent value="sold">
          <VehicleTable vehicles={soldVehicles} isLoading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
