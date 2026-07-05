import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, CloudRain, Thermometer, Wind, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { getIrrigationAdvice } from "@/lib/farmer-data";
import { useLanguage } from "@/lib/language-context";

const IrrigationPage = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState({ temperature: 28, humidity: 65, rainfall: 0 });
  const [soilMoisture, setSoilMoisture] = useState(35);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current=temperature_2m,relative_humidity_2m,rain&timezone=auto")
      .then(r => r.json())
      .then(data => {
        setWeather({
          temperature: data.current?.temperature_2m ?? 28,
          humidity: data.current?.relative_humidity_2m ?? 65,
          rainfall: data.current?.rain ?? 0,
        });
        setSoilMoisture(+(Math.random() * 30 + 20).toFixed(1));
      })
      .catch(() => {});
  }, []);

  const advice = getIrrigationAdvice(weather, soilMoisture, "Rice");

  const actionColor = {
    irrigate: "bg-info text-info-foreground",
    skip: "bg-primary/10 text-primary",
    reduce: "bg-warning/10 text-warning",
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">💧 {t("irrigation")}</h1>
          <p className="mt-1 text-muted-foreground">Smart irrigation advice based on weather and soil data</p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            { icon: Thermometer, label: t("temperature"), value: `${weather.temperature}°C`, color: "text-destructive" },
            { icon: Droplets, label: "Humidity", value: `${weather.humidity}%`, color: "text-info" },
            { icon: CloudRain, label: t("rainfall"), value: `${weather.rainfall} mm`, color: "text-info" },
            { icon: Droplets, label: "Soil Moisture", value: `${soilMoisture}%`, color: "text-primary" },
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-3 p-4">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-bold font-display text-foreground">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                {advice.action === "skip" ? <CheckCircle className="h-5 w-5 text-primary" /> : <AlertTriangle className="h-5 w-5 text-warning" />}
                Irrigation Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`text-base px-4 py-1 ${actionColor[advice.action]}`}>{advice.advice}</Badge>
              </div>
              <p className="text-muted-foreground">{advice.details}</p>

              <div className="mt-6 rounded-lg border p-4">
                <h4 className="font-display font-bold text-foreground mb-2">7-Day Forecast Tip</h4>
                <p className="text-sm text-muted-foreground">
                  {weather.humidity > 70
                    ? "High humidity expected this week. Monitor for fungal diseases and reduce irrigation frequency."
                    : "Normal conditions expected. Follow standard irrigation schedule for your crop stage."}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default IrrigationPage;
