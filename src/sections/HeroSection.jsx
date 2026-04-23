import { useEffect, useMemo, useState } from "react";
import { Locate, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAPBOX_ACCESS_TOKEN, reverseGeocode, searchPlaces } from "@/lib/mapbox";
import { useContentStore } from "@/store/content-store";
import { useRestaurantStore } from "@/store/restaurant-store";

export default function HeroSection() {
  const heroAssets = useContentStore((state) => state.heroAssets);
  const { restaurants, fetchAll } = useRestaurantStore();
  const [bgImage, setBgImage] = useState(null);
  const navigate = useNavigate();
  const [points, setPoints] = useState({ start: { query: "", feature: null }, end: { query: "", feature: null } });
  const [activeField, setActiveField] = useState("start");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [maxDistanceKm, setMaxDistanceKm] = useState(5);
  const [isGeolocating, setIsGeolocating] = useState(false);

  useEffect(() => {
    if (restaurants.length === 0) fetchAll();
  }, [fetchAll, restaurants.length]);

  useEffect(() => {
    const withImages = restaurants.filter((restaurant) => restaurant.imageUrls?.length > 0);
    if (withImages.length === 0) return;
    const restaurant = withImages[Math.floor(Math.random() * withImages.length)];
    const images = restaurant.imageUrls;
    setBgImage(images[Math.floor(Math.random() * images.length)]);
  }, [restaurants]);

  const isTokenMissing = !MAPBOX_ACCESS_TOKEN;
  const activeQuery = points[activeField].query;
  const hasValidPoints = Boolean(points.start.feature && points.end.feature);

  useEffect(() => {
    if (isTokenMissing) return;
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
        if (error.name !== "AbortError") setSuggestions([]);
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
    setPoints((prev) => ({ ...prev, [field]: { query: value, feature: null } }));
  };

  const selectSuggestion = (feature) => {
    setPoints((prev) => ({ ...prev, [activeField]: { query: feature.place_name, feature } }));
    setSuggestions([]);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const feature = await reverseGeocode(coords.longitude, coords.latitude);
          if (feature) {
            setPoints((prev) => ({ ...prev, start: { query: feature.place_name, feature } }));
          }
        } finally {
          setIsGeolocating(false);
        }
      },
      () => setIsGeolocating(false),
      { timeout: 8000 },
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasValidPoints) {
      setErrorMessage("Sélectionne une adresse valide pour les points A et B.");
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
      maxDistanceKm: String(maxDistanceKm),
    });
    navigate(`/itinerary?${params.toString()}`);
  };

  return (
    <section className="relative grid min-h-screen items-end overflow-x-hidden overflow-y-visible pb-8 pt-[5.5rem] text-white" id="top">
      <img alt="" className="absolute inset-0 h-full w-full object-cover brightness-[0.75]" src={bgImage ?? heroAssets.background} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,0,35,0.14),rgba(17,17,17,0.52)_45%,rgba(17,17,17,0.7))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1220px] px-4 md:px-7">
        <p className="mb-3 text-[0.85rem] font-bold uppercase tracking-[0.08em] text-[#ffbec7]">Découvrez</p>
        <h1 className="font-title text-[2.2rem] leading-[1.08] sm:text-[2.7rem] md:text-[3.2rem] xl:text-[4.2rem]">Des cuisines de prestige vous attendent sur la route</h1>
        <form className="mt-6 grid gap-2 rounded-2xl border border-white/30 bg-white/15 p-2 backdrop-blur-[5px] md:max-w-[52rem] md:grid-cols-[1fr_auto]" onSubmit={handleSubmit} role="search">
          <div className="relative">
            <div className="rounded-xl bg-black/25 px-4 py-2.5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <label className="flex min-w-0 flex-1 flex-col">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-white/80">Lieu de départ</span>
                  <div className="flex items-center gap-2">
                    <Input className="h-7 flex-1 border-0 bg-transparent p-0 text-white placeholder:text-white/75 focus-visible:ring-0" onChange={(event) => updateQuery("start", event.target.value)} onFocus={() => setActiveField("start")} placeholder="Adresse de départ" value={points.start.query} />
                    <button type="button" onClick={handleGeolocate} disabled={isGeolocating || isTokenMissing} className="shrink-0 rounded-md p-1 text-white/50 transition hover:text-white disabled:opacity-30">
                      <Locate className={`size-4 ${isGeolocating ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
                </label>
                <div className="h-px w-full bg-white/20 md:h-9 md:w-px md:shrink-0" />
                <label className="flex min-w-0 flex-1 flex-col">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-white/80">Lieu d'arrivée</span>
                  <Input className="h-7 border-0 bg-transparent p-0 text-white placeholder:text-white/75 focus-visible:ring-0" onChange={(event) => updateQuery("end", event.target.value)} onFocus={() => setActiveField("end")} placeholder="Adresse d'arrivée" value={points.end.query} />
                </label>
              </div>
            </div>
            {isLoadingSuggestions || suggestions.length > 0 ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-50 rounded-xl border border-white/25 bg-[#141414]/95 p-1 shadow-lg backdrop-blur-sm md:bottom-[calc(100%+0.45rem)] md:top-auto">
                {isLoadingSuggestions ? <p className="px-3 py-2 text-sm text-white/75">Recherche d'adresses...</p> : null}
                {!isLoadingSuggestions
                  ? suggestions.map((feature) => (
                      <button className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white transition hover:bg-white/10" key={feature.id} onClick={() => selectSuggestion(feature)} type="button">
                        <span className="block text-[0.67rem] uppercase tracking-[0.08em] text-[#ffbec7]">{suggestionTitle}</span>
                        {feature.place_name}
                      </button>
                    ))
                  : null}
              </div>
            ) : null}
          </div>
          <Button className="h-full min-h-12 w-full rounded-xl text-base font-bold md:w-auto md:min-w-44" disabled={isTokenMissing || !hasValidPoints} type="submit">
            <Search className="size-4" />
            Rechercher
          </Button>
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 backdrop-blur-sm md:col-span-2">
            <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-white/80">Écart max au trajet</span>
            <input type="range" min={1} max={100} value={maxDistanceKm} onChange={(event) => setMaxDistanceKm(Number(event.target.value))} className="flex-1 accent-[#e60023]" />
            <span className="w-14 shrink-0 text-right text-sm font-semibold text-white">{maxDistanceKm} km</span>
          </div>
        </form>
        {isTokenMissing ? <p className="mt-3 text-sm text-[#ffbec7]">Configuration Mapbox manquante : ajoute `VITE_MAPBOX_ACCESS_TOKEN` dans `.env`.</p> : null}
        {errorMessage ? <p className="mt-3 text-sm text-[#ffbec7]">{errorMessage}</p> : null}
      </div>
    </section>
  );
}
