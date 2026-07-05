import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, ImageIcon, Loader2, X, Sparkles, AlertCircle, KeyRound } from "lucide-react";
import { analyzeWithGemini, NotAPlantLeafError, MissingApiKeyError } from "@/lib/gemini-vision";
import { type FieldData } from "@/lib/mock-ai";
import { motion } from "framer-motion";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isMissingKey, setIsMissingKey] = useState(false);
  const navigate = useNavigate();

  // Field data state
  const [cropName, setCropName] = useState("");
  const [acreLand, setAcreLand] = useState<number>(1);
  const [yieldAffected, setYieldAffected] = useState([0]);

  // Image parameters
  const [leafEdge, setLeafEdge] = useState<FieldData["leafEdge"]>("Normal");
  const [leafColor, setLeafColor] = useState<FieldData["leafColor"]>("Healthy Green");
  const [leafSpots, setLeafSpots] = useState<FieldData["leafSpots"]>("None");
  const [leafTexture, setLeafTexture] = useState<FieldData["leafTexture"]>("Normal");
  const [plantAge, setPlantAge] = useState<number>(45);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setAnalysisError(null);
    setIsMissingKey(false);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    setAnalysisError(null);
    setIsMissingKey(false);

    try {
      // ── Send image directly to Gemini Vision API ────────
      const geminiResult = await analyzeWithGemini(preview);

      // Build field data from the form (used for scan record storage)
      const fieldData: FieldData = {
        cropName: geminiResult.crop || cropName || "Unknown",
        acreLand,
        yieldAffected: yieldAffected[0],
        leafEdge,
        leafColor,
        leafSpots,
        leafTexture,
        plantAge,
      };

      // Store the Gemini result in sessionStorage for ResultPage to display
      sessionStorage.setItem("geminiResult", JSON.stringify(geminiResult));
      sessionStorage.setItem("fieldData", JSON.stringify(fieldData));
      sessionStorage.setItem("scanImageUrl", preview);

      navigate("/result");
    } catch (error) {
      if (error instanceof MissingApiKeyError) {
        setIsMissingKey(true);
        setAnalysisError(error.message);
      } else if (error instanceof NotAPlantLeafError) {
        setAnalysisError(error.message);
      } else if (error instanceof Error) {
        setAnalysisError(`Analysis failed: ${error.message}`);
      } else {
        setAnalysisError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setAnalysisError(null);
    setIsMissingKey(false);
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Upload & Analyze</h1>
          <p className="mt-2 text-muted-foreground">Upload a plant leaf image for AI-powered disease detection via Gemini Vision.</p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Left Column: Image Upload */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Leaf Image Scanner</CardTitle>
                <CardDescription>JPG, PNG, WebP (max 10MB)</CardDescription>
              </CardHeader>
              <CardContent>
                {!preview ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer ${
                      dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">Drag & drop your leaf image here</p>
                    <p className="mt-1 text-sm text-muted-foreground">or click to browse files</p>
                    <input id="file-input" type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-xl border">
                      <img src={preview} alt="Leaf preview" className="w-full max-h-72 object-contain bg-muted/30" />
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={clearFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{file?.name} — {((file?.size || 0) / 1024).toFixed(0)} KB</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">Image Parameters (Optional)</CardTitle>
                <CardDescription>Help improve AI accuracy with visual observations</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Leaf Edge Condition</Label>
                  <Select value={leafEdge} onValueChange={(v) => setLeafEdge(v as FieldData["leafEdge"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Damaged">Damaged</SelectItem>
                      <SelectItem value="Burnt">Burnt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Leaf Color</Label>
                  <Select value={leafColor} onValueChange={(v) => setLeafColor(v as FieldData["leafColor"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healthy Green">Healthy Green</SelectItem>
                      <SelectItem value="Yellow">Yellow</SelectItem>
                      <SelectItem value="Brown">Brown</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Spots on Leaf</Label>
                  <Select value={leafSpots} onValueChange={(v) => setLeafSpots(v as FieldData["leafSpots"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Black Spots">Black Spots</SelectItem>
                      <SelectItem value="Brown Spots">Brown Spots</SelectItem>
                      <SelectItem value="White Powder">White Powder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Leaf Texture</Label>
                  <Select value={leafTexture} onValueChange={(v) => setLeafTexture(v as FieldData["leafTexture"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Dry">Dry</SelectItem>
                      <SelectItem value="Curled">Curled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Field Data */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Field Data</CardTitle>
                <CardDescription>Crop name will be auto-detected by Gemini from the image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Crop Name <span className="text-muted-foreground font-normal">— optional hint</span></Label>
                  <Input
                    placeholder="Leave blank — Gemini will detect it automatically"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Gemini detects the crop from the image. You can override it here.</p>
                </div>

                <div className="space-y-2">
                  <Label>Acre of Land</Label>
                  <Input type="number" value={acreLand} onChange={(e) => setAcreLand(Number(e.target.value))} min={0.1} step={0.1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Yield Affected (%)</Label>
                    <span className="text-sm font-semibold text-primary">{yieldAffected[0]}%</span>
                  </div>
                  <Slider value={yieldAffected} onValueChange={setYieldAffected} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <Label>Plant Age (days) <span className="text-muted-foreground font-normal">— optional</span></Label>
                  <Input type="number" value={plantAge} onChange={(e) => setPlantAge(Number(e.target.value))} min={1} max={365} />
                </div>
              </CardContent>
            </Card>

            {/* Gemini AI Info */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-display font-bold text-foreground text-sm">Powered by Gemini Vision AI</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your image is sent directly to Google Gemini Vision. Gemini will detect the crop, identify the disease,
                      give a confidence score, and provide treatment recommendations — all from the actual image, not a random guess.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analyze Button */}
            <Button className="w-full gap-2 text-base font-semibold" size="lg" disabled={!preview || loading} onClick={handleAnalyze}>
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Sending to Gemini AI...</>
              ) : (
                <><Upload className="h-5 w-5" /> Analyze Leaf Image</>
              )}
            </Button>

            {/* Analysis Error */}
            {analysisError && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className={`border-destructive/40 ${isMissingKey ? "bg-yellow-500/5 border-yellow-500/40" : "bg-destructive/5"}`}>
                  <CardContent className="p-4 flex items-start gap-3">
                    {isMissingKey ? (
                      <KeyRound className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-semibold text-sm ${isMissingKey ? "text-yellow-700" : "text-destructive"}`}>
                        {isMissingKey ? "Backend Not Configured" : "Analysis Error"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{analysisError}</p>
                      {isMissingKey && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Start the backend with your Gemini key (Windows):<br />
                          <code className="bg-muted px-1 rounded text-primary block mt-1 whitespace-pre-wrap">
                            cd backend{"\n"}
                            set GEMINI_API_KEY=AIzaSy...{"\n"}
                            uvicorn main:app --reload
                          </code>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Loading steps */}
            {loading && (
              <Card>
                <CardContent className="p-4 space-y-2">
                  {["Encoding image...", "Sending to Gemini Vision...", "Analyzing plant & disease...", "Processing results..."].map((msg, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                      {msg}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-foreground mb-3">Tips for Best Results</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✅ Take a clear, close-up photo of the affected leaf</li>
                  <li>✅ Ensure good lighting — avoid shadows</li>
                  <li>✅ Include both healthy and diseased parts if possible</li>
                  <li>✅ Fill in optional parameters for more accurate analysis</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
