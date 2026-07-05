import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, Leaf } from "lucide-react";
import { motion } from "framer-motion";

// Simulated NDVI farm zones
const farmZones = [
  { id: 1, name: "North Field", lat: 17.39, lng: 78.48, ndvi: 0.82, health: "Healthy", color: "#16a34a" },
  { id: 2, name: "East Paddy", lat: 17.385, lng: 78.495, ndvi: 0.55, health: "Moderate", color: "#eab308" },
  { id: 3, name: "South Plot", lat: 17.38, lng: 78.485, ndvi: 0.32, health: "Stressed", color: "#dc2626" },
  { id: 4, name: "West Field", lat: 17.388, lng: 78.475, ndvi: 0.75, health: "Healthy", color: "#16a34a" },
  { id: 5, name: "Central Block", lat: 17.386, lng: 78.487, ndvi: 0.61, health: "Moderate", color: "#eab308" },
];

const healthBadge: Record<string, string> = {
  Healthy: "bg-primary/10 text-primary",
  Moderate: "bg-warning/10 text-warning",
  Stressed: "bg-destructive/10 text-destructive",
};

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;

    // Dynamically import leaflet
    const loadMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, { zoomControl: true }).setView([17.386, 78.487], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      farmZones.forEach((zone) => {
        const circle = L.circleMarker([zone.lat, zone.lng], {
          radius: 25,
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.35,
          weight: 2,
        }).addTo(map);

        circle.bindPopup(`
          <div style="font-family: sans-serif;">
            <strong>${zone.name}</strong><br/>
            NDVI: ${zone.ndvi}<br/>
            Status: ${zone.health}
          </div>
        `);
      });

      setMapLoaded(true);
    };

    loadMap();
  }, [mapLoaded]);

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Satellite Monitoring</h1>
          <p className="mt-1 text-muted-foreground">Monitor farmland health using NDVI vegetation index</p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" /> Farm Health Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={mapRef} className="h-[450px] rounded-lg border" />
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-primary" /> Healthy (NDVI &gt; 0.7)</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-warning" /> Moderate (0.4–0.7)</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-destructive" /> Stressed (&lt; 0.4)</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Farm Zones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {farmZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm text-foreground">{zone.name}</p>
                      <p className="text-xs text-muted-foreground">NDVI: {zone.ndvi}</p>
                    </div>
                    <Badge className={healthBadge[zone.health]}>{zone.health}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
