// Crop recommendation engine
export interface CropRecommendation {
  crop: string;
  score: number;
  season: string;
  waterNeed: string;
  duration: string;
}

export function recommendCrops(inputs: {
  soilType: string;
  rainfall: number;
  temperature: number;
  season: string;
}): CropRecommendation[] {
  const { soilType, rainfall, temperature, season } = inputs;
  const crops: CropRecommendation[] = [
    { crop: "Paddy (Rice)", score: 0, season: "Kharif", waterNeed: "High", duration: "120-150 days" },
    { crop: "Wheat", score: 0, season: "Rabi", waterNeed: "Medium", duration: "100-120 days" },
    { crop: "Maize", score: 0, season: "Kharif/Rabi", waterNeed: "Medium", duration: "80-110 days" },
    { crop: "Millets", score: 0, season: "Kharif", waterNeed: "Low", duration: "70-90 days" },
    { crop: "Groundnut", score: 0, season: "Kharif", waterNeed: "Medium", duration: "100-130 days" },
    { crop: "Sugarcane", score: 0, season: "Year-round", waterNeed: "High", duration: "300-365 days" },
    { crop: "Cotton", score: 0, season: "Kharif", waterNeed: "Medium", duration: "150-180 days" },
    { crop: "Soybean", score: 0, season: "Kharif", waterNeed: "Medium", duration: "90-120 days" },
  ];

  crops.forEach((c) => {
    // Soil match
    if (soilType === "clay" && ["Paddy (Rice)", "Wheat", "Sugarcane"].includes(c.crop)) c.score += 25;
    else if (soilType === "loamy") c.score += 20;
    else if (soilType === "sandy" && ["Millets", "Groundnut"].includes(c.crop)) c.score += 25;
    else if (soilType === "silt" && ["Wheat", "Maize"].includes(c.crop)) c.score += 22;
    else c.score += 10;

    // Rainfall
    if (rainfall > 1200 && c.waterNeed === "High") c.score += 25;
    else if (rainfall > 600 && c.waterNeed === "Medium") c.score += 25;
    else if (rainfall < 600 && c.waterNeed === "Low") c.score += 25;
    else c.score += 10;

    // Temperature
    if (temperature > 25 && ["Paddy (Rice)", "Maize", "Cotton", "Sugarcane"].includes(c.crop)) c.score += 20;
    else if (temperature < 25 && ["Wheat"].includes(c.crop)) c.score += 20;
    else c.score += 12;

    // Season
    if (c.season.toLowerCase().includes(season.toLowerCase()) || c.season === "Year-round") c.score += 20;
    else c.score += 5;

    // Add randomness
    c.score = Math.min(98, c.score + Math.floor(Math.random() * 8));
  });

  return crops.sort((a, b) => b.score - a.score);
}

// Fertilizer recommendation
export interface FertilizerRec {
  nutrient: string;
  amount: string;
  timing: string;
  type: string;
}

export function recommendFertilizer(crop: string, stage: string, soilN: number, soilP: number, soilK: number): FertilizerRec[] {
  const recs: FertilizerRec[] = [];
  const cropLower = crop.toLowerCase();

  const nNeed = cropLower.includes("rice") ? 120 : cropLower.includes("wheat") ? 100 : 80;
  const pNeed = cropLower.includes("rice") ? 60 : 40;
  const kNeed = cropLower.includes("rice") ? 60 : 40;

  const nDef = Math.max(0, nNeed - soilN);
  const pDef = Math.max(0, pNeed - soilP);
  const kDef = Math.max(0, kNeed - soilK);

  if (nDef > 0) recs.push({ nutrient: "Nitrogen (N)", amount: `${nDef} kg/ha`, timing: stage === "sowing" ? "Basal + split" : "Top dressing", type: "Urea / Ammonium Sulphate" });
  if (pDef > 0) recs.push({ nutrient: "Phosphorus (P)", amount: `${pDef} kg/ha`, timing: "Basal application", type: "DAP / SSP" });
  if (kDef > 0) recs.push({ nutrient: "Potassium (K)", amount: `${kDef} kg/ha`, timing: "Basal application", type: "MOP (Muriate of Potash)" });
  recs.push({ nutrient: "Zinc (Zn)", amount: "25 kg/ha", timing: "Before transplanting", type: "Zinc Sulphate" });

  return recs;
}

// Pest database
export interface PestEntry {
  name: string;
  crop: string;
  symptoms: string;
  treatment: string;
  prevention: string;
  severity: "Low" | "Medium" | "High";
}

