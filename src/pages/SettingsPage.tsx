import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Bell, Palette, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { Language } from "@/lib/farmer-data";

const SettingsPage = () => {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">Configure your platform preferences</p>
        </motion.div>

        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Farm Location
              </CardTitle>
              <CardDescription>Set your farm location for weather and satellite data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input defaultValue="17.385" type="number" step="0.001" />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input defaultValue="78.487" type="number" step="0.001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Farm Name</Label>
                <Input defaultValue="My Farm" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Disease Risk Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified about high-risk weather conditions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Scan Results</p>
                  <p className="text-xs text-muted-foreground">Notify when AI analysis is complete</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Weekly Reports</p>
                  <p className="text-xs text-muted-foreground">Receive weekly farm health summaries</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" /> {t("language")}
              </CardTitle>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={lang} onValueChange={(v) => setLang(v as Language)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t("english")}</SelectItem>
                  <SelectItem value="hi">{t("hindi")}</SelectItem>
                  <SelectItem value="kn">{t("kannada")}</SelectItem>
                  <SelectItem value="te">{t("telugu")}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" /> Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Crop</Label>
                <Select defaultValue="rice">
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
                <Label>Unit System</Label>
                <Select defaultValue="metric">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg, hectares)</SelectItem>
                    <SelectItem value="imperial">Imperial (lbs, acres)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
