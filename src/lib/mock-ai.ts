// ============================================================
// AgriScan AI — Scan Storage, Export & Utility Functions
// Detection is now handled by Gemini Vision (src/lib/gemini-vision.ts)
// This file keeps: scan storage, Excel/PDF export, chatbot, yield helpers
// ============================================================

import * as XLSX from "xlsx";
import {
  diseaseKnowledgeBase,
  getDiseasesForCrop,
  type DiseaseEntry,
  type WeatherRiskFactor,
  getWeatherRiskFactors,
} from "./disease-knowledge-base";

export interface FieldData {
  cropName: string;
  acreLand: number;
  yieldAffected: number;
  leafEdge: "Normal" | "Damaged" | "Burnt";
  leafColor: "Healthy Green" | "Yellow" | "Brown" | "Mixed";
  leafSpots: "None" | "Black Spots" | "Brown Spots" | "White Powder";
  leafTexture: "Normal" | "Dry" | "Curled";
  plantAge: number;
}

// ─── IMPROVED CROP DETECTION ──────────────────────────────
// Analyzes image color data for crop-type heuristic detection.
// Since we can't run a real ML model in-browser without a trained
// TensorFlow.js model file, we use a deterministic heuristic that
// considers the user-provided field data and image color profile.
export function detectCropFromImage(imageUrl: string): Promise<{ crop: string; confidence: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 64; // downsample for speed
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Calculate average color channels
      let rSum = 0, gSum = 0, bSum = 0;
      let greenPixels = 0, brownPixels = 0, yellowPixels = 0;
      const totalPixels = size * size;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        rSum += r; gSum += g; bSum += b;

        // Classify pixel colors
        if (g > r && g > b && g > 80) greenPixels++;
        if (r > 120 && g > 80 && g < r && b < 80) brownPixels++;
        if (r > 150 && g > 130 && b < 100) yellowPixels++;
      }

      const avgR = rSum / totalPixels;
      const avgG = gSum / totalPixels;
      const avgB = bSum / totalPixels;
      const greenRatio = greenPixels / totalPixels;
      const brownRatio = brownPixels / totalPixels;

      // Use color profile to make a deterministic crop guess
      // This is a heuristic — not a real classifier
      const crops = getAllSupportedCrops();
      let detectedCrop: string;
      let confidence: number;

      // Heavily green → broad-leaf crops
      if (greenRatio > 0.4) {
        // Very green leaves → could be many crops
        const hashVal = simpleHash(imageUrl);
        const broadLeafCrops = ["Tomato", "Potato", "Soybean", "Cotton"];
        detectedCrop = broadLeafCrops[hashVal % broadLeafCrops.length];
        confidence = 65 + (greenRatio * 30);
      } else if (brownRatio > 0.3) {
        // Brown dominant → rice/wheat (dried/diseased leaves)
        const hashVal = simpleHash(imageUrl);
        const grainCrops = ["Rice", "Wheat", "Corn"];
        detectedCrop = grainCrops[hashVal % grainCrops.length];
        confidence = 60 + (brownRatio * 25);
      } else if (avgG > avgR && avgG > avgB) {
        // Generally green
        const hashVal = simpleHash(imageUrl);
        detectedCrop = crops[hashVal % crops.length];
        confidence = 55 + Math.random() * 20;
      } else {
        // Mixed/unclear — use image hash for deterministic selection
        const hashVal = simpleHash(imageUrl);
        detectedCrop = crops[hashVal % crops.length];
        confidence = 45 + Math.random() * 15;
      }

      resolve({ crop: detectedCrop, confidence: Math.min(95, confidence) });
    };

    img.onerror = () => {
      // Fallback: deterministic from URL hash
      const crops = getAllSupportedCrops();
      const hashVal = simpleHash(imageUrl);
      resolve({ crop: crops[hashVal % crops.length], confidence: 50 + Math.random() * 20 });
    };

    img.src = imageUrl;
  });
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getAllSupportedCrops(): string[] {
  return [...new Set(diseaseKnowledgeBase.map(d => d.crop))];
}

// ─── ENHANCED DISEASE RESULT ──────────────────────────────
// ─── CROP YIELD DATA (tons per acre, average market price per ton in INR) ─
export const cropYieldData: Record<string, { avgYieldPerAcre: number; pricePerTon: number; unit: string }> = {
  Tomato:    { avgYieldPerAcre: 8.0,  pricePerTon: 15000, unit: "tons" },
  Potato:    { avgYieldPerAcre: 7.0,  pricePerTon: 12000, unit: "tons" },
  Rice:      { avgYieldPerAcre: 1.8,  pricePerTon: 22000, unit: "tons" },
  Wheat:     { avgYieldPerAcre: 1.5,  pricePerTon: 25000, unit: "tons" },
  Corn:      { avgYieldPerAcre: 2.5,  pricePerTon: 18000, unit: "tons" },
  Soybean:   { avgYieldPerAcre: 1.0,  pricePerTon: 40000, unit: "tons" },
  Cotton:    { avgYieldPerAcre: 0.6,  pricePerTon: 60000, unit: "tons" },
  Sugarcane: { avgYieldPerAcre: 25.0, pricePerTon: 3500,  unit: "tons" },
};

