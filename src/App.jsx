import { Navigate, Route, Routes } from "react-router-dom";
import ChatWidget from "./components/ChatWidget";
import DiscoverPage from "./pages/DiscoverPage";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import FavoriteDetailPage from "./pages/FavoriteDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import ItineraryPage from "./pages/ItineraryPage";
import ProfilePage from "./pages/ProfilePage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import RestaurantsPage from "./pages/RestaurantsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/favorites/:dishId" element={<FavoriteDetailPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatWidget />
    </>
  );
}

export default App;
