"use client";

import { useState } from "react";
import type { Vehicle } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { optimizeImageAndFlag } from "@/ai/flows/image-optimization-and-flagging";
import Image from "next/image";
import { AlertCircle, CheckCircle, UploadCloud, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createVehicle, updateVehicle } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { getMakes } from "@/lib/data";

const vehicleFormSchema = z.object({
  make: z.string().min(2, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().int().min(1900, "Invalid year"),
  chassisNumber: z.string().min(5, "Chassis number is required."),
  fuel: z.enum(["Petrol", "Diesel"]),
  mileage: z.coerce.number().nonnegative("Mileage must be a positive number"),
  condition: z.enum(["New", "Used", "Damaged"]),
  price: z.coerce.number().positive("Price must be a positive number"),
  status: z.enum(["Incoming", "Available", "Sold"]),
  inspectionStatus: z.enum(["Pending", "Passed", "Failed"]),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

type ImagePreview = {
  fileName: string;
  dataUri: string;
  flagged?: boolean;
  reason?: string;
};

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const makes = getMakes();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: vehicle || {
      condition: "Used",
      status: "Available",
      inspectionStatus: "Pending",
      fuel: "Petrol",
    },
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const filesToProcess = Array.from(files).filter(
      (file) => !imagePreviews.some((p) => p.fileName === file.name)
    );

    if (filesToProcess.length === 0) return;

    const fileProcessingPromises = filesToProcess.map((file) => {
      return new Promise<ImagePreview>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUri = e.target?.result as string;
          if (!dataUri) return reject(new Error('Failed to read file.'));
          try {
            const result = await optimizeImageAndFlag({ imageDataUri: dataUri });
            resolve({
              fileName: file.name,
              dataUri: result.optimizedImageDataUri || dataUri,
              flagged: result.flagForReview,
              reason: result.reason,
            });
          } catch (error) {
            resolve({
              fileName: file.name,
              dataUri,
              flagged: true,
              reason: 'Optimization failed.',
            });
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    try {
      const newPreviews = await Promise.all(fileProcessingPromises);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        variant: 'destructive',
        title: 'Image Upload Error',
        description: 'There was a problem reading one of the files.',
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const removeImage = (fileName: string) => {
    setImagePreviews(previews => previews.filter(p => p.fileName !== fileName));
  };

  async function onSubmit(data: VehicleFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, String(value));
      }
    });

    try {
      const result = vehicle 
        ? await updateVehicle(vehicle.id, formData)
        : await createVehicle(formData);
      
      if ('message' in result) {
        toast({
          title: "Success",
          description: result.message,
        });
        router.push("/admin/vehicles");
      } else {
        throw new Error("An unknown error occurred.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="make">Make</Label>
           <Select onValueChange={(v) => form.setValue('make', v)} defaultValue={form.getValues('make')}>
            <SelectTrigger><SelectValue placeholder="Select a make" /></SelectTrigger>
            <SelectContent>
              {makes.map((make) => (
                <SelectItem key={make} value={make}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.make && <p className="text-sm text-destructive">{form.formState.errors.make.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...form.register("model")} />
           {form.formState.errors.model && <p className="text-sm text-destructive">{form.formState.errors.model.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" {...form.register("year")} />
           {form.formState.errors.year && <p className="text-sm text-destructive">{form.formState.errors.year.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="chassisNumber">Chassis Number</Label>
          <Input id="chassisNumber" {...form.register("chassisNumber")} />
           {form.formState.errors.chassisNumber && <p className="text-sm text-destructive">{form.formState.errors.chassisNumber.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" type="number" {...form.register("price")} />
           {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mileage">Mileage (km)</Label>
          <Input id="mileage" type="number" {...form.register("mileage")} />
           {form.formState.errors.mileage && <p className="text-sm text-destructive">{form.formState.errors.mileage.message}</p>}
        </div>
         <div className="grid gap-2">
          <Label>Fuel Type</Label>
          <Select onValueChange={(v) => form.setValue('fuel', v as any)} defaultValue={form.getValues('fuel')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Condition</Label>
          <Select onValueChange={(v) => form.setValue('condition', v as any)} defaultValue={form.getValues('condition')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Used">Used</SelectItem>
              <SelectItem value="Damaged">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Availability Status</Label>
          <Select onValueChange={(v) => form.setValue('status', v as any)} defaultValue={form.getValues('status')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Incoming">Incoming</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Inspection Status</Label>
          <Select onValueChange={(v) => form.setValue('inspectionStatus', v as any)} defaultValue={form.getValues('inspectionStatus')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Passed">Passed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
          <CardDescription>Upload images for the vehicle. The first image will be the featured one.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             <label
                htmlFor="file-upload"
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={cn(
                    "w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition-colors",
                    isDragging && "bg-accent/10 border-accent"
                )}
            >
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP</p>
            </label>
            <Input id="file-upload" type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/jpeg,image/png,image/webp" />

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((img) => (
                  <div key={img.fileName} className="relative group aspect-video rounded-lg overflow-hidden border">
                    <Image src={img.dataUri} alt={img.fileName} fill className="object-cover" />
                    <div className="absolute top-1 right-1">
                      <Button variant="destructive" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(img.fileName)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {img.flagged ? (
                      <div className="absolute inset-0 bg-destructive/80 flex flex-col items-center justify-center p-2 text-destructive-foreground text-center">
                        <AlertCircle className="h-6 w-6" />
                        <p className="text-xs font-semibold mt-1">{img.reason}</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Vehicle"}
        </Button>
      </div>
    </form>
  );
}
