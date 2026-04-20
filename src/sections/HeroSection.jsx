import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContentStore } from "@/store/content-store";
import { useUiStore } from "@/store/ui-store";

function HeroSection() {
  const heroAssets = useContentStore((state) => state.heroAssets);
  const searchFields = useContentStore((state) => state.searchFields);
  const search = useUiStore((state) => state.search);
  const setSearchField = useUiStore((state) => state.setSearchField);

  return (
    <section className="relative grid min-h-screen items-end overflow-hidden pb-8 pt-[5.5rem] text-white md:pb-12" id="top">
      <img alt="" className="absolute inset-0 h-full w-full object-cover brightness-[0.85]" src={heroAssets.background} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,0,35,0.14),rgba(17,17,17,0.52)_45%,rgba(17,17,17,0.7))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <p className="mb-3 text-[0.85rem] font-bold uppercase tracking-[0.08em] text-[#ffbec7]">Decouvrez</p>
        <h1 className="font-title text-[2.2rem] leading-[1.08] sm:text-[2.7rem] md:text-[3.2rem] xl:text-[4.2rem]">
          Le meilleur de la gastronomie et de l'hospitalite
        </h1>
        <form className="mt-6 grid gap-2 rounded-2xl border border-white/30 bg-white/15 p-2 backdrop-blur-[5px] md:max-w-[52rem] md:grid-cols-[1fr_1fr_1fr_auto]" role="search">
          {searchFields.map((field) => (
            <label className="flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2.5" key={field.key}>
              <img alt="" className="w-4 brightness-[2.2]" src={field.icon} />
              <Input
                className="h-8 border-0 bg-transparent p-0 text-white placeholder:text-white/75 focus-visible:ring-0"
                onChange={(event) => setSearchField(field.key, event.target.value)}
                placeholder={field.label}
                value={search[field.key]}
              />
            </label>
          ))}
          <Button className="min-h-11 rounded-xl text-base font-bold" type="button">
            Rechercher
          </Button>
        </form>
      </div>
      <div className="relative z-10 grid grid-cols-3 gap-2 px-4 md:max-w-[34rem] md:justify-self-end md:pr-7 xl:absolute xl:bottom-[3.3rem] xl:right-0 xl:px-0 xl:pr-8">
        <img
          alt="Plat signature"
          className="h-[5.6rem] w-full rounded-xl object-cover shadow-[0_12px_30px_rgba(17,17,17,0.12)] transition duration-300 hover:scale-[1.03] md:h-32"
          loading="lazy"
          src={heroAssets.dish}
        />
        <img
          alt="Accord vin"
          className="h-[5.6rem] w-full rounded-xl object-cover shadow-[0_12px_30px_rgba(17,17,17,0.12)] transition duration-300 hover:scale-[1.03] md:h-32"
          loading="lazy"
          src={heroAssets.wine}
        />
        <img
          alt="Detail de table"
          className="h-[5.6rem] w-full rounded-xl object-cover shadow-[0_12px_30px_rgba(17,17,17,0.12)] transition duration-300 hover:scale-[1.03] md:h-32"
          loading="lazy"
          src={heroAssets.detail}
        />
      </div>
    </section>
  );
}

export default HeroSection;