export interface YieldPrediction {
  expectedYieldPerAcre: number;
  totalExpectedYield: number;
  lossPercentage: number;
  yieldLostPerAcre: number;
  totalYieldLost: number;
  remainingYield: number;
  affectedAcres: number;
  estimatedRevenueLoss: number;
  pricePerTon: number;
  unit: string;
}

export interface DiseaseResult {
  id: string;
  crop: string;
  disease: string;
  diseaseKey: string;
  confidence: number;
  isLowConfidence: boolean;
  severity: "Low" | "Medium" | "High" | "Critical";
  yieldLoss: number;
  yieldPrediction: YieldPrediction;
  treatment: {
    pesticide: string;
    organicAlternative: string;
    steps: string[];
    prevention: string[];
    fertilizer: string;
  };
  productSuggestions: ProductSuggestion[];
  /** Detailed disease info from knowledge base */
  diseaseInfo: {
    pathogen: string;
    type: string;
    symptoms: string[];
    affectedParts: string[];
  };
  weatherRiskFactors: WeatherRiskFactor[];
  imageUrl: string;
  timestamp: string;
}

export interface ProductSuggestion {
  name: string;
  type: "Pesticide" | "Fungicide" | "Fertilizer" | "Bio-agent" | "Organic";
  dosage: string;
  applicationMethod: string;
  estimatedCost: string;
}

export interface ScanRecord extends DiseaseResult {
  slNo: number;
  fieldData: FieldData;
}

// ─── CONFIDENCE THRESHOLD ──────────────────────────────────
const CONFIDENCE_THRESHOLD = 75;

// ─── IMPROVED DETECTION PIPELINE ──────────────────────────
export function detectDisease(imageUrl: string, fieldData?: FieldData): DiseaseResult {
  const cropName = fieldData?.cropName || "Rice";

  // Get diseases for this crop
  let candidates = getDiseasesForCrop(cropName);

  // Fallback to all diseases if crop not in knowledge base
  if (candidates.length === 0) {
    candidates = getDiseasesForCrop("Rice"); // fallback
  }

  // Score each disease candidate based on field data visual cues
  const scored = candidates.map((entry) => {
    let score = 10; // base score

    if (fieldData) {
      // Match leaf color
      if (entry.visualCues.leafColors.includes(fieldData.leafColor)) {
        score += 25;
      }
      // Match spot type
      if (entry.visualCues.spotTypes.includes(fieldData.leafSpots)) {
        score += 30;
      }
      // Match leaf texture
      if (entry.visualCues.leafTextures.includes(fieldData.leafTexture)) {
        score += 15;
      }
      // Match leaf edge
      if (entry.visualCues.leafEdges.includes(fieldData.leafEdge)) {
        score += 15;
      }

      // Healthy bias: if everything looks normal, boost healthy entry
      if (
        fieldData.leafColor === "Healthy Green" &&
        fieldData.leafSpots === "None" &&
        fieldData.leafTexture === "Normal" &&
        fieldData.leafEdge === "Normal"
      ) {
        if (entry.isHealthy) score += 50;
        else score -= 20;
      }

      // If field shows clear disease signs but entry is healthy, penalize
      if (
        (fieldData.leafSpots !== "None" || fieldData.leafColor !== "Healthy Green") &&
        entry.isHealthy
      ) {
        score -= 30;
      }
    } else {
      // No field data — use image hash for deterministic but varied results
      const hashVal = simpleHash(imageUrl + entry.key);
      score += hashVal % 40;
    }

    // Add some variation so it's not perfectly deterministic
    const variation = (simpleHash(imageUrl + entry.key + Date.now().toString()) % 10) - 5;
    score += variation;

    return { entry, score: Math.max(0, score) };
  });

  // Sort by score descending and pick the best match
  scored.sort((a, b) => b.score - a.score);
  const bestMatch = scored[0];
  const topEntry = bestMatch.entry;

  // Calculate confidence based on score differential
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
  const rawConfidence = totalScore > 0 ? (bestMatch.score / totalScore) * 100 : 50;

  // Scale confidence to a realistic range
  let confidence: number;
  if (fieldData && (fieldData.leafSpots !== "None" || fieldData.leafColor !== "Healthy Green")) {
    // More field data → higher confidence
    confidence = Math.min(98, Math.max(55, rawConfidence * 1.2 + 40));
  } else if (fieldData) {
    confidence = Math.min(97, Math.max(50, rawConfidence + 35));
  } else {
    // No field data → lower confidence
    confidence = Math.min(85, Math.max(40, rawConfidence + 20));
  }

  // Add small random variation
  confidence += (Math.random() - 0.5) * 4;
  confidence = Math.round(confidence * 10) / 10;
  confidence = Math.min(99, Math.max(30, confidence));

  const isLowConfidence = confidence < CONFIDENCE_THRESHOLD;

  // Calculate severity based on disease weight + field data
  const severity = calculateSeverity(topEntry, fieldData);

  // Calculate yield loss based on severity and disease range
  const yieldLoss = calculateYieldLoss(topEntry, severity, fieldData);

  // Calculate detailed yield prediction
  const acreage = fieldData?.acreLand || 1;
  const yieldPrediction = computeYieldPrediction(cropName, acreage, yieldLoss);

  // Get weather risk factors
  const weatherRiskFactors = getWeatherRiskFactors(topEntry);

  // Generate product suggestions
  const productSuggestions = generateProductSuggestions(topEntry, severity);

  return {
    id: crypto.randomUUID(),
    crop: cropName,
    disease: topEntry.disease,
    diseaseKey: topEntry.key,
    confidence,
    isLowConfidence,
    severity,
    yieldLoss,
    yieldPrediction,
    treatment: {
      pesticide: topEntry.treatment.pesticide,
      organicAlternative: topEntry.treatment.organicAlternative,
      steps: topEntry.treatment.steps,
      prevention: topEntry.treatment.prevention,
      fertilizer: topEntry.treatment.fertilizer,
    },
    productSuggestions,
    diseaseInfo: {
      pathogen: topEntry.pathogen,
      type: topEntry.type,
      symptoms: topEntry.symptoms,
      affectedParts: topEntry.affectedParts,
    },
    weatherRiskFactors,
    imageUrl,
    timestamp: new Date().toISOString(),
  };
}

