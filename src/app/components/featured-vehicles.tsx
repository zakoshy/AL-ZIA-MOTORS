'use client';

import { useMemo } from 'react';
import { VehicleCard } from '@/app/components/vehicle-card';
import { useCollection, useFirestore } from '@/firebase';
import type { Vehicle } from '@/lib/types';
import { collection, query, where, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedVehicles() {
  const db = useFirestore();

  const featuredQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'vehicles'),
      where('status', '==', 'Available'),
      limit(3)
    );
  }, [db]);

  const { data: featuredVehicles, loading } = useCollection<Vehicle>(featuredQuery);
  const vehicles = featuredVehicles || [];

  return (
    <div className="mt-10">
      {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
           </div>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
         <div className="text-center py-10">
            <p className="text-muted-foreground">No featured vehicles available at the moment.</p>
        </div>
      )}
    </div>
  );
}
