import { useEffect } from "react";
import ArticlesSection from "../sections/ArticlesSection";
import FeaturedHotelsSection from "../sections/FeaturedHotelsSection";
import FeaturedRestaurantsSection from "../sections/FeaturedRestaurantsSection";
import FooterSection from "../sections/FooterSection";
import HeaderSection from "../sections/HeaderSection";
import HeroSection from "../sections/HeroSection";
import TinderTeaserSection from "../sections/TinderTeaserSection";
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
        <FeaturedRestaurantsSection />
        <FeaturedHotelsSection />
        <TinderTeaserSection />
        <ArticlesSection />
      </main>
      <FooterSection />
    </>
  );
}

export default HomePage;
