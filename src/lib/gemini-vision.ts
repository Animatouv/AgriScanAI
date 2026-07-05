// ============================================================
// AgriScan AI — Gemini Vision (via Backend Proxy)
// Sends image to FastAPI backend which calls Gemini server-side.
// No API key needed in the browser.
// ============================================================

// ─── ERROR TYPES ──────────────────────────────────────────

/** Thrown when the image is not a plant leaf */
export class NotAPlantLeafError extends Error {
  constructor(message = "This image does not contain a plant leaf. Please upload a clear photo of a plant leaf.") {
    super(message);
    this.name = "NotAPlantLeafError";
  }
}

/** Thrown when the backend Gemini service is not configured */
export class MissingApiKeyError extends Error {
  constructor(message = "Gemini API is not configured on the server. Please set the GEMINI_API_KEY environment variable on the backend.") {
    super(message);
    this.name = "MissingApiKeyError";
  }
}

// ─── RESULT TYPE ──────────────────────────────────────────

export interface GeminiResult {
  isPlant: true;
  crop: string;
  disease: string;
  confidence: number;
  recommendation: string;
}

// ─── BACKEND URL ──────────────────────────────────────────
// Vite proxies /api/* to http://localhost:8000 (see vite.config.ts)
const BACKEND_URL = "/api/analyze-image";

// ─── MAIN FUNCTION ────────────────────────────────────────

/**
 * Sends the image to the FastAPI backend, which forwards it to Gemini Vision.
 * The API key lives only on the server — never in the browser.
 *
 * @throws {NotAPlantLeafError} if image is not a plant leaf
 * @throws {MissingApiKeyError} if backend Gemini is not configured
 * @throws {Error} for network or parse failures
 */
export async function analyzeWithGemini(imageDataUrl: string): Promise<GeminiResult> {
  let response: Response;

  try {
    response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageDataUrl }),
    });
  } catch {
    throw new Error(
      "Cannot reach the backend server. Make sure the Python backend is running:\n" +
      "cd backend && uvicorn main:app --reload"
    );
  }

  // 503 = Gemini not configured on server
  if (response.status === 503) {
    throw new MissingApiKeyError();
  }

  // 422 = Gemini says not a plant leaf
  if (response.status === 422) {
    const body = await response.json().catch(() => ({}));
    const detail = body?.detail;
    const msg = typeof detail === "object" ? detail?.message : String(detail ?? "");
    throw new NotAPlantLeafError(msg || "This image does not contain a plant leaf.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = body?.detail ?? "Unknown error from backend.";
    throw new Error(`Backend error (${response.status}): ${detail}`);
  }

  const data = await response.json();

  return {
    isPlant: true,
    crop: data.crop ?? "Unknown",
    disease: data.disease ?? "Unknown",
    confidence: Math.min(100, Math.max(0, Number(data.confidence ?? 50))),
    recommendation: data.recommendation ?? "No recommendation available.",
  };
}
