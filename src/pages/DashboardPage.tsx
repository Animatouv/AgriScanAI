import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { loadScans, exportAllScansToExcel, exportScanToExcel, exportScanToPDF, type ScanRecord } from "@/lib/mock-ai";
import { Bug, Leaf, TrendingUp, AlertTriangle, Download, FileDown, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const diseaseDistribution = [
  { name: "Rice Blast", value: 32, color: "hsl(0, 84%, 60%)" },
  { name: "Brown Spot", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "BLB", value: 18, color: "hsl(280, 60%, 50%)" },
  { name: "Tungro", value: 12, color: "hsl(210, 80%, 55%)" },
  { name: "Healthy", value: 13, color: "hsl(142, 72%, 45%)" },
];

const healthTrend = [
  { month: "Oct", healthy: 65, diseased: 35 },
  { month: "Nov", healthy: 58, diseased: 42 },
  { month: "Dec", healthy: 70, diseased: 30 },
  { month: "Jan", healthy: 72, diseased: 28 },
  { month: "Feb", healthy: 60, diseased: 40 },
  { month: "Mar", healthy: 68, diseased: 32 },
];

const yieldData = [
  { crop: "Rice", predicted: 2.8, actual: 2.5 },
  { crop: "Wheat", predicted: 3.2, actual: 3.0 },
  { crop: "Corn", predicted: 4.5, actual: 4.1 },
  { crop: "Tomato", predicted: 14, actual: 12 },
];

const severityColor: Record<string, string> = {
  Low: "bg-primary/10 text-primary",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
  Critical: "bg-destructive text-destructive-foreground",
};

const DashboardPage = () => {
  const [scans] = useState<ScanRecord[]>(() => loadScans());
  const [exportingAll, setExportingAll] = useState(false);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const totalScans = scans.length;
  const diseasedScans = scans.filter(s => s.disease !== "Healthy").length;
  const avgConfidence = totalScans > 0 ? (scans.reduce((a, s) => a + s.confidence, 0) / totalScans).toFixed(1) : "0";

  const handleExportAll = async () => {
    setExportingAll(true);
    await new Promise(r => setTimeout(r, 500));
    exportAllScansToExcel(scans);
    setExportingAll(false);
  };

  const handleExportSingle = async (scan: ScanRecord, type: "excel" | "pdf") => {
    setExportingId(scan.id + type);
    await new Promise(r => setTimeout(r, 400));
    if (type === "excel") exportScanToExcel(scan);
    else exportScanToPDF(scan);
    setExportingId(null);
  };

  return (
    <div className="p-6 lg:p-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Overview of your farm health and disease analytics</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExportAll} disabled={exportingAll}>
            {exportingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export All to Excel
          </Button>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Bug, label: "Total Scans", value: totalScans, color: "text-primary" },
          { icon: AlertTriangle, label: "Diseases Found", value: diseasedScans, color: "text-destructive" },
          { icon: TrendingUp, label: "Avg. Confidence", value: `${avgConfidence}%`, color: "text-info" },
          { icon: Leaf, label: "Healthy Rate", value: totalScans > 0 ? `${(((totalScans - diseasedScans) / totalScans) * 100).toFixed(0)}%` : "N/A", color: "text-primary" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="font-display">Disease Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={diseaseDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {diseaseDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display">Crop Health Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 88%)" />
                <XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
                <Line type="monotone" dataKey="healthy" stroke="hsl(142, 72%, 45%)" strokeWidth={2} name="Healthy %" />
                <Line type="monotone" dataKey="diseased" stroke="hsl(0, 84%, 60%)" strokeWidth={2} name="Diseased %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-display">Yield Prediction vs Actual (tons/acre)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 88%)" />
                <XAxis dataKey="crop" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="predicted" fill="hsl(142, 72%, 45%)" name="Predicted" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="hsl(210, 80%, 55%)" name="Actual" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader><CardTitle className="font-display">Recent Scans</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Disease</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Yield Loss</TableHead>
                <TableHead className="text-right">Export</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.slice(-10).reverse().map(scan => (
                <TableRow key={scan.id}>
                  <TableCell className="font-mono text-muted-foreground">{scan.slNo}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(scan.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{scan.crop}</TableCell>
                  <TableCell>{scan.disease}</TableCell>
                  <TableCell>{scan.confidence.toFixed(1)}%</TableCell>
                  <TableCell><Badge className={severityColor[scan.severity]}>{scan.severity}</Badge></TableCell>
                  <TableCell className="text-destructive font-medium">{scan.yieldLoss}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Export Excel"
                        onClick={() => handleExportSingle(scan, "excel")} disabled={exportingId === scan.id + "excel"}>
                        {exportingId === scan.id + "excel" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5 text-primary" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Export Report"
                        onClick={() => handleExportSingle(scan, "pdf")} disabled={exportingId === scan.id + "pdf"}>
                        {exportingId === scan.id + "pdf" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5 text-primary" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
