import { Card } from "@/components/ui/card";
import { useContentStore } from "@/store/content-store";
import SectionTitle from "../components/SectionTitle";

function ArticlesSection() {
  const articleCards = useContentStore((state) => state.articleCards);

  return (
    <section className="bg-secondary py-16 md:py-20 xl:py-24">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <SectionTitle
          eyebrow="Articles"
          subtitle="Reportages, portraits et carnets d'adresses pour enrichir chaque voyage."
          title="Derniers recits"
        />
        <div className="grid gap-4 xl:grid-cols-4">
          {articleCards.map((card) => (
            <Card className="flex gap-3 overflow-hidden rounded-2xl transition duration-300 hover:scale-[1.01] hover:shadow-[0_12px_30px_rgba(17,17,17,0.12)] xl:block" key={card.title}>
              <img
                alt={card.title}
                className="min-h-[6.6rem] w-[38%] object-cover xl:w-full"
                loading="lazy"
                src={card.image}
              />
              <div className="p-3 xl:p-4">
                <h3 className="font-title mb-1.5 text-[1.2rem]">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.excerpt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticlesSection;
