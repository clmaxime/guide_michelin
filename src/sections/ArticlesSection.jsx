import { Card } from "@/components/ui/card";
import { useContentStore } from "@/store/content-store";
import SectionTitle from "../components/SectionTitle";

function ArticlesSection() {
  const articleCards = useContentStore((state) => state.articleCards);

  return (
    <section className="bg-[#0f0f0f] py-16 md:py-20 xl:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <SectionTitle
          dark
          eyebrow="Articles"
          subtitle="Reportages, portraits et carnets d'adresses pour enrichir chaque voyage."
          title="Derniers récits"
        />
        <div className="grid gap-4 xl:grid-cols-4">
          {articleCards.map((card) => (
            <Card
              className="flex gap-3 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] text-white transition duration-300 hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(0,0,0,0.45)] xl:block"
              key={card.title}
            >
              <img
                alt={card.title}
                className="min-h-[6.6rem] w-[38%] object-cover xl:w-full"
                loading="lazy"
                src={card.image}
              />
              <div className="p-3 xl:p-4">
                <h3 className="mb-1.5 font-title text-[1.2rem] text-white">{card.title}</h3>
                <p className="text-sm text-white/65">{card.excerpt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticlesSection;
