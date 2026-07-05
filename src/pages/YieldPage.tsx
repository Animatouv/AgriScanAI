import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { predictYield } from "@/lib/mock-ai";
import { BarChart3, Wheat, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const YieldPage = () => {
  const [form, setForm] = useState({
    cropType: "rice",
    soilType: "loamy",
    rainfall: 1200,
    fertilizer: 120,
    acreage: 5,
    diseaseSeverity: "low",
  });
  const [result, setResult] = useState<{ yieldPerAcre: number; totalYield: number; quality: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const res = predictYield(form);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Yield Prediction</h1>
          <p className="mt-1 text-muted-foreground">Predict crop yield based on farming conditions</p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Input Parameters</CardTitle>
              <CardDescription>Enter your farming conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Crop Type</Label>
                <Select value={form.cropType} onValueChange={(v) => setForm({ ...form, cropType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="tomato">Tomato</SelectItem>
                    <SelectItem value="potato">Potato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Soil Type</Label>
                <Select value={form.soilType} onValueChange={(v) => setForm({ ...form, soilType: v })}>
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
              <div className="space-y-2">
                <Label>Rainfall (mm/year)</Label>
                <Input type="number" value={form.rainfall} onChange={(e) => setForm({ ...form, rainfall: +e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Fertilizer (kg/ha)</Label>
                <Input type="number" value={form.fertilizer} onChange={(e) => setForm({ ...form, fertilizer: +e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Acreage</Label>
                <Input type="number" value={form.acreage} onChange={(e) => setForm({ ...form, acreage: +e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Disease Severity</Label>
                <Select value={form.diseaseSeverity} onValueChange={(v) => setForm({ ...form, diseaseSeverity: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full gap-2 mt-2" onClick={handlePredict} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                {loading ? "Predicting..." : "Predict Yield"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <Wheat className="h-5 w-5 text-primary" /> Prediction Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-6 rounded-xl bg-primary/5">
                      <p className="text-sm text-muted-foreground">Expected Yield Per Acre</p>
                      <p className="text-4xl font-bold font-display text-primary mt-1">{result.yieldPerAcre}</p>
                      <p className="text-sm text-muted-foreground">tons/acre</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-secondary p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total Yield</p>
                        <p className="text-2xl font-bold font-display text-foreground">{result.totalYield}</p>
                        <p className="text-xs text-muted-foreground">tons</p>
                      </div>
                      <div className="rounded-lg bg-secondary p-4 text-center">
                        <p className="text-sm text-muted-foreground">Quality Grade</p>
                        <p className="text-2xl font-bold font-display text-foreground">{result.quality}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Yield Efficiency</span>
                        <span className="font-medium text-foreground">{Math.min(100, (result.yieldPerAcre / 5) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(100, (result.yieldPerAcre / 5) * 100)} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Wheat className="h-8 w-8 text-primary" />
                </div>
                <p className="font-display font-bold text-foreground">No Prediction Yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Fill in the parameters and click predict to see yield estimates.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldPage;