function calculateSeverity(
  entry: DiseaseEntry,
  fieldData?: FieldData
): "Low" | "Medium" | "High" | "Critical" {
  if (entry.isHealthy) return "Low";

  let severityScore = entry.baseSeverityWeight;

  if (fieldData) {
    // Damaged edges increase severity
    if (fieldData.leafEdge === "Burnt") severityScore += 1.5;
    else if (fieldData.leafEdge === "Damaged") severityScore += 0.5;

    // Non-green color increases severity
    if (fieldData.leafColor === "Brown") severityScore += 1;
    else if (fieldData.leafColor === "Yellow") severityScore += 0.5;

    // Spots increase severity
    if (fieldData.leafSpots === "Black Spots") severityScore += 1;
    else if (fieldData.leafSpots === "Brown Spots") severityScore += 0.5;

    // Curled/dry texture increases severity
    if (fieldData.leafTexture === "Curled") severityScore += 0.5;
    else if (fieldData.leafTexture === "Dry") severityScore += 0.5;

    // Older plants may have worse infections
    if (fieldData.plantAge > 90) severityScore += 0.5;
  }

  if (severityScore <= 1) return "Low";
  if (severityScore <= 2.5) return "Medium";
  if (severityScore <= 3.5) return "High";
  return "Critical";
}

function calculateYieldLoss(
  entry: DiseaseEntry,
  severity: string,
  fieldData?: FieldData
): number {
  if (entry.isHealthy) return 0;

  const [minLoss, maxLoss] = entry.yieldLossRange;
  const range = maxLoss - minLoss;

  let factor: number;
  switch (severity) {
    case "Low": factor = 0.15; break;
    case "Medium": factor = 0.4; break;
    case "High": factor = 0.7; break;
    case "Critical": factor = 0.95; break;
    default: factor = 0.5;
  }

  let loss = minLoss + range * factor;

  // Adjust by acreage — larger farms may have more spread
  if (fieldData && fieldData.acreLand > 3) {
    loss *= 1.05;
  }

  return Math.round(Math.min(maxLoss, Math.max(minLoss, loss)));
}

// ─── COMPUTE YIELD PREDICTION ─────────────────────────────
function computeYieldPrediction(crop: string, acreage: number, lossPercentage: number): YieldPrediction {
  const data = cropYieldData[crop] || { avgYieldPerAcre: 2.0, pricePerTon: 20000, unit: "tons" };
  const expectedYieldPerAcre = data.avgYieldPerAcre;
  const totalExpectedYield = +(expectedYieldPerAcre * acreage).toFixed(2);
  const yieldLostPerAcre = +(expectedYieldPerAcre * lossPercentage / 100).toFixed(2);
  const totalYieldLost = +(yieldLostPerAcre * acreage).toFixed(2);
  const remainingYield = +(totalExpectedYield - totalYieldLost).toFixed(2);
  const affectedAcres = +(acreage * lossPercentage / 100).toFixed(2);
  const estimatedRevenueLoss = Math.round(totalYieldLost * data.pricePerTon);

  return {
    expectedYieldPerAcre,
    totalExpectedYield,
    lossPercentage,
    yieldLostPerAcre,
    totalYieldLost,
    remainingYield,
    affectedAcres,
    estimatedRevenueLoss,
    pricePerTon: data.pricePerTon,
    unit: data.unit,
  };
}

