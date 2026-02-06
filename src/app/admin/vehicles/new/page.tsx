import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleForm } from "@/app/admin/components/vehicle-form";
import { getSalespeople } from "@/lib/data";

export default function NewVehiclePage() {
  const salespeople = getSalespeople();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
        <CardDescription>Fill out the form below to add a new car to the inventory.</CardDescription>
      </CardHeader>
      <CardContent>
        <VehicleForm salespeople={salespeople} />
      </CardContent>
    </Card>
  );
}
