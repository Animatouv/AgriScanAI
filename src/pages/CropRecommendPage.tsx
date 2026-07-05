import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sprout, Star, Droplets, Thermometer, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { recommendCrops, CropRecommendation } from "@/lib/farmer-data";
import { useLanguage } from "@/lib/language-context";

const CropRecommendPage = () => {
  const { t } = useLanguage();
  const [soilType, setSoilType] = useState("loamy");
  const [rainfall, setRainfall] = useState("1000");
  const [temperature, setTemperature] = useState("28");
  const [season, setSeason] = useState("kharif");
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/recommend-crop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soilType,
          rainfall: +rainfall,
          temperature: +temperature,
          season,
        }),
      });
      if (!response.ok) throw new Error("Recommendation failed");
      const recs = await response.json();
      setResults(recs);
    } catch (error) {
      console.error("API error, falling back to rule-engine:", error);
      const recs = recommendCrops({
        soilType,
        rainfall: +rainfall,
        temperature: +temperature,
        season,
      });
      setResults(recs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">🌱 {t("cropRecommend")}</h1>
          <p className="mt-1 text-muted-foreground">Get personalized crop recommendations based on your farm conditions</p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="font-display text-base">Farm Conditions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">{t("soilType")}</label>
                <Select value={soilType} onValueChange={setSoilType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="silt">Silt</SelectItem>
                    <SelectItem value="peat">Peat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t("rainfall")} (mm/year)</label>
                <Input type="number" value={rainfall} onChange={(e) => setRainfall(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t("temperature")} (°C)</label>
                <Input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t("season")}</label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">Kharif (Jun-Oct)</SelectItem>
                    <SelectItem value="rabi">Rabi (Nov-Mar)</SelectItem>
                    <SelectItem value="zaid">Zaid (Mar-Jun)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleRecommend} className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
                {t("getRecommendation")}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {results ? results.map((crop, i) => (
              <motion.div key={crop.crop} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={i === 0 ? "border-primary shadow-md" : ""}>
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        {i === 0 ? <Star className="h-5 w-5" /> : <Sprout className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div>
                        <p className="font-display font-bold text-foreground">{crop.crop}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Droplets className="h-3 w-3" />{crop.waterNeed}</span>
                          <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" />{crop.season}</span>
                          <span>{crop.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={i === 0 ? "default" : "secondary"}>{crop.score}% match</Badge>
                      {i === 0 && <p className="text-xs text-primary font-medium mt-1">{t("recommended")}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed p-20 text-muted-foreground">
                <Sprout className="h-8 w-8 mr-3" /> Fill in your farm conditions and click "{t("getRecommendation")}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendPage;