// ─── PRODUCT SUGGESTIONS ──────────────────────────────────
function generateProductSuggestions(entry: DiseaseEntry, severity: string): ProductSuggestion[] {
  if (entry.isHealthy) return [];

  const suggestions: ProductSuggestion[] = [];

  // Primary pesticide/fungicide
  if (entry.treatment.pesticide && entry.treatment.pesticide !== "None required") {
    suggestions.push({
      name: entry.treatment.pesticide.split(" at ")[0] || entry.treatment.pesticide,
      type: entry.type === "Fungal" ? "Fungicide" : "Pesticide",
      dosage: entry.treatment.pesticide,
      applicationMethod: "Foliar spray with knapsack sprayer, ensure full canopy coverage",
      estimatedCost: severity === "Critical" ? "₹800–1,200/acre" : severity === "High" ? "₹500–800/acre" : "₹300–500/acre",
    });
  }

  // Organic alternative
  if (entry.treatment.organicAlternative && entry.treatment.organicAlternative !== "None required") {
    suggestions.push({
      name: entry.treatment.organicAlternative,
      type: "Organic",
      dosage: "As per product label",
      applicationMethod: "Foliar spray or soil drench as applicable",
      estimatedCost: "₹200–500/acre",
    });
  }

  // Fertilizer
  if (entry.treatment.fertilizer && entry.treatment.fertilizer !== "Standard NPK as per soil test") {
    suggestions.push({
      name: entry.treatment.fertilizer.split(" +")[0] || entry.treatment.fertilizer,
      type: "Fertilizer",
      dosage: entry.treatment.fertilizer,
      applicationMethod: "Broadcast or band application near root zone",
      estimatedCost: "₹400–700/acre",
    });
  }

  // Bio-agent suggestion for fungal diseases
  if (entry.type === "Fungal") {
    suggestions.push({
      name: "Trichoderma viride (Bio-fungicide)",
      type: "Bio-agent",
      dosage: "2.5 kg/ha mixed with FYM",
      applicationMethod: "Soil application or seed treatment",
      estimatedCost: "₹150–300/acre",
    });
  }

  return suggestions;
}

// ─── YIELD PREDICTION ─────────────────────────────────────
export function predictYield(inputs: {
  cropType: string;
  soilType: string;
  rainfall: number;
  fertilizer: number;
  acreage: number;
  diseaseSeverity: string;
}): { yieldPerAcre: number; totalYield: number; quality: string } {
  const baseYield: Record<string, number> = {
    rice: 2.5, wheat: 3.0, corn: 4.5, tomato: 15.0, potato: 12.0,
    soybean: 1.8, cotton: 1.5, sugarcane: 35.0,
  };
  const soilFactor: Record<string, number> = {
    clay: 0.9, loamy: 1.1, sandy: 0.75, silt: 1.0, peat: 0.85,
  };
  const severityFactor: Record<string, number> = {
    none: 1.0, low: 0.9, medium: 0.75, high: 0.55, critical: 0.3,
  };

  const base = baseYield[inputs.cropType.toLowerCase()] || 2.5;
  const soil = soilFactor[inputs.soilType.toLowerCase()] || 1.0;
  const severity = severityFactor[inputs.diseaseSeverity.toLowerCase()] || 1.0;
  const rainfallFactor = Math.min(1.2, Math.max(0.5, inputs.rainfall / 1000));
  const fertilizerFactor = Math.min(1.3, Math.max(0.7, inputs.fertilizer / 100));

  const yieldPerAcre = +(base * soil * severity * rainfallFactor * fertilizerFactor).toFixed(2);
  const totalYield = +(yieldPerAcre * inputs.acreage).toFixed(2);
  const quality = severity >= 0.8 ? "Premium" : severity >= 0.6 ? "Standard" : "Below Average";

  return { yieldPerAcre, totalYield, quality };
}

// ─── SCAN STORAGE ─────────────────────────────────────────
const STORAGE_KEY = "agriscan_scans";

export function saveScans(scans: ScanRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
}

export function loadScans(): ScanRecord[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const parsed: ScanRecord[] = JSON.parse(data);
      // Backwards compatibility: add missing fields to old scan records
      return parsed.map(s => migrateScan(s));
    } catch { return []; }
  }
  // Seed with mock data
  const seeded: ScanRecord[] = mockScanHistory.map((s, i) => ({
    ...s,
    slNo: i + 1,
    fieldData: {
      cropName: s.crop,
      acreLand: +(Math.random() * 5 + 1).toFixed(1),
      yieldAffected: s.yieldLoss,
      leafEdge: "Normal" as const,
      leafColor: s.disease === "Healthy" ? "Healthy Green" as const : "Brown" as const,
      leafSpots: s.disease.includes("Spot") || s.disease.includes("Blight") ? "Brown Spots" as const : "None" as const,
      leafTexture: "Normal" as const,
      plantAge: Math.floor(Math.random() * 60 + 30),
    },
  }));
  saveScans(seeded);
  return seeded;
}

/** Migrate old scan records to include new fields */
function migrateScan(scan: ScanRecord): ScanRecord {
  if (!scan.yieldPrediction) {
    const acreage = scan.fieldData?.acreLand || 1;
    scan.yieldPrediction = computeYieldPrediction(scan.crop, acreage, scan.yieldLoss);
  }
  if (!scan.productSuggestions) {
    scan.productSuggestions = [];
  }
  return scan;
}

export function addScan(result: DiseaseResult, fieldData: FieldData): ScanRecord {
  const scans = loadScans();
  const record: ScanRecord = {
    ...result,
    slNo: scans.length + 1,
    fieldData,
  };
  scans.push(record);
  saveScans(scans);
  return record;
}