export const pestDatabase: PestEntry[] = [
  { name: "Rice Stem Borer", crop: "Rice", symptoms: "Dead hearts in vegetative stage, white ears in reproductive stage", treatment: "Apply Chlorantraniliprole 0.4% GR at 10 kg/ha", prevention: "Use light traps, remove stubbles after harvest", severity: "High" },
  { name: "Brown Plant Hopper", crop: "Rice", symptoms: "Hopper burn — circular patches of dried plants", treatment: "Spray Buprofezin 25% SC at 1.6 mL/L", prevention: "Avoid excessive nitrogen, maintain field hygiene", severity: "High" },
  { name: "Leaf Folder", crop: "Rice", symptoms: "Folded leaves with scraping damage, white streaks", treatment: "Spray Fipronil 5% SC at 2 mL/L", prevention: "Release Trichogramma egg parasitoids", severity: "Medium" },
  { name: "Gall Midge", crop: "Rice", symptoms: "Silver shoot (onion-like tubular leaf)", treatment: "Apply Carbofuran 3G at 33 kg/ha", prevention: "Use resistant varieties, early planting", severity: "Medium" },
  { name: "Aphids", crop: "Wheat", symptoms: "Yellowing leaves, stunted growth, honeydew on leaves", treatment: "Spray Imidacloprid 17.8 SL at 0.3 mL/L", prevention: "Encourage natural predators like ladybugs", severity: "Medium" },
  { name: "Fall Armyworm", crop: "Maize", symptoms: "Ragged feeding on leaves, frass in whorl", treatment: "Spray Emamectin Benzoate 5% SG at 0.4 g/L", prevention: "Early sowing, intercropping with legumes", severity: "High" },
  { name: "Bollworm", crop: "Cotton", symptoms: "Bore holes in bolls, damaged squares and flowers", treatment: "Spray Profenofos 50% EC at 2 mL/L", prevention: "Use Bt cotton, install pheromone traps", severity: "High" },
  { name: "Pod Borer", crop: "Soybean", symptoms: "Holes in pods, caterpillars feeding on seeds", treatment: "Spray Quinalphos 25% EC at 2 mL/L", prevention: "Use HNPV biocontrol, trap crops", severity: "Medium" },
];

// Smart farming calendar
export interface CalendarEvent {
  week: number;
  activity: string;
  details: string;
  category: "sowing" | "fertilizer" | "irrigation" | "pest" | "harvest" | "inspection";
}

export function generateCalendar(crop: string): CalendarEvent[] {
  const cropLower = crop.toLowerCase();
  if (cropLower.includes("rice") || cropLower.includes("paddy")) {
    return [
      { week: 1, activity: "Land Preparation", details: "Plough field 2-3 times, level the land, apply basal fertilizer", category: "sowing" },
      { week: 2, activity: "Seed Sowing / Nursery", details: "Sow pre-treated seeds in nursery beds, maintain moisture", category: "sowing" },
      { week: 3, activity: "Nitrogen Application", details: "Apply first split of Urea (40 kg/ha) to nursery", category: "fertilizer" },
      { week: 4, activity: "Transplanting", details: "Transplant 21-25 day old seedlings at 20x15 cm spacing", category: "sowing" },
      { week: 5, activity: "Weed Management", details: "Apply pre-emergence herbicide or manual weeding", category: "inspection" },
      { week: 6, activity: "First Irrigation", details: "Maintain 2-5 cm standing water", category: "irrigation" },
      { week: 7, activity: "Disease Inspection", details: "Scout for blast, brown spot, BLB symptoms", category: "inspection" },
      { week: 8, activity: "Second N Top Dress", details: "Apply Urea (40 kg/ha) at tillering stage", category: "fertilizer" },
      { week: 10, activity: "Pest Monitoring", details: "Check for stem borer, BPH, leaf folder", category: "pest" },
      { week: 12, activity: "Panicle Initiation", details: "Apply final Urea split (40 kg/ha), ensure adequate water", category: "fertilizer" },
      { week: 14, activity: "Flowering Stage", details: "Maintain water level, avoid pesticide spray during flowering", category: "irrigation" },
      { week: 16, activity: "Grain Filling", details: "Ensure continuous water supply, monitor for false smut", category: "inspection" },
      { week: 18, activity: "Drain Field", details: "Stop irrigation 10-15 days before harvest", category: "irrigation" },
      { week: 20, activity: "Harvest", details: "Harvest when 80% grains are golden yellow", category: "harvest" },
    ];
  }
  // Generic calendar
  return [
    { week: 1, activity: "Land Preparation", details: "Plough and level the field, apply FYM", category: "sowing" },
    { week: 2, activity: "Seed Sowing", details: "Sow treated seeds at recommended spacing", category: "sowing" },
    { week: 3, activity: "Basal Fertilizer", details: "Apply DAP and MOP as basal dose", category: "fertilizer" },
    { week: 4, activity: "First Irrigation", details: "Irrigate based on soil moisture needs", category: "irrigation" },
    { week: 6, activity: "Weed Management", details: "Manual or chemical weed control", category: "inspection" },
    { week: 8, activity: "Top Dressing", details: "Apply nitrogen fertilizer", category: "fertilizer" },
    { week: 10, activity: "Pest Inspection", details: "Scout for common pests and diseases", category: "pest" },
    { week: 12, activity: "Second Irrigation", details: "Irrigate if no rainfall", category: "irrigation" },
    { week: 14, activity: "Disease Check", details: "Monitor for foliar diseases", category: "inspection" },
    { week: 16, activity: "Harvest", details: "Harvest at physiological maturity", category: "harvest" },
  ];
}

