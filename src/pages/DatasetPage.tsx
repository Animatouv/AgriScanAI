import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { loadScans, exportAllScansToExcel, exportScanToExcel, exportScanToPDF, type ScanRecord } from "@/lib/mock-ai";
import { Database, Search, Download, FileDown, FileText, Filter, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const severityColor: Record<string, string> = {
  Low: "bg-primary/10 text-primary",
  Medium: "bg-warning/10 text-warning",
  High: "bg-destructive/10 text-destructive",
  Critical: "bg-destructive text-destructive-foreground",
};

const DatasetPage = () => {
  const [scans] = useState<ScanRecord[]>(() => loadScans());
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");
  const [diseaseFilter, setDiseaseFilter] = useState("all");
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);

  const crops = useMemo(() => [...new Set(scans.map(s => s.crop))], [scans]);
  const diseases = useMemo(() => [...new Set(scans.map(s => s.disease))], [scans]);

  const filtered = useMemo(() => {
    return scans.filter(s => {
      if (cropFilter !== "all" && s.crop !== cropFilter) return false;
      if (diseaseFilter !== "all" && s.disease !== diseaseFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [s.crop, s.disease, s.severity].some(f => f.toLowerCase().includes(q));
      }
      return true;
    });
  }, [scans, search, cropFilter, diseaseFilter]);

  const handleExportSingle = async (scan: ScanRecord, type: "excel" | "pdf" = "excel") => {
    setExportingId(scan.id + type);
    await new Promise(r => setTimeout(r, 400));
    if (type === "excel") exportScanToExcel(scan);
    else exportScanToPDF(scan);
    setExportingId(null);
  };

  const handleExportAll = async () => {
    setExportingAll(true);
    await new Promise(r => setTimeout(r, 600));
    exportAllScansToExcel(filtered);
    setExportingAll(false);
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Scan Dataset</h1>
              <p className="mt-1 text-muted-foreground">{scans.length} total scans recorded</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleExportAll} disabled={exportingAll || filtered.length === 0}>
              {exportingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export All to Excel
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="w-40">
                <Select value={cropFilter} onValueChange={setCropFilter}>
                  <SelectTrigger><Filter className="h-3 w-3 mr-1" /><SelectValue placeholder="Crop" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    {crops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
                  <SelectTrigger><Filter className="h-3 w-3 mr-1" /><SelectValue placeholder="Disease" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Diseases</SelectItem>
                    {diseases.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" /> Scan Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SL#</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Acre</TableHead>
                      <TableHead>Disease</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Yield Loss</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Export</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(scan => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-mono text-muted-foreground">{scan.slNo}</TableCell>
                        <TableCell className="font-medium">{scan.crop}</TableCell>
                        <TableCell>{scan.fieldData.acreLand}</TableCell>
                        <TableCell>{scan.disease}</TableCell>
                        <TableCell>{scan.confidence.toFixed(1)}%</TableCell>
                        <TableCell><Badge className={severityColor[scan.severity]}>{scan.severity}</Badge></TableCell>
                        <TableCell className="text-destructive font-medium">{scan.yieldLoss}%</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(scan.timestamp).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleExportSingle(scan, "excel")} disabled={exportingId === scan.id + "excel"}>
                                  {exportingId === scan.id + "excel" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4 text-primary" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Export Excel</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleExportSingle(scan, "pdf")} disabled={exportingId === scan.id + "pdf"}>
                                  {exportingId === scan.id + "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4 text-primary" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Export Report</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No scans match your filters.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatasetPage;