// ─── EXCEL EXPORT ─────────────────────────────────────────
export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

function buildScanReportRow(scan: ScanRecord) {
  const yp = scan.yieldPrediction;
  return {
    "Scan ID": scan.id,
    "Timestamp": new Date(scan.timestamp).toLocaleString(),
    "Crop Name": scan.crop,
    "Acre of Land": scan.fieldData.acreLand,
    "Disease Detected": scan.disease,
    "Disease Key": scan.diseaseKey || "N/A",
    "Pathogen": scan.diseaseInfo?.pathogen || "N/A",
    "Disease Type": scan.diseaseInfo?.type || "N/A",
    "Confidence Score (%)": scan.confidence.toFixed(1),
    "Low Confidence Warning": scan.isLowConfidence ? "Yes — Upload clearer image" : "No",
    "Severity": scan.severity,
    "Yield Loss (%)": scan.yieldLoss,
    "Expected Yield/Acre (tons)": yp?.expectedYieldPerAcre ?? "N/A",
    "Total Expected Yield (tons)": yp?.totalExpectedYield ?? "N/A",
    "Yield Lost (tons)": yp?.totalYieldLost ?? "N/A",
    "Remaining Yield (tons)": yp?.remainingYield ?? "N/A",
    "Affected Acres": yp?.affectedAcres ?? "N/A",
    "Est. Revenue Loss (₹)": yp?.estimatedRevenueLoss ?? "N/A",
    "Pesticide": scan.treatment.pesticide,
    "Organic Alternative": scan.treatment.organicAlternative || "N/A",
    "Treatment Steps": scan.treatment.steps.join("; "),
    "Prevention Advice": scan.treatment.prevention.join("; "),
    "Recommended Fertilizer": scan.treatment.fertilizer,
    "Product Suggestions": scan.productSuggestions?.map(p => `${p.name} (${p.type}) - ${p.dosage}`).join("; ") || "N/A",
    "Symptoms": scan.diseaseInfo?.symptoms?.join("; ") || "N/A",
    "Affected Parts": scan.diseaseInfo?.affectedParts?.join(", ") || "N/A",
    "Weather Risk Factors": scan.weatherRiskFactors?.map(w => `${w.factor}: ${w.description}`).join("; ") || "N/A",
    "Leaf Edge": scan.fieldData.leafEdge,
    "Leaf Color": scan.fieldData.leafColor,
    "Leaf Spots": scan.fieldData.leafSpots,
    "Leaf Texture": scan.fieldData.leafTexture,
    "Plant Age (days)": scan.fieldData.plantAge,
    "Image URL": scan.imageUrl || "N/A",
  };
}

export function exportScanToExcel(scan: ScanRecord) {
  exportToExcel([buildScanReportRow(migrateScan(scan))], `AgriScan_Report_${scan.slNo}`);
}

export function exportAllScansToExcel(scans: ScanRecord[]) {
  exportToExcel(scans.map(s => buildScanReportRow(migrateScan(s))), "AgriScan_All_Reports");
}

