import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug, Search, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { pestDatabase, PestEntry } from "@/lib/farmer-data";
import { useLanguage } from "@/lib/language-context";

const severityColor: Record<string, string> = {
  Low: "bg-primary/10 text-primary",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
};

const PestMonitorPage = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");

  const filtered = pestDatabase.filter(p => {
    const matchCrop = cropFilter === "all" || p.crop.toLowerCase() === cropFilter.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.symptoms.toLowerCase().includes(search.toLowerCase());
    return matchCrop && matchSearch;
  });

  const crops = [...new Set(pestDatabase.map(p => p.crop))];

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">🐛 {t("pestMonitor")}</h1>
          <p className="mt-1 text-muted-foreground">Identify pests and get treatment recommendations</p>
        </motion.div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={cropFilter} onValueChange={setCropFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All crops" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              {crops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((pest, i) => (
            <motion.div key={pest.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-base flex items-center gap-2">
                      <Bug className="h-4 w-4 text-destructive" /> {pest.name}
                    </CardTitle>
                    <Badge className={severityColor[pest.severity]}>{pest.severity}</Badge>
                  </div>
                  <Badge variant="outline" className="w-fit">{pest.crop}</Badge>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Symptoms</p>
                    <p className="text-muted-foreground">{pest.symptoms}</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">{t("treatment")}</p>
                    <p className="text-muted-foreground">{pest.treatment}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t("prevention")}</p>
                    <p className="text-muted-foreground">{pest.prevention}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PestMonitorPage;