// Market prices (mock - simulating public data)
export interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  change: number;
  market: string;
  date: string;
}

export function getMarketPrices(): MarketPrice[] {
  const today = new Date().toISOString().split("T")[0];
  return [
    { crop: "Rice (Paddy)", price: 2100, unit: "₹/quintal", change: 2.3, market: "APMC Hyderabad", date: today },
    { crop: "Wheat", price: 2275, unit: "₹/quintal", change: -0.8, market: "APMC Delhi", date: today },
    { crop: "Maize", price: 1800, unit: "₹/quintal", change: 1.5, market: "APMC Bangalore", date: today },
    { crop: "Soybean", price: 4200, unit: "₹/quintal", change: 3.1, market: "APMC Indore", date: today },
    { crop: "Cotton", price: 6500, unit: "₹/quintal", change: -1.2, market: "APMC Nagpur", date: today },
    { crop: "Groundnut", price: 5800, unit: "₹/quintal", change: 0.5, market: "APMC Rajkot", date: today },
    { crop: "Sugarcane", price: 315, unit: "₹/quintal", change: 0.0, market: "Sugar Mill Rate", date: today },
    { crop: "Millets (Ragi)", price: 3578, unit: "₹/quintal", change: 4.2, market: "APMC Hassan", date: today },
  ];
}

// Irrigation advice
export function getIrrigationAdvice(weather: { temperature: number; humidity: number; rainfall: number }, soilMoisture: number, crop: string): { advice: string; action: "irrigate" | "skip" | "reduce"; details: string } {
  if (weather.rainfall > 5) return { advice: "No irrigation needed today", action: "skip", details: `Rainfall of ${weather.rainfall}mm detected. Sufficient moisture for ${crop}.` };
  if (soilMoisture > 50) return { advice: "Soil moisture adequate", action: "skip", details: `Soil moisture at ${soilMoisture}%. No irrigation required.` };
  if (weather.humidity > 85 && weather.temperature < 25) return { advice: "Reduce irrigation", action: "reduce", details: "High humidity and cool temperatures reduce evapotranspiration." };
  if (soilMoisture < 25) return { advice: "Irrigate immediately", action: "irrigate", details: `Soil moisture critically low at ${soilMoisture}%. ${crop} needs water urgently.` };
  return { advice: "Light irrigation recommended", action: "irrigate", details: `Moderate conditions. Apply 30-40mm of irrigation for ${crop}.` };
}