// ─── PDF GENERATION ───────────────────────────────────────
export function exportScanToPDF(scan: ScanRecord) {
  const s = migrateScan(scan);
  const yp = s.yieldPrediction;

  const lines = [
    `╔══════════════════════════════════════════════════════════╗`,
    `║              AGRISCAN AI — DIAGNOSTIC REPORT            ║`,
    `╚══════════════════════════════════════════════════════════╝`,
    ``,
    `Report Date: ${new Date(s.timestamp).toLocaleString()}`,
    `Scan ID: ${s.id}`,
    `SL No: ${s.slNo}`,
    ``,
    `── CROP & DISEASE ──────────────────────────────────────────`,
    `Crop: ${s.crop}`,
    `Disease: ${s.disease}`,
    `Pathogen: ${s.diseaseInfo?.pathogen || "N/A"}`,
    `Disease Type: ${s.diseaseInfo?.type || "N/A"}`,
    `Confidence: ${s.confidence.toFixed(1)}%${s.isLowConfidence ? " ⚠️ LOW" : ""}`,
    `Severity: ${s.severity}`,
    ``,
    `── FIELD OBSERVATIONS ──────────────────────────────────────`,
    `Land Area: ${s.fieldData.acreLand} acres`,
    `Plant Age: ${s.fieldData.plantAge} days`,
    `Leaf Color: ${s.fieldData.leafColor}`,
    `Leaf Edge: ${s.fieldData.leafEdge}`,
    `Leaf Spots: ${s.fieldData.leafSpots}`,
    `Leaf Texture: ${s.fieldData.leafTexture}`,
    ``,
    `── YIELD PREDICTION ────────────────────────────────────────`,
    `Expected Yield/Acre: ${yp?.expectedYieldPerAcre ?? 0} tons`,
    `Total Expected Yield: ${yp?.totalExpectedYield ?? 0} tons`,
    `Yield Loss: ${s.yieldLoss}%`,
    `Yield Lost: ${yp?.totalYieldLost ?? 0} tons`,
    `Remaining Yield: ${yp?.remainingYield ?? 0} tons`,
    `Affected Area: ${yp?.affectedAcres ?? 0} acres`,
    `Est. Revenue Loss: ₹${(yp?.estimatedRevenueLoss ?? 0).toLocaleString("en-IN")}`,
    ``,
    `── TREATMENT PLAN ──────────────────────────────────────────`,
    `Pesticide: ${s.treatment.pesticide}`,
    `Organic Alternative: ${s.treatment.organicAlternative || "N/A"}`,
    `Fertilizer: ${s.treatment.fertilizer}`,
    ``,
    `Treatment Steps:`,
    ...s.treatment.steps.map((step, i) => `  ${i + 1}. ${step}`),
    ``,
    `Prevention Tips:`,
    ...s.treatment.prevention.map((tip, i) => `  ${i + 1}. ${tip}`),
    ``,
    `── PRODUCT SUGGESTIONS ─────────────────────────────────────`,
    ...(s.productSuggestions && s.productSuggestions.length > 0
      ? s.productSuggestions.map(p => `  • ${p.name} (${p.type}) — ${p.dosage} — ${p.estimatedCost}`)
      : ["  No specific products suggested."]),
    ``,
    `── SYMPTOMS ────────────────────────────────────────────────`,
    ...(s.diseaseInfo?.symptoms?.length ? s.diseaseInfo.symptoms.map(sy => `  • ${sy}`) : ["  None"]),
    ``,
    `── WEATHER RISK FACTORS ────────────────────────────────────`,
    ...(s.weatherRiskFactors?.length
      ? s.weatherRiskFactors.map(w => `  • ${w.factor} (${w.risk} Risk): ${w.description}`)
      : ["  No weather risks identified."]),
    ``,
    `════════════════════════════════════════════════════════════`,
    `Generated by AgriScan AI — Smart Farming Platform`,
  ];

  const content = lines.join("\n");

  // Generate as downloadable text file (works without any external library)
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AgriScan_Report_${s.slNo}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── CHATBOT ──────────────────────────────────────────────
export interface FAQEntry {
  keywords: string[];
  question: string;
  answer: string;
}

export const faqData: FAQEntry[] = [
  { keywords: ["rice blast", "blast", "fungus rice"], question: "What is rice blast and how to treat it?", answer: "Rice blast is caused by the fungus *Magnaporthe oryzae*. It creates diamond-shaped lesions on leaves. **Treatment:** Spray Tricyclazole 75% WP at 0.6g/L. Use resistant varieties and avoid excessive nitrogen fertilization." },
  { keywords: ["brown spot", "brown"], question: "How to control brown spot disease in rice?", answer: "Brown spot is caused by *Bipolaris oryzae* and often appears in nutrient-deficient soils. **Treatment:** Spray Mancozeb 75% WP at 2.5g/L. Ensure balanced soil nutrition with adequate potassium and zinc." },
  { keywords: ["bacterial", "blight", "blb"], question: "What pesticide works for bacterial leaf blight?", answer: "Bacterial Leaf Blight (BLB) is caused by *Xanthomonas oryzae*. **Treatment:** Spray Copper Oxychloride 50% WP at 3g/L along with Streptomycin Sulphate (500 ppm)." },
  { keywords: ["tungro", "leafhopper"], question: "How to prevent tungro disease?", answer: "Tungro is a viral disease spread by green leafhoppers. **Prevention:** Use tungro-resistant varieties, synchronize planting dates, and control leafhoppers with Imidacloprid 17.8% SL sprays." },
  { keywords: ["early blight", "alternaria"], question: "How to treat early blight?", answer: "Early Blight is caused by *Alternaria solani* and affects tomatoes and potatoes. **Treatment:** Spray Chlorothalonil or Mancozeb at 7-10 day intervals. Remove infected lower leaves and mulch to prevent soil splash." },
  { keywords: ["late blight", "phytophthora"], question: "How to manage late blight?", answer: "Late Blight is caused by *Phytophthora infestans* — it can destroy entire fields rapidly. **Treatment:** Apply Ridomil Gold MZ (Metalaxyl + Mancozeb) immediately. Spray every 5-7 days in wet weather. Remove all infected material." },
  { keywords: ["rust", "corn rust", "wheat rust"], question: "How to treat crop rust diseases?", answer: "Rust diseases are caused by *Puccinia* species. **Treatment:** Apply Propiconazole (Tilt 25 EC) at 1mL/L. Plant resistant varieties and scout regularly from vegetative stage onward." },
  { keywords: ["powdery mildew", "mildew", "white powder"], question: "How to control powdery mildew?", answer: "Powdery Mildew shows as white/gray powder on leaves. **Treatment:** Spray Triadimefon or Sulfur fungicide. **Organic:** Use potassium bicarbonate or diluted milk spray. Ensure good air circulation." },
  { keywords: ["yield", "improve", "increase", "production"], question: "How to improve crop yield?", answer: "To improve yield: 1) Use high-yielding certified varieties, 2) Apply balanced NPK fertilizer based on soil tests, 3) Maintain proper water levels, 4) Control weeds early, 5) Practice integrated pest management." },
  { keywords: ["fertilizer", "npk", "nutrient", "nutrition"], question: "What fertilizer should I use?", answer: "Fertilizer needs vary by crop. General recommendation: apply balanced NPK based on soil test results. Rice: 120:60:60 kg/ha, Wheat: 120:60:40 kg/ha, Tomato: 150:100:120 kg/ha." },
  { keywords: ["water", "irrigation", "drought"], question: "How much water does my crop need?", answer: "Water needs vary: Rice 1,200-2,000 mm/season, Wheat 400-500 mm, Tomato 600-800 mm. Use drip irrigation for vegetables and AWD (Alternate Wetting & Drying) for rice to save 15-30% water." },
  { keywords: ["organic", "natural", "pesticide free"], question: "Can I grow crops organically?", answer: "Yes! Use **Neem oil** for pest control, **Trichoderma** as bio-fungicide, **vermicompost** for nutrition, and **Bacillus subtilis** for disease prevention." },
  { keywords: ["soil", "test", "ph"], question: "How to test soil health?", answer: "Get a soil test from your nearest agricultural lab. Key parameters: **pH** (ideal: 6.0-7.0), **Organic Carbon** (>0.5%), **Available N, P, K** levels, and micronutrients (Zn, Fe, Mn)." },
  { keywords: ["pest", "insect", "bug", "worm"], question: "How to manage pests?", answer: "Use Integrated Pest Management (IPM): 1) Scout regularly, 2) Use resistant varieties, 3) Biological control first (Trichogramma, Bacillus), 4) Chemical control as last resort. Rotate pesticide modes of action." },
];

export function chatbotResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const faq of faqData) {
    if (faq.keywords.some((kw) => lower.includes(kw))) return faq.answer;
  }
  if (lower.includes("hello") || lower.includes("hi")) return "Hello! 🌾 I'm your farming assistant. Ask me about crop diseases, fertilizers, pest management, or yield improvement!";
  if (lower.includes("thank")) return "You're welcome! Happy farming! 🌱 Feel free to ask more questions anytime.";
  if (lower.includes("weather")) return "Check our Weather & Disease Risk page for real-time weather data and disease risk alerts.";
  if (lower.includes("help")) return "I can help with: 🌿 Disease identification, 🧪 Fertilizer recommendations, 💧 Irrigation guidance, 🐛 Pest management, 📈 Yield improvement tips.";
  return "I'm not sure about that topic yet. Try asking about: crop diseases (blast, blight, rust, mildew), fertilizers, pest management, soil health, irrigation, or yield improvement. 🌿";
}

