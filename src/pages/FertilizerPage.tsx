import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { recommendFertilizer, FertilizerRec } from "@/lib/farmer-data";
import { useLanguage } from "@/lib/language-context";

const FertilizerPage = () => {
  const { t } = useLanguage();
  const [crop, setCrop] = useState("Rice");
  const [stage, setStage] = useState("sowing");
  const [soilN, setSoilN] = useState("40");
  const [soilP, setSoilP] = useState("20");
  const [soilK, setSoilK] = useState("20");
  const [results, setResults] = useState<FertilizerRec[] | null>(null);

  const calculate = () => {
    setResults(recommendFertilizer(crop, stage, +soilN, +soilP, +soilK));
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">🧪 {t("fertilizer")}</h1>
          <p className="mt-1 text-muted-foreground">Get fertilizer recommendations based on crop and soil nutrients</p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle className="font-display text-base">Input Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">{t("cropName")}</label>
                <Select value={crop} onValueChange={setCrop}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Rice", "Wheat", "Maize", "Cotton", "Soybean", "Groundnut"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Growth Stage</label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sowing">Sowing / Basal</SelectItem>
                    <SelectItem value="vegetative">Vegetative</SelectItem>
                    <SelectItem value="flowering">Flowering</SelectItem>
                    <SelectItem value="maturity">Maturity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Current Soil N (kg/ha)</label>
                <Input type="number" value={soilN} onChange={e => setSoilN(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Current Soil P (kg/ha)</label>
                <Input type="number" value={soilP} onChange={e => setSoilP(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Current Soil K (kg/ha)</label>
                <Input type="number" value={soilK} onChange={e => setSoilK(e.target.value)} />
              </div>
              <Button onClick={calculate} className="w-full gap-2"><FlaskConical className="h-4 w-4" />Calculate</Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {results ? results.map((rec, i) => (
              <motion.div key={rec.nutrient} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Leaf className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-foreground">{rec.nutrient}</p>
                          <p className="text-sm text-muted-foreground">{rec.type}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="text-lg font-bold">{rec.amount}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground"><strong>Timing:</strong> {rec.timing}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed p-20 text-muted-foreground">
                <FlaskConical className="h-8 w-8 mr-3" /> Enter soil nutrient levels to get recommendations
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizerPage;
