import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
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

function shuffle(list) {
  const clone = [...list];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function FeaturedHotelsSection() {
  const randomHotels = useMemo(() => shuffle(michelinHotels).slice(0, 8), []);

  return (
    <section className="bg-[#0b0b0d] py-16 md:py-20 xl:py-24" id="hotels">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <div className="mb-6">
          <SectionTitle
            dark
            eyebrow="Hôtels Michelin"
            subtitle="Une sélection visuelle d'adresses extraites du Guide Michelin pour inspirer les prochaines réservations."
            title="8 propositions d'hôtels au hasard"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {randomHotels.map((hotel) => (
            <Card
              className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(0,0,0,0.45)]"
              key={hotel.url}
            >
              <img alt={hotel.name} className="h-48 w-full object-cover" loading="lazy" src={hotel.image} />
              <CardContent className="p-4 pt-4">
                <CardTitle className="mb-1 line-clamp-2 text-[1.15rem] text-white">{hotel.name}</CardTitle>
                <p className="mb-3 text-sm text-white/60">{formatLocation(hotel.locationSlug)}</p>
                <a
                  className="text-sm font-semibold text-primary hover:underline"
                  href={hotel.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Voir sur guide.michelin.com
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            className={buttonVariants({ className: "h-11 rounded-full border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white hover:bg-white/20" })}
            to="/hotels"
          >
            Voir tous les hôtels du Guide Michelin
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedHotelsSection;
