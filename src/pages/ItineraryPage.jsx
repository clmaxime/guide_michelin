import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useSearchParams } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import { useUiStore } from "@/store/ui-store";
import { getRoute, MAPBOX_ACCESS_TOKEN } from "@/lib/mapbox";

function parseCoordinate(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function ItineraryPage() {
  const mapContainerRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [routeInfo, setRouteInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const setScrolled = useUiStore((state) => state.setScrolled);

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

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

  const hasValidCoordinates = [from.lng, from.lat, to.lng, to.lat].every((value) => value !== null);

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
      style: "mapbox://styles/mapbox/streets-v12",
      center: [from.lng, from.lat],
      zoom: 11,
    });

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

        const renderRoute = () => {
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
      map.remove();
    };
  }, [from, to, hasValidCoordinates]);

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[#f6f6f6] pt-[4.4rem]">
        <section className="mx-auto w-full max-w-[1220px] px-4 py-8 md:px-7 md:py-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a7a7a]">Navigation</p>
              <h1 className="font-title text-3xl text-[#111111]">Itinéraire personnalisé</h1>
            </div>
            <Link className={buttonVariants({ className: "h-10 rounded-lg" })} to="/">
              Retour à l'accueil
            </Link>
          </div>

          <div className="mb-4 grid gap-3 rounded-xl border border-[#e6e6e6] bg-white p-4 shadow-sm md:grid-cols-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.07em] text-[#7a7a7a]">Point A</p>
              <p className="text-sm text-[#1f1f1f]">{from.label}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.07em] text-[#7a7a7a]">Point B</p>
              <p className="text-sm text-[#1f1f1f]">{to.label}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.07em] text-[#7a7a7a]">Estimation</p>
              <p className="text-sm font-medium text-[#1f1f1f]">
                {routeInfo ? `${routeInfo.distanceKm.toFixed(1)} km - ${Math.round(routeInfo.durationMin)} min` : "Calcul en cours..."}
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-[#ffc8d1] bg-[#fff4f6] px-4 py-3 text-sm text-[#9c1030]">{errorMessage}</div>
          )}

          <div className="overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-sm">
            <div className="h-[65vh] min-h-[360px] w-full" ref={mapContainerRef} />
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}

export default ItineraryPage;
