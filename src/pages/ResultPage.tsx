import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { type GeminiResult } from "@/lib/gemini-vision";
import { type FieldData } from "@/lib/mock-ai";
import {
  ArrowLeft, Leaf, Bug, Sparkles, ShieldCheck, BarChart3, FileSpreadsheet,
} from "lucide-react";
import { motion } from "framer-motion";

// ─── HELPERS ──────────────────────────────────────────────

function confidenceLabel(confidence: number): { label: string; color: string } {
  if (confidence >= 85) return { label: "High Confidence", color: "text-primary" };
  if (confidence >= 60) return { label: "Medium Confidence", color: "text-yellow-600" };
  return { label: "Low Confidence", color: "text-destructive" };
}

function severityFromConfidenceAndDisease(disease: string, confidence: number): {
  severity: string; color: string;
} {
  const isHealthy = disease.toLowerCase().includes("healthy") || disease.toLowerCase() === "none";
  if (isHealthy) return { severity: "Healthy", color: "bg-primary/10 text-primary" };
  if (confidence >= 85) return { severity: "High Concern", color: "bg-destructive/10 text-destructive" };
  if (confidence >= 60) return { severity: "Moderate", color: "bg-yellow-500/10 text-yellow-600" };
  return { severity: "Low Concern", color: "bg-muted text-muted-foreground" };
}

// ─── COMPONENT ────────────────────────────────────────────

const ResultPage = () => {
  const [result, setResult] = useState<GeminiResult | null>(null);
  const [fieldData, setFieldData] = useState<FieldData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const geminiRaw = sessionStorage.getItem("geminiResult");
    const fieldRaw = sessionStorage.getItem("fieldData");
    const img = sessionStorage.getItem("scanImageUrl");

    if (!geminiRaw) {
      navigate("/upload");
      return;
    }

    try {
      setResult(JSON.parse(geminiRaw));
      if (fieldRaw) setFieldData(JSON.parse(fieldRaw));
      if (img) setImageUrl(img);
    } catch {
      navigate("/upload");
    }
  }, [navigate]);

  if (!result) return null;

  const { label: confLabel, color: confColor } = confidenceLabel(result.confidence);
  const { severity, color: severityColor } = severityFromConfidenceAndDisease(result.disease, result.confidence);
  const isHealthy = severity === "Healthy";

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/upload")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Scan Results</h1>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> Powered by Gemini Vision AI
            </span>
          </div>
        </motion.div>

        <div className="space-y-6">

          {/* Scanned Image */}
          {imageUrl && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <CardContent className="p-4">
                  <img
                    src={imageUrl}
                    alt="Analyzed leaf"
                    className="w-full max-h-80 object-contain rounded-lg bg-muted/30"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Result Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className={`border-2 ${isHealthy ? "border-primary/30" : "border-destructive/30"}`}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display flex items-center gap-2">
                  <Bug className="h-5 w-5 text-primary" /> Detection Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">

                {/* Crop & Disease */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/50 border p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Leaf className="h-3 w-3" /> Crop Detected
                    </p>
                    <p className="text-2xl font-bold text-foreground">{result.crop}</p>
                  </div>
                  <div className={`rounded-lg border p-4 ${isHealthy ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"}`}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Bug className="h-3 w-3" /> Disease Status
                    </p>
                    <p className={`text-2xl font-bold ${isHealthy ? "text-primary" : "text-destructive"}`}>
                      {result.disease}
                    </p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Confidence Score</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-lg ${confColor}`}>{result.confidence}%</span>
                      <Badge variant="outline" className={`text-xs ${confColor}`}>{confLabel}</Badge>
                    </div>
                  </div>
                  <Progress value={result.confidence} className="h-3" />
                </div>

                {/* Severity Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Assessment</span>
                  <Badge className={`${severityColor} px-3 py-1 text-sm font-semibold`}>{severity}</Badge>
                </div>

              </CardContent>
            </Card>
          </motion.div>

          {/* Gemini Recommendation */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="font-display flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Gemini AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{result.recommendation}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Field Data Summary */}
          {fieldData && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-display flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" /> Field Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                    {[
                      { label: "Land Area", value: `${fieldData.acreLand} acres` },
                      { label: "Plant Age", value: `${fieldData.plantAge} days` },
                      { label: "Leaf Color", value: fieldData.leafColor },
                      { label: "Leaf Edge", value: fieldData.leafEdge },
                      { label: "Spots", value: fieldData.leafSpots },
                      { label: "Texture", value: fieldData.leafTexture },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-semibold text-sm text-foreground mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Prevention tip for healthy plants */}
          {isHealthy && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" /> Keep Your Crop Healthy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex gap-2"><span className="text-primary">•</span> Monitor leaves regularly for early signs of disease</li>
                    <li className="flex gap-2"><span className="text-primary">•</span> Maintain balanced NPK fertilization based on soil tests</li>
                    <li className="flex gap-2"><span className="text-primary">•</span> Ensure proper irrigation and drainage</li>
                    <li className="flex gap-2"><span className="text-primary">•</span> Practice crop rotation to prevent soil-borne pathogens</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bottom Actions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/upload"><ArrowLeft className="h-4 w-4" /> Scan Another Image</Link>
              </Button>
              <Button asChild className="gap-2">
                <Link to="/dashboard"><Leaf className="h-4 w-4" /> View Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/dataset"><FileSpreadsheet className="h-4 w-4" /> View All Reports</Link>
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ResultPage;
