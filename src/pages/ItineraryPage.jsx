import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Locate, MapPin, Pencil, RefreshCw, Search, Star, X } from "lucide-react";
import { MichelinStars } from "@/components/MichelinStars";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRoute, MAPBOX_ACCESS_TOKEN, reverseGeocode, searchPlaces } from "@/lib/mapbox";
import { restaurantApi } from "@/lib/api";
import HeaderSection from "@/sections/HeaderSection";

const DAY_ORDER = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];

function RestaurantModal({ restaurant, onClose }) {
  const image = restaurant.imageUrls?.[0];
  const todayIndex = new Date().getDay();
  const todayKey = DAY_ORDER[todayIndex === 0 ? 6 : todayIndex - 1];
  const todayHoraire = restaurant.horaires?.find((h) => h.jour === todayKey);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-[#141414]/90 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {image ? (
          <div className="relative h-44 overflow-hidden">
            <img src={image} alt={restaurant.nom} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 to-transparent" />
          </div>
        ) : (
          <div className="h-24 bg-gradient-to-br from-neutral-800 to-neutral-950" />
        )}

        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-sm transition hover:bg-black/70 hover:text-white"
        >
          <X className="size-4" />
        </button>

        <div className="p-5">
          <div className="mb-1">
            <MichelinStars count={restaurant.distinction} size="sm" />
          </div>
          <h3 className="font-title mb-3 text-xl font-semibold text-white">{restaurant.nom}</h3>

          <div className="mb-2 flex items-start gap-1.5">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-white/40" />
            <p className="text-sm text-white/60">{restaurant.adresse}</p>
          </div>

          {restaurant.distance != null && (
            <p className="mb-2 text-sm font-medium text-[#e60023]">
              {restaurant.distance} km du trajet
            </p>
          )}

          {todayHoraire?.creneaux?.length > 0 ? (
            <p className="mb-4 text-sm font-medium text-emerald-400">
              Ouvert · {todayHoraire.creneaux[0].ouverture}–{todayHoraire.creneaux[0].fermeture}
            </p>
          ) : (
            <p className="mb-4 text-sm text-white/30">Horaires non renseignés</p>
          )}

          <Link
            to={`/restaurants/${restaurant.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e60023] py-2.5 text-sm font-bold text-white transition hover:bg-[#c9001f]"
          >
            Voir la fiche complète
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function parseCoordinate(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function RestaurantCard({ restaurant, onSelect }) {
  const image = restaurant.imageUrls?.[0];
  const todayIndex = new Date().getDay();
  const todayKey = DAY_ORDER[todayIndex === 0 ? 6 : todayIndex - 1];
  const todayHoraire = restaurant.horaires?.find((h) => h.jour === todayKey);

  return (
    <button
      onClick={() => onSelect(restaurant)}
      className="group relative flex aspect-[3/4] w-full overflow-hidden rounded-2xl text-left"
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

      <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur-md">
        <MichelinStars count={restaurant.distinction} />
      </div>

      {restaurant.distance != null && (
        <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
          {restaurant.distance} km
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-white/10 p-4 backdrop-blur-md transition-all duration-300 group-hover:bg-white/15">
        <h3 className="font-title mb-1 text-lg font-semibold leading-tight text-white">{restaurant.nom}</h3>
        <div className="mb-2 flex items-start gap-1">
          <MapPin className="mt-0.5 size-3 shrink-0 text-white/50" />
          <p className="line-clamp-1 text-xs text-white/50">{restaurant.adresse}</p>
        </div>
        {todayHoraire?.creneaux?.length > 0 ? (
          <p className="text-xs font-medium text-emerald-400">
            Ouvert · {todayHoraire.creneaux[0].ouverture}–{todayHoraire.creneaux[0].fermeture}
          </p>
        ) : (
          <p className="text-xs text-white/30">Horaires non renseignés</p>
        )}
      </div>
    </button>
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
  const [errorMessage, setErrorMessage] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [appliedDistance, setAppliedDistance] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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

  const from = useMemo(
    () => ({
      lng: parseCoordinate(searchParams.get("fromLng")),
      lat: parseCoordinate(searchParams.get("fromLat")),
      label: searchParams.get("fromLabel") ?? "Point A",
    }),
    [searchParams],
  );

  const to = useMemo(
    () => ({
      lng: parseCoordinate(searchParams.get("toLng")),
      lat: parseCoordinate(searchParams.get("toLat")),
      label: searchParams.get("toLabel") ?? "Point B",
    }),
    [searchParams],
  );

  const hasValidCoordinates = [from.lng, from.lat, to.lng, to.lat].every((v) => v !== null);

  // Autocomplete for edit form
  useEffect(() => {
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

  const [isGeolocating, setIsGeolocating] = useState(false);
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const feature = await reverseGeocode(coords.longitude, coords.latitude);
          if (feature) {
            setEditPoints((prev) => ({ ...prev, start: { query: feature.place_name, feature } }));
          }
        } finally {
          setIsGeolocating(false);
        }
      },
      () => setIsGeolocating(false),
      { timeout: 8000 },
    );
  };

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

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedRestaurant(restaurant);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([restaurant.longitude, restaurant.latitude])
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
      setErrorMessage("Coordonnées invalides. Lance une nouvelle recherche depuis la page d'accueil.");
      return;
    }

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
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(`Point A: ${from.label}`))
      .addTo(map);

    const destinationMarker = new mapboxgl.Marker({ color: "#e60023" })
      .setLngLat([to.lng, to.lat])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(`Point B: ${to.label}`))
      .addTo(map);

    const controller = new AbortController();

    const drawRoute = async () => {
      try {
        const route = await getRoute(from, to, controller.signal);
        if (!route) {
          setErrorMessage("Aucun itinéraire trouvé pour ces adresses.");
          return;
        }

        setRouteInfo({
          distanceKm: route.distance / 1000,
          durationMin: route.duration / 60,
        });
        routeCoordsRef.current = route.geometry.coordinates;

        const renderRoute = async () => {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: route.geometry,
            },
          });

          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#e60023",
              "line-width": 5,
              "line-opacity": 0.9,
            },
          });

          const bounds = new mapboxgl.LngLatBounds([from.lng, from.lat], [from.lng, from.lat]);
          bounds.extend([to.lng, to.lat]);
          route.geometry.coordinates.forEach((coordinate) => bounds.extend(coordinate));
          map.fitBounds(bounds, { padding: 54, maxZoom: 14 });

          await fetchRestaurants(route.geometry.coordinates, initialDistance);
        };

        if (map.isStyleLoaded()) {
          renderRoute();
        } else {
          map.on("load", renderRoute);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage("Impossible de calculer l'itinéraire.");
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

  if (!hasValidCoordinates) {
    return (
      <>
        <HeaderSection />
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4">
          <div className="w-full max-w-xl">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white/40">Itinéraire</p>
            <h1 className="font-title mb-8 text-center text-3xl text-white">Où souhaitez-vous aller ?</h1>

            <form onSubmit={handleEditSubmit} className="relative grid gap-3">
              <div className="relative">
                <label className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <span className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.07em] text-white/50">Lieu de départ</span>
                  <div className="flex items-center gap-2">
                    <Input
                      className="h-7 flex-1 border-0 bg-transparent p-0 text-white placeholder:text-white/30 focus-visible:ring-0"
                      value={editPoints.start.query}
                      onChange={(e) => updateEditQuery("start", e.target.value)}
                      onFocus={() => setEditActiveField("start")}
                      placeholder="Adresse de départ"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleGeolocate}
                      disabled={isGeolocating}
                      title="Utiliser ma position actuelle"
                      className="shrink-0 rounded-md p-1 text-white/40 transition hover:text-white disabled:opacity-30"
                    >
                      <Locate className={`size-4 ${isGeolocating ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
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

              <div className="relative">
                <label className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <span className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.07em] text-white/50">Lieu d'arrivée</span>
                  <Input
                    className="h-7 border-0 bg-transparent p-0 text-white placeholder:text-white/30 focus-visible:ring-0"
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

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-white/50">
                  Écart max au trajet
                </span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="flex-1 accent-[#e60023]"
                />
                <span className="w-14 shrink-0 text-right text-sm font-semibold text-white">
                  {maxDistanceKm} km
                </span>
              </div>

              <button
                type="submit"
                disabled={!hasValidEditPoints}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e60023] py-3 text-sm font-bold text-white transition hover:bg-[#c9001f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Search className="size-4" />
                Lancer l'itinéraire
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[#0f0f0f] px-4 pt-[4.4rem] pb-8 md:px-7 md:pb-10">
        <div className="mx-auto w-full max-w-[1220px] pt-8">

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

          {/* Edit route panel */}
          {isEditingRoute && (
            <div className="relative z-10 mb-4 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white/80">Modifier le trajet</p>
                <button onClick={() => setIsEditingRoute(false)} className="rounded-md p-1 text-white/40 hover:text-white">
                  <X className="size-4" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="relative grid gap-2 md:grid-cols-[1fr_1fr_auto]">
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
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#e60023] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c9001f] disabled:cursor-not-allowed disabled:opacity-40"
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
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="h-[65vh] min-h-[360px] w-full" ref={mapContainerRef} />
          </div>

          {/* Restaurants section */}
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

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-white/50">
                  Écart max
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
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                ))}
              </div>
            ) : restaurants.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} onSelect={setSelectedRestaurant} />
                ))}
              </div>
            ) : appliedDistance !== null ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center">
                <div className="mb-3 flex gap-1">
                  {[1, 2, 3].map((i) => <Star key={i} className="size-5 text-white/10" />)}
                </div>
                <p className="font-medium text-white/30">
                  Aucun restaurant Michelin à moins de {appliedDistance} km du trajet
                </p>
              </div>
            ) : null}
          </section>
        </div>
      </main>

      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </>
  );
}

export default ItineraryPage;