// Multi-language translations
export type Language = "en" | "hi" | "kn" | "te";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home", uploadScan: "Upload Scan", dashboard: "Dashboard", yieldPrediction: "Yield Prediction",
    weatherRisk: "Weather & Risk", satelliteMap: "Satellite Map", aiAssistant: "AI Assistant", diseaseDataset: "Disease Dataset",
    settings: "Settings", cropRecommend: "Crop Advisor", fertilizer: "Fertilizer Guide", pestMonitor: "Pest Monitor",
    farmCalendar: "Farm Calendar", irrigation: "Irrigation", marketPrices: "Market Prices",
    language: "Language", english: "English", hindi: "Hindi", kannada: "Kannada", telugu: "Telugu",
    recommended: "Recommended", alternative: "Alternative", score: "Score", season: "Season",
    treatment: "Treatment", prevention: "Prevention", severity: "Severity", week: "Week",
    activity: "Activity", details: "Details", price: "Price", change: "Change", market: "Market",
    cropName: "Crop Name", soilType: "Soil Type", rainfall: "Rainfall", temperature: "Temperature",
    getRecommendation: "Get Recommendation", noIrrigation: "No Irrigation Needed", irrigateNow: "Irrigate Now",
  },
  hi: {
    home: "होम", uploadScan: "स्कैन अपलोड", dashboard: "डैशबोर्ड", yieldPrediction: "उपज भविष्यवाणी",
    weatherRisk: "मौसम और जोखिम", satelliteMap: "उपग्रह मानचित्र", aiAssistant: "AI सहायक", diseaseDataset: "रोग डेटासेट",
    settings: "सेटिंग्स", cropRecommend: "फसल सलाहकार", fertilizer: "उर्वरक गाइड", pestMonitor: "कीट निगरानी",
    farmCalendar: "कृषि कैलेंडर", irrigation: "सिंचाई", marketPrices: "बाजार भाव",
    language: "भाषा", english: "अंग्रेजी", hindi: "हिंदी", kannada: "कन्नड़", telugu: "तेलुगु",
    recommended: "अनुशंसित", alternative: "वैकल्पिक", score: "स्कोर", season: "मौसम",
    treatment: "उपचार", prevention: "रोकथाम", severity: "गंभीरता", week: "सप्ताह",
    activity: "गतिविधि", details: "विवरण", price: "मूल्य", change: "बदलाव", market: "बाजार",
    cropName: "फसल का नाम", soilType: "मिट्टी का प्रकार", rainfall: "वर्षा", temperature: "तापमान",
    getRecommendation: "सिफारिश प्राप्त करें", noIrrigation: "सिंचाई की जरूरत नहीं", irrigateNow: "अभी सिंचाई करें",
  },
  kn: {
    home: "ಮುಖಪುಟ", uploadScan: "ಸ್ಕ್ಯಾನ್ ಅಪ್‌ಲೋಡ್", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", yieldPrediction: "ಇಳುವರಿ ಊಹೆ",
    weatherRisk: "ಹವಾಮಾನ ಮತ್ತು ಅಪಾಯ", satelliteMap: "ಉಪಗ್ರಹ ನಕ್ಷೆ", aiAssistant: "AI ಸಹಾಯಕ", diseaseDataset: "ರೋಗ ದತ್ತಾಂಶ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", cropRecommend: "ಬೆಳೆ ಸಲಹೆ", fertilizer: "ಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ", pestMonitor: "ಕೀಟ ಮೇಲ್ವಿಚಾರಣೆ",
    farmCalendar: "ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್", irrigation: "ನೀರಾವರಿ", marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
    language: "ಭಾಷೆ", english: "ಆಂಗ್ಲ", hindi: "ಹಿಂದಿ", kannada: "ಕನ್ನಡ", telugu: "ತೆಲುಗು",
    recommended: "ಶಿಫಾರಸು", alternative: "ಪರ್ಯಾಯ", score: "ಅಂಕ", season: "ಋತು",
    treatment: "ಚಿಕಿತ್ಸೆ", prevention: "ತಡೆಗಟ್ಟುವಿಕೆ", severity: "ತೀವ್ರತೆ", week: "ವಾರ",
    activity: "ಚಟುವಟಿಕೆ", details: "ವಿವರಗಳು", price: "ಬೆಲೆ", change: "ಬದಲಾವಣೆ", market: "ಮಾರುಕಟ್ಟೆ",
    cropName: "ಬೆಳೆ ಹೆಸರು", soilType: "ಮಣ್ಣಿನ ಪ್ರಕಾರ", rainfall: "ಮಳೆ", temperature: "ತಾಪಮಾನ",
    getRecommendation: "ಶಿಫಾರಸು ಪಡೆಯಿರಿ", noIrrigation: "ನೀರಾವರಿ ಬೇಕಿಲ್ಲ", irrigateNow: "ಈಗ ನೀರು ಹಾಕಿ",
  },
  te: {
    home: "హోమ్", uploadScan: "స్కాన్ అప్‌లోడ్", dashboard: "డాష్‌బోర్డ్", yieldPrediction: "దిగుబడి అంచనా",
    weatherRisk: "వాతావరణం & ప్రమాదం", satelliteMap: "ఉపగ్రహ మ్యాప్", aiAssistant: "AI సహాయకుడు", diseaseDataset: "వ్యాధి డేటాసెట్",
    settings: "సెట్టింగ్‌లు", cropRecommend: "పంట సలహా", fertilizer: "ఎరువుల గైడ్", pestMonitor: "తెగులు పర్యవేక్షణ",
    farmCalendar: "వ్యవసాయ క్యాలెండర్", irrigation: "నీటిపారుదల", marketPrices: "మార్కెట్ ధరలు",
    language: "భాష", english: "ఆంగ్లం", hindi: "హిందీ", kannada: "కన్నడ", telugu: "తెలుగు",
    recommended: "సిఫార్సు", alternative: "ప్రత్యామ్నాయ", score: "స్కోర్", season: "సీజన్",
    treatment: "చికిత్స", prevention: "నివారణ", severity: "తీవ్రత", week: "వారం",
    activity: "కార్యకలాపం", details: "వివరాలు", price: "ధర", change: "మార్పు", market: "మార్కెట్",
    cropName: "పంట పేరు", soilType: "నేల రకం", rainfall: "వర్షపాతం", temperature: "ఉష్ణోగ్రత",
    getRecommendation: "సిఫార్సు పొందండి", noIrrigation: "నీరు అవసరం లేదు", irrigateNow: "ఇప్పుడు నీరు పెట్టండి",
  },
};
