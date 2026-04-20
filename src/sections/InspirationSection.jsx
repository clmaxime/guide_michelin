import { Card } from "@/components/ui/card";
import { useContentStore } from "@/store/content-store";
import SectionTitle from "../components/SectionTitle";

function InspirationSection() {
  const inspirationCards = useContentStore((state) => state.inspirationCards);

  return (
    <section className="py-16 md:py-20 xl:py-24" id="inspiration">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <SectionTitle
          eyebrow="Inspiration"
          subtitle="Selections editoriales pour preparer vos prochaines experiences."
          title="Moments a vivre"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {inspirationCards.map((card) => (
            <Card className="overflow-hidden rounded-2xl transition duration-300 hover:scale-[1.01] hover:shadow-[0_12px_30px_rgba(17,17,17,0.12)]" key={card.title}>
              <img alt={card.title} className="aspect-[16/9] w-full object-cover" loading="lazy" src={card.image} />
              <h3 className="px-3.5 pb-4 pt-3 text-base font-semibold">{card.title}</h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InspirationSection;
