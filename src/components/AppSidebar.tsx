import {
  Home, Upload, LayoutDashboard, BarChart3, CloudSun, Map, MessageCircle,
  Database, Settings, Leaf, Sprout, FlaskConical, Bug, CalendarDays,
  Droplets, IndianRupee,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/lib/language-context";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t } = useLanguage();
  const isActive = (path: string) => location.pathname === path;

  const mainItems = [
    { title: t("home"), url: "/", icon: Home },
    { title: t("uploadScan"), url: "/upload", icon: Upload },
    { title: t("dashboard"), url: "/dashboard", icon: LayoutDashboard },
    { title: t("yieldPrediction"), url: "/yield", icon: BarChart3 },
  ];

  const toolItems = [
    { title: t("weatherRisk"), url: "/weather", icon: CloudSun },
    { title: t("satelliteMap"), url: "/map", icon: Map },
    { title: t("aiAssistant"), url: "/assistant", icon: MessageCircle },
    { title: t("diseaseDataset"), url: "/dataset", icon: Database },
  ];

  const farmerItems = [
    { title: t("cropRecommend"), url: "/crop-recommend", icon: Sprout },
    { title: t("fertilizer"), url: "/fertilizer", icon: FlaskConical },
    { title: t("pestMonitor"), url: "/pest-monitor", icon: Bug },
    { title: t("farmCalendar"), url: "/farm-calendar", icon: CalendarDays },
    { title: t("irrigation"), url: "/irrigation", icon: Droplets },
    { title: t("marketPrices"), url: "/market-prices", icon: IndianRupee },
  ];

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold font-display text-sidebar-foreground">AgriScan AI</h2>
              <p className="text-[10px] text-sidebar-foreground/60">Smart Farming Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Main", mainItems)}
        {renderGroup("Tools", toolItems)}
        {renderGroup("Farmer Support", farmerItems)}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")}>
                  <NavLink to="/settings" end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                    <Settings className="h-4 w-4" />
                    {!collapsed && <span>{t("settings")}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
