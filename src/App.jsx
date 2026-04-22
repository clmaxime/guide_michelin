import { Navigate, Route, Routes } from "react-router-dom";
import DiscoverPage from "./pages/DiscoverPage";
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import ItineraryPage from "./pages/ItineraryPage";
import ProfilePage from "./pages/ProfilePage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import RestaurantsPage from "./pages/RestaurantsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/itinerary" element={<ItineraryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
