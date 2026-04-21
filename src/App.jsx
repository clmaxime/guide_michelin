import { Navigate, Route, Routes } from "react-router-dom";
import DiscoverPage from "./pages/DiscoverPage";
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import ItineraryPage from "./pages/ItineraryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/itinerary" element={<ItineraryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
