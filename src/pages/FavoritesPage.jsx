import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, CalendarClock, Clock3, Heart, Hotel, RefreshCcw, Trash2, UtensilsCrossed } from "lucide-react";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import { Button } from "@/components/ui/button";
import { favoritesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

function formatCountdown(msLeft) {
  const totalSec = Math.max(0, Math.floor(msLeft / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function TabButton({ active, icon: Icon, label, count, onClick }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? "border-primary bg-primary text-white" : "border-[#e4dde0] bg-white text-[#2a2d32] hover:border-[#d2c5ca]"
      }`}
      onClick={onClick}
      type="button"
    >
      <Icon className="size-4" /> {label} <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{count}</span>
    </button>
  );
}

function FavoritesPage() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();
  const setScrolled = useUiStore((state) => state.setScrolled);

  const [activeTab, setActiveTab] = useState("dishes");
  const [dishFavorites, setDishFavorites] = useState([]);
  const [restaurantFavorites, setRestaurantFavorites] = useState([]);
  const [hotelFavorites, setHotelFavorites] = useState([]);
  const [tick, setTick] = useState(Date.now());
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [loading, navigate, user]);

  const loadAll = async () => {
    try {
      const [dishes, restaurants, hotels] = await Promise.all([
        favoritesApi.listDishes(),
        favoritesApi.listRestaurants(),
        favoritesApi.listHotels(),
      ]);
      setDishFavorites(dishes);
      setRestaurantFavorites(restaurants);
      setHotelFavorites(hotels);
      setMessage("");
    } catch {
      setMessage("Impossible de charger les favoris.");
    }
  };

  useEffect(() => {
    if (user) loadAll();
  }, [user]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeDishFavorites = useMemo(
    () => dishFavorites.filter((item) => new Date(item.expiresAt).getTime() > tick),
    [dishFavorites, tick],
  );

  async function clearCategory() {
    setBusy(`clear:${activeTab}`);
    setMessage("");
    try {
      if (activeTab === "dishes") {
        await favoritesApi.clear();
        setDishFavorites([]);
      } else if (activeTab === "restaurants") {
        await favoritesApi.clearRestaurants();
        setRestaurantFavorites([]);
      } else {
        await favoritesApi.clearHotels();
        setHotelFavorites([]);
      }
      setMessage("CatÃ©gorie rÃ©initialisÃ©e.");
    } catch {
      setMessage("Impossible de rÃ©initialiser cette catÃ©gorie.");
    } finally {
      setBusy("");
    }
  }

  async function removeDish(dishId) {
    setBusy(`dish:${dishId}`);
    try {
      await favoritesApi.deleteOne(dishId);
      setDishFavorites((prev) => prev.filter((item) => item.dishId !== dishId));
    } finally {
      setBusy("");
    }
  }

  async function removeRestaurant(restaurantId) {
    setBusy(`restaurant:${restaurantId}`);
    try {
      await favoritesApi.deleteRestaurant(restaurantId);
      setRestaurantFavorites((prev) => prev.filter((item) => item.restaurantId !== restaurantId));
    } finally {
      setBusy("");
    }
  }

  async function removeHotel(hotelKey) {
    setBusy(`hotel:${hotelKey}`);
    try {
      await favoritesApi.deleteHotel(hotelKey);
      setHotelFavorites((prev) => prev.filter((item) => item.hotelKey !== hotelKey));
    } finally {
      setBusy("");
    }
  }

  if (loading || !user) return null;

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,#f8ecef_0%,#f5f5f7_35%,#f3f3f4_100%)] pt-[4.4rem]">
        <section className="mx-auto w-full max-w-[1220px] px-4 py-8 md:px-7 md:py-12">
          <header className="mb-6 rounded-3xl border border-[#eadce0] bg-white/90 p-5 shadow-[0_18px_40px_rgba(17,17,17,0.06)] md:p-7">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">Espace personnel</p>
            <h1 className="font-title text-3xl text-[#141416] md:text-4xl">Mes favoris</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <TabButton active={activeTab === "dishes"} count={activeDishFavorites.length} icon={UtensilsCrossed} label="Plats" onClick={() => setActiveTab("dishes")} />
              <TabButton active={activeTab === "restaurants"} count={restaurantFavorites.length} icon={Building2} label="Restaurants" onClick={() => setActiveTab("restaurants")} />
              <TabButton active={activeTab === "hotels"} count={hotelFavorites.length} icon={Hotel} label="HÃ´tels" onClick={() => setActiveTab("hotels")} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button className="rounded-full px-5" disabled={busy === `clear:${activeTab}`} onClick={clearCategory} type="button" variant="outline">
                <Trash2 className="size-4" />
                RÃ©initialiser la catÃ©gorie
              </Button>
              {message ? <p className="text-sm text-[#59606a]">{message}</p> : null}
            </div>
          </header>

          {activeTab === "dishes" && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {activeDishFavorites.map((favorite) => {
                const msLeft = new Date(favorite.expiresAt).getTime() - tick;
                return (
                  <article className="overflow-hidden rounded-3xl border border-[#eadce0] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.06)]" key={favorite.id}>
                    <img alt={favorite.dishTitle} className="h-48 w-full object-cover" src={favorite.dishImage} />
                    <div className="space-y-3 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">{favorite.dishCuisine}</p>
                      <h2 className="font-title text-2xl text-[#17181a]">{favorite.dishTitle}</h2>
                      <p className="line-clamp-2 text-sm text-[#5e6166]">{favorite.dishCaption}</p>
                      <p className="text-sm font-semibold text-[#2a2d32]">{favorite.restaurantName}</p>
                      <div className="rounded-xl border border-[#ece6e9] bg-[#faf7f8] px-3 py-2 text-xs text-[#5e6166]">
                        <p className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5" /> {new Date(favorite.expiresAt).toLocaleString("fr-FR")}</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#1a1b1d]"><Clock3 className="size-3.5" /> {formatCountdown(msLeft)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link className="inline-flex h-10 items-center rounded-xl bg-[#17181a] px-3.5 text-sm font-semibold text-white" to={`/favorites/${favorite.dishId}`}>
                          Voir la fiche
                        </Link>
                        <Button className="h-10 rounded-xl" disabled={busy === `dish:${favorite.dishId}`} onClick={() => removeDish(favorite.dishId)} type="button" variant="outline">
                          Retirer
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {activeTab === "restaurants" && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {restaurantFavorites.map((favorite) => (
                <article className="overflow-hidden rounded-3xl border border-[#eadce0] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.06)]" key={favorite.id}>
                  {favorite.restaurantImage ? <img alt={favorite.restaurantName} className="h-48 w-full object-cover" src={favorite.restaurantImage} /> : null}
                  <div className="space-y-3 p-5">
                    <h2 className="font-title text-2xl text-[#17181a]">{favorite.restaurantName}</h2>
                    <p className="text-sm text-[#5e6166]">{favorite.restaurantAddress}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link className="inline-flex h-10 items-center rounded-xl bg-[#17181a] px-3.5 text-sm font-semibold text-white" to={`/restaurants/${favorite.restaurantId}`}>
                        Ouvrir la fiche
                      </Link>
                      <Button className="h-10 rounded-xl" disabled={busy === `restaurant:${favorite.restaurantId}`} onClick={() => removeRestaurant(favorite.restaurantId)} type="button" variant="outline">
                        Retirer
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === "hotels" && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {hotelFavorites.map((favorite) => (
                <article className="overflow-hidden rounded-3xl border border-[#eadce0] bg-white shadow-[0_18px_40px_rgba(17,17,17,0.06)]" key={favorite.id}>
                  <img alt={favorite.hotelName} className="h-48 w-full object-cover" src={favorite.hotelImage} />
                  <div className="space-y-3 p-5">
                    <h2 className="font-title text-2xl text-[#17181a]">{favorite.hotelName}</h2>
                    <p className="text-sm text-[#5e6166]">{favorite.hotelLocationSlug || "Destination Michelin"}</p>
                    <div className="flex flex-wrap gap-2">
                      <a className="inline-flex h-10 items-center rounded-xl bg-[#17181a] px-3.5 text-sm font-semibold text-white" href={favorite.hotelUrl} rel="noopener noreferrer" target="_blank">
                        Voir la fiche
                      </a>
                      <Button className="h-10 rounded-xl" disabled={busy === `hotel:${favorite.hotelKey}`} onClick={() => removeHotel(favorite.hotelKey)} type="button" variant="outline">
                        Retirer
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === "dishes" && activeDishFavorites.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#e8d9de] bg-white p-6 text-center text-[#5e6166]">
              <Heart className="mx-auto mb-2 size-5 text-primary" />
              Aucun favori dans cette catÃ©gorie.
            </div>
          ) : null}
          {activeTab === "restaurants" && restaurantFavorites.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#e8d9de] bg-white p-6 text-center text-[#5e6166]">Aucun restaurant favori.</div>
          ) : null}
          {activeTab === "hotels" && hotelFavorites.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#e8d9de] bg-white p-6 text-center text-[#5e6166]">Aucun hÃ´tel favori.</div>
          ) : null}
        </section>
      </main>
      <FooterSection />
    </>
  );
}

export default FavoritesPage;
