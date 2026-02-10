'use client';

import { useState, useMemo } from 'react';
import { VehicleCard } from '@/app/components/vehicle-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import type { Vehicle, VehicleType } from '@/lib/types';
import { Combobox } from '@/components/ui/combobox';
import { getMakes } from '@/lib/makes';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import { useDebounce } from 'use-debounce';

export default function VehiclesPage() {
  const firestore = useFirestore();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [selectedMake, setSelectedMake] = useState('all');
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const makes = ['all', ...getMakes()];
  const fuelTypes = ['all', 'Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'];
  const vehicleTypes: ('all' | VehicleType)[] = [
    'all',
    'Coupe',
    'Hatchback',
    'Minivan',
    'Sedan',
    'Pickup',
    'SWagon',
    'SUV',
    'TWagon',
    'Truck',
    'Van',
  ];

  const vehiclesQuery = useMemo(() => {
    if (!firestore) return null;
    
    const q = query(
      collection(firestore, 'vehicles'),
      where('status', '==', 'Available')
    );
    
    const constraints: DocumentData[] = [];
    if (selectedMake !== 'all') {
      constraints.push(where('make', '==', selectedMake));
    }
    if (selectedFuel !== 'all') {
      constraints.push(where('fuel', '==', selectedFuel));
    }
    if (selectedType !== 'all') {
      constraints.push(where('vehicleType', '==', selectedType));
    }

    return query(q, ...constraints);

  }, [firestore, selectedMake, selectedFuel, selectedType]);

  const { data: allVehicles, loading } = useCollection<Vehicle>(vehiclesQuery);

  const filteredVehicles = useMemo(() => {
    if (!allVehicles) return [];
    if (!debouncedSearchTerm) return allVehicles;
    return allVehicles.filter((vehicle) =>
      `${vehicle.make} ${vehicle.model} ${vehicle.year}`
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [allVehicles, debouncedSearchTerm]);


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Our Inventory
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of hand-picked, high-quality Japanese vehicles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-card border rounded-lg">
        <div className="relative flex-grow lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by make, model, or year..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Combobox
          options={makes.map((make) => ({
            value: make,
            label: make === 'all' ? 'All Makes' : make,
          }))}
          value={selectedMake}
          onChange={setSelectedMake}
          placeholder="Filter by make"
          searchPlaceholder="Search makes..."
          emptyText="No make found."
        />
        <Select value={selectedFuel} onValueChange={setSelectedFuel}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by fuel" />
          </SelectTrigger>
          <SelectContent>
            {fuelTypes.map((fuel) => (
              <SelectItem key={fuel} value={fuel}>
                {fuel === 'all' ? 'All Fuel Types' : fuel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="lg:col-start-4">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? 'All Vehicle Types' : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg">
          <h2 className="text-2xl font-semibold">No Vehicles Found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
