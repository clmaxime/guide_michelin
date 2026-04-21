import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAPBOX_ACCESS_TOKEN, searchPlaces } from "@/lib/mapbox";
import { useContentStore } from "@/store/content-store";

function HeroSection() {
  const heroAssets = useContentStore((state) => state.heroAssets);
  const navigate = useNavigate();
  const [points, setPoints] = useState({
    start: { query: "", feature: null },
    end: { query: "", feature: null },
  });
  const [activeField, setActiveField] = useState("start");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isTokenMissing = !MAPBOX_ACCESS_TOKEN;
  const activeQuery = points[activeField].query;
  const hasValidPoints = Boolean(points.start.feature && points.end.feature);

  useEffect(() => {
    if (isTokenMissing) {
      return;
    }

    const trimmedQuery = activeQuery.trim();
    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const results = await searchPlaces(trimmedQuery, controller.signal);
        setSuggestions(results);
      } catch (error) {
        if (error.name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 280);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [activeQuery, activeField, isTokenMissing]);

  const suggestionTitle = useMemo(
    () => (activeField === "start" ? "Point de départ" : "Point d'arrivée"),
    [activeField],
  );

  const updateQuery = (field, value) => {
    setActiveField(field);
    setErrorMessage("");
    setPoints((prev) => ({
      ...prev,
      [field]: {
        query: value,
        feature: null,
      },
    }));
  };

  const selectSuggestion = (feature) => {
    setPoints((prev) => ({
      ...prev,
      [activeField]: {
        query: feature.place_name,
        feature,
      },
    }));
    setSuggestions([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasValidPoints) {
      setErrorMessage("Selectionne une adresse valide pour les points A et B.");
      return;
    }

    const [fromLng, fromLat] = points.start.feature.center;
    const [toLng, toLat] = points.end.feature.center;
    const params = new URLSearchParams({
      fromLng: String(fromLng),
      fromLat: String(fromLat),
      toLng: String(toLng),
      toLat: String(toLat),
      fromLabel: points.start.feature.place_name,
      toLabel: points.end.feature.place_name,
    });

    navigate(`/itinerary?${params.toString()}`);
  };

  return (
    <section className="relative grid min-h-screen items-end overflow-x-hidden overflow-y-visible pb-8 pt-[5.5rem] text-white md:pb-12" id="top">
      <img alt="" className="absolute inset-0 h-full w-full object-cover brightness-[0.85]" src={heroAssets.background} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,0,35,0.14),rgba(17,17,17,0.52)_45%,rgba(17,17,17,0.7))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <p className="mb-3 text-[0.85rem] font-bold uppercase tracking-[0.08em] text-[#ffbec7]">Découvrez</p>
        <h1 className="font-title text-[2.2rem] leading-[1.08] sm:text-[2.7rem] md:text-[3.2rem] xl:text-[4.2rem]">
          Le meilleur de la gastronomie et de l'hospitalité
        </h1>
        <form
          className="mt-6 grid gap-2 rounded-2xl border border-white/30 bg-white/15 p-2 backdrop-blur-[5px] md:max-w-[52rem] md:grid-cols-[1fr_auto]"
          onSubmit={handleSubmit}
          role="search"
        >
          <div className="relative">
            <div className="rounded-xl bg-black/25 px-4 py-2.5">
              <div className="grid gap-2 md:grid-cols-2 md:gap-3">
                <label className="block rounded-lg md:border-r md:border-white/20 md:pr-3">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-white/80">Point A</span>
                  <Input
                    className="h-7 border-0 bg-transparent p-0 text-white placeholder:text-white/75 focus-visible:ring-0"
                    onChange={(event) => updateQuery("start", event.target.value)}
                    onFocus={() => setActiveField("start")}
                    placeholder="Adresse de départ"
                    value={points.start.query}
                  />
                </label>
                <label className="block rounded-lg md:pl-1">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-white/80">Point B</span>
                  <Input
                    className="h-7 border-0 bg-transparent p-0 text-white placeholder:text-white/75 focus-visible:ring-0"
                    onChange={(event) => updateQuery("end", event.target.value)}
                    onFocus={() => setActiveField("end")}
                    placeholder="Adresse d'arrivée"
                    value={points.end.query}
                  />
                </label>
              </div>
            </div>
            {(isLoadingSuggestions || suggestions.length > 0) && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-50 rounded-xl border border-white/25 bg-[#141414]/95 p-1 shadow-lg backdrop-blur-sm md:bottom-[calc(100%+0.45rem)] md:top-auto">
                {isLoadingSuggestions && <p className="px-3 py-2 text-sm text-white/75">Recherche d’adresses...</p>}
                {!isLoadingSuggestions &&
                  suggestions.map((feature) => (
                    <button
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white transition hover:bg-white/10"
                      key={feature.id}
                      onClick={() => selectSuggestion(feature)}
                      type="button"
                    >
                      <span className="block text-[0.67rem] uppercase tracking-[0.08em] text-[#ffbec7]">{suggestionTitle}</span>
                      {feature.place_name}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <Button className="min-h-12 rounded-xl text-base font-bold md:min-w-44" disabled={isTokenMissing || !hasValidPoints} type="submit">
            <Search className="size-4" />
            Activer / Rechercher
          </Button>
        </form>
        {isTokenMissing && <p className="mt-3 text-sm text-[#ffbec7]">Configuration Mapbox manquante : ajoute `VITE_MAPBOX_ACCESS_TOKEN` dans `.env`.</p>}
        {errorMessage && <p className="mt-3 text-sm text-[#ffbec7]">{errorMessage}</p>}
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