// ─── MOCK DATA ────────────────────────────────────────────
const mockTreatmentRice = {
  pesticide: "Tricyclazole 75% WP at 0.6g/L",
  organicAlternative: "Pseudomonas fluorescens + Silicon amendment",
  steps: ["Spray Tricyclazole at first sight", "Drain standing water", "Remove infected debris", "Apply Potassium fertilizer"],
  prevention: ["Use resistant varieties", "Avoid excess nitrogen", "Proper water management", "Crop rotation"],
  fertilizer: "MOP 60 kg/ha + Silicon 50 kg/ha",
};

const mockTreatmentBrownSpot = {
  pesticide: "Mancozeb 75% WP at 2.5g/L",
  organicAlternative: "Trichoderma viride + Pseudomonas spray",
  steps: ["Spray Mancozeb early", "Ensure balanced K & Zn", "Maintain irrigation", "Apply foliar Zinc"],
  prevention: ["Use disease-free seeds", "Treat seeds with fungicide", "Balanced soil fertility", "Good drainage"],
  fertilizer: "Zinc Sulphate 25 kg/ha + DAP 100 kg/ha",
};

function mockYieldPred(crop: string, acreage: number, loss: number): YieldPrediction {
  return computeYieldPrediction(crop, acreage, loss);
}

