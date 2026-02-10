
import type { Vehicle, Salesperson, VehicleImage } from "@/lib/types";

const makes = [
  "Acura", "BMW", "Honda", "Infiniti", "Isuzu", "Land Rover", "Lexus", "Mazda",
  "Mitsubishi", "Nissan", "Peugeot", "Subaru", "Suzuki", "Toyota", "Volkswagen",
];

export function getMakes() {
    return makes;
}

const dummyImages: Record<string, VehicleImage[]> = {
  "1": [
    { id: 'car-1-1', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjYXIlMjBzaG93cm9vbXxlbnwwfHx8fDE3NzAzODg0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeature: true },
    { id: 'car-1-2', url: 'https://images.unsplash.com/photo-1625690180114-5530b1304127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYXIlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzAyOTkxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080', isFeature: false },
  ],
  "2": [
    { id: 'car-2-1', url: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop', isFeature: true },
    { id: 'car-2-2', url: 'https://images.unsplash.com/photo-1505635374747-431af16edaf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjYXIlMjBlbmdpbmV8ZW58MHx8fHwxNzcwMjc0NTEzfDA&ixlib=rb-4.1.0&q=80&w=1080', isFeature: false },
  ],
  "3": [
    { id: 'car-3-1', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop', isFeature: true },
    { id: 'car-3-2', url: 'https://images.unsplash.com/photo-1594045598607-b6f94efa20d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYXIlMjB0YWlsbGlnaHRzfGVufDB8fHx8MTc3MDMwMzYyNHww&ixlib=rb-4.1.0&q=80&w=1080', isFeature: false },
  ],
  "4": [
    { id: 'car-4-1', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop', isFeature: true },
  ],
  "5": [
    { id: 'car-5-1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop', isFeature: true },
  ],
  "6": [
     { id: 'hero-nissan', url: 'https://images.unsplash.com/photo-1606567593299-873a152d7b53?q=80&w=2070&auto=format&fit=crop', isFeature: true },
  ],
  "7": [
     { id: 'hero-toyota', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop', isFeature: true },
  ]
};

const dummyVehicles: Vehicle[] = [
  { id: '1', make: 'Toyota', model: 'Crown', year: 2022, referenceNumber: 'TC2022', chassisNumber: 'TYT-12345', drivetrain: 'RWD', transmission: 'Automatic', color: 'Black', fuel: 'Hybrid', vehicleType: 'Sedan', mileage: 15000, condition: 'Used', price: 35000, currency: 'USD', status: 'Available', inspectionStatus: 'Passed', images: dummyImages['1'] },
  { id: '2', make: 'Nissan', model: 'Skyline GT-R', year: 1999, referenceNumber: 'NS1999', chassisNumber: 'NSN-67890', drivetrain: 'AWD', transmission: 'Manual', color: 'Bayside Blue', fuel: 'Petrol', vehicleType: 'Coupe', mileage: 85000, condition: 'Used', price: 95000, currency: 'USD', status: 'Available', inspectionStatus: 'Passed', images: dummyImages['2'] },
  { id: '3', make: 'Honda', model: 'Fit', year: 2020, referenceNumber: 'HF2020', chassisNumber: 'HND-24680', drivetrain: 'FWD', transmission: 'Automatic', color: 'Silver', fuel: 'Petrol', vehicleType: 'Hatchback', mileage: 30000, condition: 'Used', price: 18000, currency: 'KSh', status: 'Incoming', inspectionStatus: 'Pending', images: dummyImages['3'] },
  { id: '4', make: 'Subaru', model: 'WRX STI', year: 2021, referenceNumber: 'SB2021', chassisNumber: 'SBR-13579', drivetrain: 'AWD', transmission: 'Manual', color: 'WR Blue Pearl', fuel: 'Petrol', vehicleType: 'Sedan', mileage: 12000, condition: 'Used', price: 42000, currency: 'USD', status: 'Available', inspectionStatus: 'Passed', images: dummyImages['4'] },
  { id: '5', make: 'Land Rover', model: 'Defender', year: 2023, referenceNumber: 'LR2023', chassisNumber: 'LND-97531', drivetrain: '4x4', transmission: 'Automatic', color: 'Pangea Green', fuel: 'Diesel', vehicleType: 'SUV', mileage: 5000, condition: 'New', price: 7500000, currency: 'KSh', status: 'Sold', inspectionStatus: 'Passed', saleDate: '2023-11-15', buyerDetails: 'John Doe', finalPrice: 7450000, images: dummyImages['5'] },
  { id: '6', make: 'Nissan', model: 'GT-R', year: 2023, referenceNumber: 'NG2023', chassisNumber: 'NGT-86420', drivetrain: 'AWD', transmission: 'Automatic', color: 'White', fuel: 'Petrol', vehicleType: 'Coupe', mileage: 2000, condition: 'New', price: 120000, currency: 'USD', status: 'Available', inspectionStatus: 'Passed', images: dummyImages['6'] },
  { id: '7', make: 'Toyota', model: 'Supra', year: 2023, referenceNumber: 'TS2023', chassisNumber: 'TSP-19283', drivetrain: 'RWD', transmission: 'Automatic', color: 'Red', fuel: 'Petrol', vehicleType: 'Coupe', mileage: 3000, condition: 'Used', price: 65000, currency: 'USD', status: 'Available', inspectionStatus: 'Passed', images: dummyImages['7'] },
];

const dummySalespeople: Salesperson[] = [
    { id: '1', name: 'Zainab Al-Zia', email: 'zainab@alziatrading.com' },
    { id: '2', name: 'Kenji Tanaka', email: 'kenji@alziatrading.com' },
];

// Data fetching functions
export async function getVehicles(options?: { limit?: number; status?: 'Available' | 'Sold' | 'Incoming' }): Promise<Vehicle[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    let vehicles = dummyVehicles;
    if (options?.status) {
        vehicles = vehicles.filter(v => v.status === options.status);
    }
    if (options?.limit) {
        return vehicles.slice(0, options.limit);
    }
    return vehicles;
}

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return dummyVehicles.find(v => v.id === id);
}

export async function getSalespeople(): Promise<Salesperson[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return dummySalespeople;
}
