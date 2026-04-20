import { Card } from "@/components/ui/card";
import { useContentStore } from "@/store/content-store";
import SectionTitle from "../components/SectionTitle";

function DestinationsSection() {
  const destinationCards = useContentStore((state) => state.destinationCards);

  return (
    <section className="py-16 md:py-20 xl:py-24" id="destinations">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <SectionTitle
          eyebrow="Destinations"
          subtitle="Inspirez-vous par pays pour reserver les adresses les plus recommandees."
          title="Ou partir prochainement"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {destinationCards.map((card) => (
            <Card className="relative overflow-hidden rounded-2xl border-none p-0 transition duration-300 hover:scale-[1.015] hover:shadow-[0_12px_30px_rgba(17,17,17,0.12)]" key={card.title}>
              <img alt={card.title} className="aspect-[16/9] w-full object-cover" loading="lazy" src={card.image} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 p-4">
                <h3 className="font-title absolute bottom-4 left-4 text-[1.4rem] text-white">{card.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DestinationsSection;
