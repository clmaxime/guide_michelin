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
    <section className="bg-white py-16 md:py-20 xl:py-24" id="hotels">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <div className="mb-6">
          <SectionTitle
            eyebrow="Hôtels Michelin"
            subtitle="Une sélection visuelle d'adresses extraites du Guide Michelin pour inspirer les prochaines réservations."
            title="8 propositions d'hôtels au hasard"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {randomHotels.map((hotel) => (
            <Card
              className="overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(17,17,17,0.08)]"
              key={hotel.url}
            >
              <img alt={hotel.name} className="h-48 w-full object-cover" loading="lazy" src={hotel.image} />
              <CardContent className="p-4 pt-4">
                <CardTitle className="mb-1 line-clamp-2 text-[1.15rem] text-[#111111]">{hotel.name}</CardTitle>
                <p className="mb-3 text-sm text-[#7a7a7a]">{formatLocation(hotel.locationSlug)}</p>
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
            className={buttonVariants({ className: "h-11 rounded-full px-8 text-sm font-semibold" })}
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
