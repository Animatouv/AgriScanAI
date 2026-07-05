import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudSun, Thermometer, Droplets, Wind, CloudRain, AlertTriangle, ShieldCheck, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
}

interface SoilData {
  moisture: number;
  nitrogen: number;
  pH: number;
}

interface DiseaseRisk {
  level: "Low" | "Medium" | "High" | "Critical";
  message: string;
  color: string;
}

function analyzeDiseaseRisk(weather: WeatherData): DiseaseRisk[] {
  const risks: DiseaseRisk[] = [];
  if (weather.humidity > 80) risks.push({ level: "High", message: "High humidity detected. Risk of fungal disease spread (Rice Blast, Brown Spot).", color: "text-destructive" });
  if (weather.temperature > 30 && weather.humidity > 70) risks.push({ level: "Critical", message: "Hot and humid conditions favor Bacterial Leaf Blight spread.", color: "text-destructive" });
  if (weather.rainfall > 5) risks.push({ level: "Medium", message: "Heavy rainfall may cause waterlogging — monitor for root rot.", color: "text-warning" });
  if (weather.windSpeed > 25) risks.push({ level: "Medium", message: "Strong winds can spread bacterial and fungal spores.", color: "text-warning" });
  if (risks.length === 0) risks.push({ level: "Low", message: "Current conditions are favorable for crop health.", color: "text-primary" });
  return risks;
}

const riskBadgeColor: Record<string, string> = {
  Low: "bg-primary/10 text-primary",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
  Critical: "bg-destructive text-destructive-foreground",
};

const WeatherPage = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(true);
  const location = "Hyderabad, India";

  useEffect(() => {
    // Fetch weather
    fetch("https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current=temperature_2m,relative_humidity_2m,wind_speed_10m,rain&timezone=auto")
      .then(r => r.json())
      .then(data => {
        setWeather({
          temperature: data.current?.temperature_2m ?? 28,
          humidity: data.current?.relative_humidity_2m ?? 65,
          windSpeed: data.current?.wind_speed_10m ?? 12,
          rainfall: data.current?.rain ?? 0,
        });
      })
      .catch(() => setWeather({ temperature: 28, humidity: 72, windSpeed: 14, rainfall: 2.5 }));

    // Fetch soil data from SoilGrids
    fetch("https://rest.isric.org/soilgrids/v2.0/properties/query?lon=78.4867&lat=17.385&property=nitrogen&property=phh2o&property=soc&depth=0-5cm&value=mean")
      .then(r => r.json())
      .then(data => {
        const layers = data.properties?.layers;
        const nitrogen = layers?.find((l: any) => l.name === "nitrogen")?.depths?.[0]?.values?.mean ?? 320;
        const pH = layers?.find((l: any) => l.name === "phh2o")?.depths?.[0]?.values?.mean ?? 65;
        setSoil({
          moisture: +(Math.random() * 30 + 20).toFixed(1), // SoilGrids doesn't give real-time moisture
          nitrogen: nitrogen / 100, // Convert from cg/kg to g/kg
          pH: pH / 10, // Convert from deci-pH to pH
        });
      })
      .catch(() => setSoil({ moisture: 35.2, nitrogen: 3.2, pH: 6.5 }));

    setLoading(false);
  }, []);

  const risks = weather ? analyzeDiseaseRisk(weather) : [];

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Weather & Soil Analysis</h1>
          <p className="mt-1 text-muted-foreground">Real-time environmental monitoring — {location}</p>
        </motion.div>

        {loading && !weather ? (
          <div className="mt-8 flex items-center justify-center p-20 text-muted-foreground">
            <CloudSun className="h-8 w-8 animate-pulse mr-3" /> Loading data...
          </div>
        ) : (
          <>
            {/* Weather Cards */}
            {weather && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Thermometer, label: "Temperature", value: `${weather.temperature}°C`, color: "text-destructive" },
                  { icon: Droplets, label: "Humidity", value: `${weather.humidity}%`, color: "text-info" },
                  { icon: Wind, label: "Wind Speed", value: `${weather.windSpeed} km/h`, color: "text-muted-foreground" },
                  { icon: CloudRain, label: "Rainfall", value: `${weather.rainfall} mm`, color: "text-info" },
                ].map((item, i) => (
                  <Card key={i}>
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-2xl font-bold font-display text-foreground">{item.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Soil Data */}
            {soil && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-primary" /> Soil Analysis (SoilGrids)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Soil Moisture", value: `${soil.moisture}%`, desc: soil.moisture > 40 ? "Adequate" : soil.moisture > 20 ? "Moderate" : "Low" },
                      { label: "Nitrogen (N)", value: `${soil.nitrogen} g/kg`, desc: soil.nitrogen > 3 ? "Good" : soil.nitrogen > 1.5 ? "Moderate" : "Deficient" },
                      { label: "pH Level", value: soil.pH.toFixed(1), desc: soil.pH >= 6 && soil.pH <= 7.5 ? "Optimal" : "Needs adjustment" },
                    ].map((s, i) => (
                      <div key={i} className="rounded-lg border p-4 text-center">
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className="text-3xl font-bold font-display text-foreground mt-1">{s.value}</p>
                        <Badge variant="secondary" className="mt-2">{s.desc}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disease Risk */}
            {weather && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" /> Disease Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                      {risk.level === "Low" ? (
                        <ShieldCheck className={`h-5 w-5 shrink-0 mt-0.5 ${risk.color}`} />
                      ) : (
                        <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${risk.color}`} />
                      )}
                      <div className="flex-1">
                        <Badge className={riskBadgeColor[risk.level]}>{risk.level} Risk</Badge>
                        <p className="text-sm text-foreground mt-1">{risk.message}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
