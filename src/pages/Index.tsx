import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, BarChart3, CloudSun, Map, Leaf, ShieldCheck, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Upload, title: "Disease Detection", desc: "Upload a leaf image and get instant AI-powered disease diagnosis with treatment recommendations." },
  { icon: BarChart3, title: "Yield Prediction", desc: "Predict crop yield based on soil type, rainfall, fertilizer usage, and disease severity." },
  { icon: CloudSun, title: "Weather Alerts", desc: "Real-time weather monitoring with disease risk warnings based on environmental conditions." },
  { icon: Map, title: "Satellite Monitoring", desc: "Monitor farmland health with NDVI vegetation index and interactive satellite maps." },
];

const stats = [
  { value: "5+", label: "Crops Supported" },
  { value: "6+", label: "Diseases Detected" },
  { value: "95%", label: "Detection Accuracy" },
  { value: "24/7", label: "AI Availability" },
];

const Index = () => {
  return (
    <div className="min-h-full">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Leaf className="h-4 w-4 text-primary" />
              AI-Powered Agriculture Platform
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Detect Crop Diseases<br />
              <span className="text-primary">Before They Spread</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Upload a plant leaf image and get instant AI diagnosis, treatment plans, yield predictions, and real-time weather-based disease risk analysis.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 text-base font-semibold shadow-lg animate-pulse-green">
                <Link to="/upload"><Upload className="h-5 w-5" /> Upload a Leaf Image</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base">
                <Link to="/dashboard"><BarChart3 className="h-5 w-5" /> View Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="font-display text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">Powerful Farming Tools</h2>
            <p className="mt-3 text-muted-foreground">Everything you need to protect and optimize your crops</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{f.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-10 text-center text-primary-foreground">
          <ShieldCheck className="mx-auto h-10 w-10 mb-4" />
          <h2 className="font-display text-2xl font-bold">Start Protecting Your Crops Today</h2>
          <p className="mt-3 text-primary-foreground/80">Upload your first leaf image and get instant AI-powered analysis — completely free.</p>
          <Button asChild variant="secondary" size="lg" className="mt-6 font-semibold">
            <Link to="/upload">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Leaf className="h-4 w-4 text-primary" />
          <span className="font-display font-semibold text-foreground">AgriScan AI</span>
        </div>
        <p className="mt-2">© 2026 AgriScan AI. Empowering farmers with artificial intelligence.</p>
      </footer>
    </div>
  );
};

export default Index;
