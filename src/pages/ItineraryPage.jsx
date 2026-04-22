import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, MapPin, Pencil, RefreshCw, Search, Star, X } from "lucide-react";
import { MichelinStars } from "@/components/MichelinStars";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRoute, MAPBOX_ACCESS_TOKEN, searchPlaces } from "@/lib/mapbox";
import { restaurantApi } from "@/lib/api";

const DAY_ORDER = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];

function parseCoordinate(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}


function RestaurantCard({ restaurant }) {
  const image = restaurant.imageUrls?.[0];
  const todayIndex = new Date().getDay();
  const todayKey = DAY_ORDER[todayIndex === 0 ? 6 : todayIndex - 1];
  const todayHoraire = restaurant.horaires?.find((h) => h.jour === todayKey);

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group relative flex aspect-[3/4] overflow-hidden rounded-2xl"
    >
      {image ? (
        <img
          src={image}
          alt={restaurant.nom}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute left-3 top-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 px-2.5 py-1">
        <MichelinStars count={restaurant.distinction} />
      </div>

      {restaurant.distance != null && (
        <div className="absolute right-3 top-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 px-2.5 py-1 text-xs text-white/80 font-medium">
          {restaurant.distance} km
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-white/10 border-t border-white/15 p-4 transition-all duration-300 group-hover:bg-white/15">
        <h3 className="font-title text-white text-lg font-semibold leading-tight mb-1">
          {restaurant.nom}
        </h3>
        <div className="flex items-start gap-1 mb-2">
          <MapPin className="size-3 text-white/50 mt-0.5 shrink-0" />
          <p className="text-white/50 text-xs line-clamp-1">{restaurant.adresse}</p>
        </div>
        {todayHoraire?.creneaux?.length > 0 ? (
          <p className="text-xs text-emerald-400 font-medium">
            Ouvert · {todayHoraire.creneaux[0].ouverture}–{todayHoraire.creneaux[0].fermeture}
          </p>
        ) : (
          <p className="text-xs text-white/30">Horaires non renseignés</p>
        )}
        <div className="mt-3 flex items-center gap-1 text-xs text-white/60 group-hover:text-white transition-colors">
          Voir la fiche <ArrowRight className="size-3" />
        </div>
      </div>
    </Link>
  );
}

function ItineraryPage() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const restaurantMarkersRef = useRef([]);
  const routeCoordsRef = useRef(null);

  const [searchParams] = useSearchParams();
  const [routeInfo, setRouteInfo] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [appliedDistance, setAppliedDistance] = useState(null);

  // Edit route form state
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [editPoints, setEditPoints] = useState({ start: { query: "", feature: null }, end: { query: "", feature: null } });
  const [editActiveField, setEditActiveField] = useState("start");
  const [editSuggestions, setEditSuggestions] = useState([]);
  const [editLoadingSugg, setEditLoadingSugg] = useState(false);

  const initialDistance = useMemo(() => {
    const v = Number(searchParams.get("maxDistanceKm"));
    return v >= 1 && v <= 100 ? v : 5;
  }, [searchParams]);

  const [maxDistanceKm, setMaxDistanceKm] = useState(initialDistance);

  // Keep slider in sync when URL changes (after edit submit)
  useEffect(() => {
    setMaxDistanceKm(initialDistance);
  }, [initialDistance]);

  const from = useMemo(
    () => ({
      lng: parseCoordinate(searchParams.get("fromLng")),
      lat: parseCoordinate(searchParams.get("fromLat")),
      label: searchParams.get("fromLabel") ?? "Lieu de départ",
    }),
    [searchParams],
  );

  const to = useMemo(
    () => ({
      lng: parseCoordinate(searchParams.get("toLng")),
      lat: parseCoordinate(searchParams.get("toLat")),
      label: searchParams.get("toLabel") ?? "Lieu d'arrivée",
    }),
    [searchParams],
  );

  const hasValidCoordinates = [from.lng, from.lat, to.lng, to.lat].every((v) => v !== null);

  // Autocomplete for edit form
  useEffect(() => {
    if (!isEditingRoute) return;
    const q = editPoints[editActiveField]?.query.trim() ?? "";
    if (q.length < 3) { setEditSuggestions([]); return; }

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setEditLoadingSugg(true);
        const results = await searchPlaces(q, ctrl.signal);
        setEditSuggestions(results);
      } catch (e) {
        if (e.name !== "AbortError") setEditSuggestions([]);
      } finally {
        setEditLoadingSugg(false);
      }
    }, 280);

    return () => { ctrl.abort(); clearTimeout(timer); };
  }, [editPoints, editActiveField, isEditingRoute]);

  const openEditRoute = () => {
    setEditPoints({
      start: { query: from.label, feature: { place_name: from.label, center: [from.lng, from.lat] } },
      end: { query: to.label, feature: { place_name: to.label, center: [to.lng, to.lat] } },
    });
    setEditSuggestions([]);
    setIsEditingRoute(true);
  };

  const updateEditQuery = (field, value) => {
    setEditActiveField(field);
    setEditPoints((prev) => ({ ...prev, [field]: { query: value, feature: null } }));
  };

  const selectEditSuggestion = (feature) => {
    setEditPoints((prev) => ({ ...prev, [editActiveField]: { query: feature.place_name, feature } }));
    setEditSuggestions([]);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const { start, end } = editPoints;
    if (!start.feature || !end.feature) return;
    const [fromLng, fromLat] = start.feature.center;
    const [toLng, toLat] = end.feature.center;
    const params = new URLSearchParams({
      fromLng: String(fromLng),
      fromLat: String(fromLat),
      toLng: String(toLng),
      toLat: String(toLat),
      fromLabel: start.feature.place_name,
      toLabel: end.feature.place_name,
      maxDistanceKm: String(maxDistanceKm),
    });
    setIsEditingRoute(false);
    navigate(`/itinerary?${params.toString()}`);
  };

  const hasValidEditPoints = Boolean(editPoints.start.feature && editPoints.end.feature);

  // --- Map & restaurants logic ---

  const placeRestaurantMarkers = (rests) => {
    const map = mapRef.current;
    if (!map) return;

    restaurantMarkersRef.current.forEach((m) => m.remove());
    restaurantMarkersRef.current = [];

    rests.forEach((restaurant) => {
      if (restaurant.latitude == null || restaurant.longitude == null) return;

      const el = document.createElement("div");
      el.style.cssText = `
        width: 30px; height: 30px;
        background: #c9a227;
        border-radius: 50%;
        border: 2px solid white;
        display: flex; align-items: center; justify-content: center;
        color: white; font-size: 10px; font-weight: 700;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer; letter-spacing: -1px;
      `;
      el.textContent = "★".repeat(restaurant.distinction);

      const popup = new mapboxgl.Popup({ offset: 15, maxWidth: "220px" }).setHTML(`
        <div style="font-family:sans-serif;padding:2px 0;line-height:1.5">
          <div style="font-weight:600;font-size:13px">${restaurant.nom}</div>
          <div style="color:#c9a227;font-size:12px">${"★".repeat(restaurant.distinction)}</div>
          <div style="font-size:11px;color:#666;margin-top:2px">${restaurant.adresse}</div>
          <div style="font-size:11px;color:#e60023;margin-top:4px;font-weight:500">${restaurant.distance} km du trajet</div>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([restaurant.longitude, restaurant.latitude])
        .setPopup(popup)
        .addTo(map);

      restaurantMarkersRef.current.push(marker);
    });
  };

  const fetchRestaurants = async (coords, distance) => {
    setRestaurantsLoading(true);
    const rests = await restaurantApi
      .findAlongRoute({ coordinates: coords, maxDistanceKm: distance })
      .catch(() => []);
    setRestaurants(rests);
    setAppliedDistance(distance);
    setRestaurantsLoading(false);
    placeRestaurantMarkers(rests);
  };

  const handleRelaunch = () => {
    if (!routeCoordsRef.current || restaurantsLoading) return;
    fetchRestaurants(routeCoordsRef.current, maxDistanceKm);
  };

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      setErrorMessage("Token Mapbox introuvable. Ajoute VITE_MAPBOX_ACCESS_TOKEN dans le fichier .env.");
      return;
    }
    if (!hasValidCoordinates) {
      setErrorMessage("Coordonn�es invalides. Lance une nouvelle recherche depuis la page d'accueil.");
      return;
    }

    setErrorMessage("");
    setRouteInfo(null);
    setRestaurants([]);
    setAppliedDistance(null);
    routeCoordsRef.current = null;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [from.lng, from.lat],
      zoom: 11,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const originMarker = new mapboxgl.Marker({ color: "#1f8b4c" })
      .setLngLat([from.lng, from.lat])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(`Départ : ${from.label}`))
      .addTo(map);

    const destinationMarker = new mapboxgl.Marker({ color: "#e60023" })
      .setLngLat([to.lng, to.lat])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(`Arrivée : ${to.label}`))
      .addTo(map);

    const controller = new AbortController();

    const drawRoute = async () => {
      try {
        const route = await getRoute(from, to, controller.signal);
        if (!route) {
          setErrorMessage("Aucun itin�raire trouv� pour ces adresses.");
          return;
        }

        setRouteInfo({ distanceKm: route.distance / 1000, durationMin: route.duration / 60 });
        routeCoordsRef.current = route.geometry.coordinates;

        const renderRoute = async () => {
          map.addSource("route", {
            type: "geojson",
            data: { type: "Feature", geometry: route.geometry },
          });
          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#e60023", "line-width": 5, "line-opacity": 0.9 },
          });

          const bounds = new mapboxgl.LngLatBounds([from.lng, from.lat], [from.lng, from.lat]);
          bounds.extend([to.lng, to.lat]);
          route.geometry.coordinates.forEach((c) => bounds.extend(c));
          map.fitBounds(bounds, { padding: 54, maxZoom: 14 });

          await fetchRestaurants(route.geometry.coordinates, initialDistance);
        };

        if (map.isStyleLoaded()) renderRoute();
        else map.on("load", renderRoute);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage("Impossible de calculer l'itin�raire.");
        }
      }
    };

    drawRoute();

    return () => {
      controller.abort();
      originMarker.remove();
      destinationMarker.remove();
      restaurantMarkersRef.current.forEach((m) => m.remove());
      restaurantMarkersRef.current = [];
      mapRef.current = null;
      map.remove();
    };
  }, [from, to, hasValidCoordinates]);

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-4 py-8 md:px-7 md:py-10">
      <div className="mx-auto w-full max-w-[1220px]">

        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/40">Itinéraire</p>
            <h1 className="font-title text-3xl text-white">Trajet entre vos deux points</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openEditRoute}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Pencil className="size-3.5" />
              Modifier le trajet
            </button>
            <Link
              className={buttonVariants({ variant: "outline", className: "h-9 rounded-lg border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" })}
              to="/"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Edit route form */}
        {isEditingRoute && (
          <div className="relative z-10 mb-4 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">Modifier le trajet</p>
              <button onClick={() => setIsEditingRoute(false)} className="rounded-md p-1 text-white/40 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="relative grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              {/* Départ */}
              <div className="relative">
                <label className="flex flex-col rounded-xl bg-black/30 px-4 py-2.5">
                  <span className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.07em] text-white/50">Départ</span>
                  <Input
                    className="h-6 border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/40 focus-visible:ring-0"
                    value={editPoints.start.query}
                    onChange={(e) => updateEditQuery("start", e.target.value)}
                    onFocus={() => setEditActiveField("start")}
                    placeholder="Adresse de départ"
                  />
                </label>
                {editActiveField === "start" && (editLoadingSugg || editSuggestions.length > 0) && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 rounded-xl border border-white/20 bg-[#141414]/95 p-1 shadow-lg backdrop-blur-sm">
                    {editLoadingSugg && <p className="px-3 py-2 text-xs text-white/50">Recherche...</p>}
                    {!editLoadingSugg && editSuggestions.map((f) => (
                      <button key={f.id} type="button" onClick={() => selectEditSuggestion(f)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white transition hover:bg-white/10">
                        {f.place_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Arrivée */}
              <div className="relative">
                <label className="flex flex-col rounded-xl bg-black/30 px-4 py-2.5">
                  <span className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.07em] text-white/50">Arrivée</span>
                  <Input
                    className="h-6 border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/40 focus-visible:ring-0"
                    value={editPoints.end.query}
                    onChange={(e) => updateEditQuery("end", e.target.value)}
                    onFocus={() => setEditActiveField("end")}
                    placeholder="Adresse d'arrivée"
                  />
                </label>
                {editActiveField === "end" && (editLoadingSugg || editSuggestions.length > 0) && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 rounded-xl border border-white/20 bg-[#141414]/95 p-1 shadow-lg backdrop-blur-sm">
                    {editLoadingSugg && <p className="px-3 py-2 text-xs text-white/50">Recherche...</p>}
                    {!editLoadingSugg && editSuggestions.map((f) => (
                      <button key={f.id} type="button" onClick={() => selectEditSuggestion(f)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white transition hover:bg-white/10">
                        {f.place_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!hasValidEditPoints}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#e60023] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c9001f] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Search className="size-4" />
                Lancer
              </button>
            </form>
          </div>
        )}

        {/* Route info bar */}
        <div className="mb-4 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
          <div className="bg-[#0f0f0f] px-5 py-4 backdrop-blur-xl">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.07em] text-white/40">Lieu de départ</p>
            <p className="text-sm text-white/90">{from.label}</p>
          </div>
          <div className="bg-[#0f0f0f] px-5 py-4 backdrop-blur-xl">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.07em] text-white/40">Lieu d'arrivée</p>
            <p className="text-sm text-white/90">{to.label}</p>
          </div>
          <div className="bg-[#0f0f0f] px-5 py-4 backdrop-blur-xl">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.07em] text-white/40">Estimation</p>
            <p className="text-sm font-medium text-white/90">
              {routeInfo
                ? `${routeInfo.distanceKm.toFixed(1)} km · ${Math.round(routeInfo.durationMin)} min`
                : "Calcul en cours..."}
            </p>
          </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="h-[65vh] min-h-[360px] w-full" ref={mapContainerRef} />
        </div>

        <section className="mt-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-title text-2xl text-white">Restaurants sur le trajet</h2>
              {!restaurantsLoading && appliedDistance !== null && (
                <span className="text-sm text-white/40">
                  {restaurants.length === 0
                    ? "Aucun"
                    : `${restaurants.length} restaurant${restaurants.length > 1 ? "s" : ""}`}{" "}
                  à moins de {appliedDistance} km
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-white/50">
                Écart max au trajet
              </span>
              <input
                type="range"
                min={1}
                max={100}
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-28 accent-[#e60023] sm:w-40"
              />
              <span className="w-12 shrink-0 text-right text-sm font-semibold text-white">
                {maxDistanceKm} km
              </span>
              <button
                onClick={handleRelaunch}
                disabled={restaurantsLoading || !routeCoordsRef.current}
                className="ml-1 flex items-center gap-1.5 rounded-lg bg-[#e60023] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#c9001f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCw className={`size-3 ${restaurantsLoading ? "animate-spin" : ""}`} />
                Relancer
              </button>
            </div>
          </div>

          {restaurantsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : restaurants.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="mb-3 flex gap-1">
                {[1, 2, 3].map((i) => (
                  <Star key={i} className="size-5 text-white/10" />
                ))}
              </div>
              <p className="font-medium text-white/30">
                Aucun restaurant Michelin à moins de {appliedDistance ?? initialDistance} km du trajet
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ItineraryPage;
