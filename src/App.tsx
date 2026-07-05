import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { LanguageProvider } from "@/lib/language-context";
import Index from "./pages/Index";
import UploadPage from "./pages/UploadPage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import YieldPage from "./pages/YieldPage";
import WeatherPage from "./pages/WeatherPage";
import MapPage from "./pages/MapPage";
import AssistantPage from "./pages/AssistantPage";
import DatasetPage from "./pages/DatasetPage";
import SettingsPage from "./pages/SettingsPage";
import CropRecommendPage from "./pages/CropRecommendPage";
import FertilizerPage from "./pages/FertilizerPage";
import PestMonitorPage from "./pages/PestMonitorPage";
import FarmCalendarPage from "./pages/FarmCalendarPage";
import IrrigationPage from "./pages/IrrigationPage";
import MarketPricePage from "./pages/MarketPricePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/yield" element={<YieldPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/dataset" element={<DatasetPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/crop-recommend" element={<CropRecommendPage />} />
              <Route path="/fertilizer" element={<FertilizerPage />} />
              <Route path="/pest-monitor" element={<PestMonitorPage />} />
              <Route path="/farm-calendar" element={<FarmCalendarPage />} />
              <Route path="/irrigation" element={<IrrigationPage />} />
              <Route path="/market-prices" element={<MarketPricePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
