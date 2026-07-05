import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { getMarketPrices } from "@/lib/farmer-data";
import { useLanguage } from "@/lib/language-context";

const MarketPricePage = () => {
  const { t } = useLanguage();
  const prices = getMarketPrices();

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">📊 {t("marketPrices")}</h1>
          <p className="mt-1 text-muted-foreground">Current crop market prices from APMC mandis</p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prices.map((item, i) => (
            <motion.div key={item.crop} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display font-bold text-foreground">{item.crop}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.market}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-primary" />
                      ) : item.change < 0 ? (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-medium ${item.change > 0 ? "text-primary" : item.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {item.change > 0 ? "+" : ""}{item.change}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <IndianRupee className="h-5 w-5 text-foreground" />
                    <span className="text-3xl font-bold font-display text-foreground">{item.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/quintal</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Updated: {item.date}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="p-5 text-center text-sm text-muted-foreground">
            <p>Prices are indicative and sourced from public APMC market data. Actual prices may vary by location and quality grade.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketPricePage;
