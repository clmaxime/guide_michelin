import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { michelinHotels } from "@/data/michelin-hotels";

function formatLocation(slug) {
  if (!slug) {
    return "Destination Michelin";
  }

  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // ignore malformed URI sequence
  }

  return decoded
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function HotelsPage() {
  return (
    <main className="bg-secondary py-16 md:py-20 xl:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">Guide Michelin</p>
            <h1 className="font-title text-[2rem] leading-[1.1] md:text-[2.5rem]">Hôtels du site officiel</h1>
            <p className="mt-2 max-w-[50rem] text-muted-foreground">
              Cartes alimentées depuis `guide.michelin.com/fr/fr/hotels` (nom, image et lien vers la fiche).
            </p>
          </div>
          <Link className={buttonVariants({ className: "rounded-full px-5 py-2 text-sm" })} to="/">
            Retour à l'accueil
          </Link>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {michelinHotels.map((hotel) => (
            <Card className="overflow-hidden rounded-2xl" key={hotel.url}>
              <img alt={hotel.name} className="h-52 w-full object-cover" loading="lazy" src={hotel.image} />
              <CardContent className="p-4 pt-4">
                <CardTitle className="mb-1 text-[1.15rem]">{hotel.name}</CardTitle>
                <p className="mb-3 text-sm text-muted-foreground">{formatLocation(hotel.locationSlug)}</p>
                <a className="text-sm font-semibold text-primary hover:underline" href={hotel.url} rel="noopener noreferrer" target="_blank">
                  Ouvrir la fiche Michelin
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default HotelsPage;