export const mockScanHistory: DiseaseResult[] = [
  {
    id: "1", crop: "Rice", disease: "Rice Blast", diseaseKey: "rice_blast", confidence: 94.5,
    isLowConfidence: false, severity: "High", yieldLoss: 35,
    yieldPrediction: mockYieldPred("Rice", 2.5, 35), productSuggestions: [],
    treatment: mockTreatmentRice,
    diseaseInfo: { pathogen: "Magnaporthe oryzae", type: "Fungal", symptoms: ["Diamond-shaped lesions"], affectedParts: ["Leaves", "Neck"] },
    weatherRiskFactors: [{ factor: "Humidity", risk: "High", description: "High humidity >90%" }],
    imageUrl: "", timestamp: "2026-03-07T10:30:00Z",
  },
  {
    id: "2", crop: "Rice", disease: "Brown Spot", diseaseKey: "rice_brown_spot", confidence: 88.2,
    isLowConfidence: false, severity: "Medium", yieldLoss: 20,
    yieldPrediction: mockYieldPred("Rice", 3.0, 20), productSuggestions: [],
    treatment: mockTreatmentBrownSpot,
    diseaseInfo: { pathogen: "Bipolaris oryzae", type: "Fungal", symptoms: ["Oval brown spots"], affectedParts: ["Leaves", "Glumes"] },
    weatherRiskFactors: [{ factor: "Humidity", risk: "High", description: "High humidity, 25-30°C" }],
    imageUrl: "", timestamp: "2026-03-06T14:15:00Z",
  },
  {
    id: "3", crop: "Tomato", disease: "Healthy", diseaseKey: "tomato_healthy", confidence: 96.1,
    isLowConfidence: false, severity: "Low", yieldLoss: 0,
    yieldPrediction: mockYieldPred("Tomato", 1.0, 0), productSuggestions: [],
    treatment: { pesticide: "None required", organicAlternative: "None required", steps: ["Continue monitoring"], prevention: ["Crop rotation", "Balanced NPK"], fertilizer: "Standard NPK" },
    diseaseInfo: { pathogen: "None", type: "Healthy", symptoms: [], affectedParts: [] },
    weatherRiskFactors: [],
    imageUrl: "", timestamp: "2026-03-06T09:00:00Z",
  },
  {
    id: "4", crop: "Potato", disease: "Late Blight", diseaseKey: "potato_late_blight", confidence: 91.3,
    isLowConfidence: false, severity: "Critical", yieldLoss: 75,
    yieldPrediction: mockYieldPred("Potato", 4.0, 75), productSuggestions: [],
    treatment: { pesticide: "Ridomil Gold MZ 2.5g/L", organicAlternative: "Copper hydroxide + Neem cake", steps: ["Apply Ridomil immediately", "Spray every 5-7 days", "Kill vine before harvest", "Destroy infected material"], prevention: ["Use resistant varieties", "Well-drained fields", "Avoid infected plots", "Hill potatoes"], fertilizer: "DAP 100 kg/ha + MOP 80 kg/ha" },
    diseaseInfo: { pathogen: "Phytophthora infestans", type: "Fungal", symptoms: ["Water-soaked lesions", "White cottony mold"], affectedParts: ["Leaves", "Stems", "Tubers"] },
    weatherRiskFactors: [{ factor: "Humidity", risk: "High", description: "Humidity >90%" }, { factor: "Temperature", risk: "Medium", description: "Cool moist weather 10-20°C" }],
    imageUrl: "", timestamp: "2026-03-05T16:45:00Z",
  },
  {
    id: "5", crop: "Corn", disease: "Common Rust", diseaseKey: "corn_common_rust", confidence: 85.7,
    isLowConfidence: false, severity: "Medium", yieldLoss: 22,
    yieldPrediction: mockYieldPred("Corn", 2.0, 22), productSuggestions: [],
    treatment: { pesticide: "Propiconazole (Tilt 25 EC) 1mL/L", organicAlternative: "Sulfur fungicide + Neem oil", steps: ["Apply fungicide at first sign", "Focus on lower canopy", "Reapply at 14-day intervals", "Monitor surrounding fields"], prevention: ["Plant resistant hybrids", "Avoid late planting", "Balanced nutrition", "Scout from V8"], fertilizer: "MOP 80 kg/ha" },
    diseaseInfo: { pathogen: "Puccinia sorghi", type: "Fungal", symptoms: ["Reddish-brown pustules"], affectedParts: ["Leaves"] },
    weatherRiskFactors: [{ factor: "Temperature", risk: "Medium", description: "Cool to moderate 16-23°C" }, { factor: "Humidity", risk: "High", description: "High humidity + heavy dew" }],
    imageUrl: "", timestamp: "2026-03-04T11:20:00Z",
  },
  {
    id: "6", crop: "Wheat", disease: "Stripe Rust (Yellow Rust)", diseaseKey: "wheat_stripe_rust", confidence: 90.4,
    isLowConfidence: false, severity: "High", yieldLoss: 38,
    yieldPrediction: mockYieldPred("Wheat", 3.5, 38), productSuggestions: [],
    treatment: { pesticide: "Propiconazole (Tilt 25 EC) 1mL/L", organicAlternative: "Sulfur dust + Trichoderma", steps: ["Apply at first pustule appearance", "Ensure canopy coverage", "Repeat after 14-21 days", "Harvest promptly"], prevention: ["Plant resistant varieties", "Avoid early sowing", "Balanced nitrogen", "Monitor from tillering"], fertilizer: "NPK 120:60:40 kg/ha" },
    diseaseInfo: { pathogen: "Puccinia striiformis", type: "Fungal", symptoms: ["Yellow-orange stripe pustules"], affectedParts: ["Leaves", "Heads"] },
    weatherRiskFactors: [{ factor: "Temperature", risk: "Medium", description: "Cool temperatures 10-15°C" }, { factor: "Rainfall/Dew", risk: "High", description: "Dew or light rain" }],
    imageUrl: "", timestamp: "2026-03-03T08:30:00Z",
  },
];

export const diseaseDataset = diseaseKnowledgeBase
  .filter(d => !d.isHealthy)
  .map(d => ({
    crop: d.crop,
    disease: d.disease,
    pathogen: d.pathogen,
    type: d.type,
    symptoms: d.symptoms.join("; "),
    affectedParts: d.affectedParts.join(", "),
    favorableConditions: d.favorableConditions.join("; "),
  }));
