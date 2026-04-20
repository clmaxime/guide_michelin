import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useContentStore } from "@/store/content-store";
import SectionTitle from "../components/SectionTitle";

function CategoriesSection() {
  const categoryCards = useContentStore((state) => state.categoryCards);

  return (
    <section className="bg-secondary py-16 md:py-20 xl:py-24" id="restaurants">
      <div className="mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <SectionTitle
          eyebrow="Categories"
          subtitle="Deux univers signatures pour reserver selon votre envie."
          title="Restaurants et Hotels"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {categoryCards.map((card) => (
            <Card className="overflow-hidden rounded-2xl transition duration-300 hover:scale-[1.01] hover:shadow-[0_12px_30px_rgba(17,17,17,0.12)]" key={card.title}>
              <img alt={card.title} className="h-48 w-full object-cover" loading="lazy" src={card.image} />
              <CardContent className="p-4 pt-4">
                <CardTitle className="mb-1.5 text-[1.55rem]">{card.title}</CardTitle>
                <p className="text-muted-foreground">{card.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
