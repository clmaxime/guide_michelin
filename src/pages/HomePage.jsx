import { useEffect } from "react";
import ArticlesSection from "../sections/ArticlesSection";
import CategoriesSection from "../sections/CategoriesSection";
import DestinationsSection from "../sections/DestinationsSection";
import FeaturedHotelsSection from "../sections/FeaturedHotelsSection";
import FooterSection from "../sections/FooterSection";
import HeaderSection from "../sections/HeaderSection";
import HeroSection from "../sections/HeroSection";
import InspirationSection from "../sections/InspirationSection";
import { useUiStore } from "@/store/ui-store";

function HomePage() {
  const setScrolled = useUiStore((state) => state.setScrolled);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <HeaderSection />
      <main>
        <HeroSection />
        <FeaturedHotelsSection />
        <CategoriesSection />
        <InspirationSection />
        <ArticlesSection />
        <DestinationsSection />
      </main>
      <FooterSection />
    </>
  );
}

export default HomePage;
