import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Sprout, Droplets, FlaskConical, Bug, Eye, Scissors } from "lucide-react";
import { motion } from "framer-motion";
import { generateCalendar, CalendarEvent } from "@/lib/farmer-data";
import { useLanguage } from "@/lib/language-context";

const categoryConfig: Record<string, { icon: typeof Sprout; color: string }> = {
  sowing: { icon: Sprout, color: "bg-primary/10 text-primary" },
  fertilizer: { icon: FlaskConical, color: "bg-warning/10 text-warning" },
  irrigation: { icon: Droplets, color: "bg-info/10 text-info" },
  pest: { icon: Bug, color: "bg-destructive/10 text-destructive" },
  inspection: { icon: Eye, color: "bg-muted text-muted-foreground" },
  harvest: { icon: Scissors, color: "bg-accent/10 text-accent-foreground" },
};

const FarmCalendarPage = () => {
  const { t } = useLanguage();
  const [crop, setCrop] = useState("Rice (Paddy)");
  const events = generateCalendar(crop);

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">📅 {t("farmCalendar")}</h1>
          <p className="mt-1 text-muted-foreground">Smart crop lifecycle schedule</p>
        </motion.div>

        <div className="mt-6">
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Rice (Paddy)", "Wheat", "Maize", "Cotton"].map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-4">
            {events.map((event, i) => {
              const cfg = categoryConfig[event.category] || categoryConfig.inspection;
              const Icon = cfg.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="relative pl-14">
                    <div className={`absolute left-3 flex h-7 w-7 items-center justify-center rounded-full ${cfg.color} ring-4 ring-background`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-display font-bold text-foreground">{event.activity}</p>
                            <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                          </div>
                          <Badge variant="secondary">{t("week")} {event.week}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmCalendarPage;
