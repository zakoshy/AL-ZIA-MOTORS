import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { FeaturedVehicles } from '@/app/components/featured-vehicles';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-mercedes');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-background">
        {heroImage && (
          <>
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority={true}
              data-ai-hint={heroImage.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </>
        )}

        <div className="absolute inset-0 h-full flex flex-col items-center justify-center text-center text-primary-foreground p-4 z-10">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
            Premium Japanese & Thailand Vehicles
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-3xl drop-shadow-md">
            Directly imported for the discerning enthusiast. Quality,
            reliability, and performance delivered.
          </p>
          <Button asChild size="lg" className="mt-8 text-lg">
            <Link href="/vehicles">
              View Inventory <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">
            Featured Vehicles
          </h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            A curated selection of our finest available cars. Explore the best
            of JDM culture.
          </p>
          <FeaturedVehicles />
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/vehicles">Explore All Vehicles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
