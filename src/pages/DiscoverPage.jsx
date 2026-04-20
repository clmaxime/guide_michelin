import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import DishCard from "../features/dish-tinder/DishCard";
import SwipePlaceholder from "../features/dish-tinder/SwipePlaceholder";

function DiscoverPage() {
  return (
    <main className="bg-secondary py-16 md:py-20 xl:py-24">
      <div className="mx-auto grid min-h-[70vh] w-full max-w-[1220px] place-content-center items-center gap-5 px-4 md:px-7">
        <DishCard />
        <SwipePlaceholder />
        <Link className={buttonVariants({ className: "w-fit", variant: "link" })} to="/">
          Retour a l'accueil
        </Link>
      </div>
    </main>
  );
}

export default DiscoverPage;
