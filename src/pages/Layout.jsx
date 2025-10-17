

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Mail, 
  Settings, 
  Zap,
  Bot,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  Target,
  LifeBuoy,
  Warehouse,
  Receipt,
  MoreHorizontal,
  Plus,
  Building,
  CheckSquare,
  Calendar,
  Phone,
  FileText,
  BookOpen,
  Lightbulb,
  MapPin,
  Share2,
  Briefcase,
  Zap as ZapIcon,
  Mail as MailIcon,
  Shield,
  Webhook,
  Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User } from "@/api/apiClient";
import { motion } from 'framer-motion';

const mainNavItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Leads", url: createPageUrl("Leads"), icon: Users },
  { title: "Contacts", url: createPageUrl("Contacts"), icon: Users },
  { title: "Accounts", url: createPageUrl("Accounts"), icon: Building },
  { title: "Deals", url: createPageUrl("Pipeline"), icon: Target },
  { title: "Tasks", url: createPageUrl("Tasks"), icon: CheckSquare },
  { title: "Meetings", url: createPageUrl("Meetings"), icon: Calendar },
  { title: "Calls", url: createPageUrl("Calls"), icon: Phone },
  { title: "Products", url: createPageUrl("Products"), icon: Package },
  { title: "Orders", url: createPageUrl("Orders"), icon: ShoppingCart },
  { title: "Marketing", url: createPageUrl("Marketing"), icon: Mail },
  { title: "Support", url: createPageUrl("Support"), icon: LifeBuoy },
  { title: "Analytics", url: createPageUrl("Analytics"), icon: TrendingUp },
];

const moreNavItems = [
    { title: "Link Analytics", url: createPageUrl("LinkAnalytics"), icon: ExternalLink, badge: "Creator" },
    { title: "Inventory", url: createPageUrl("Inventory"), icon: Warehouse },
    { title: "Finance", url: createPageUrl("Finance"), icon: Receipt },
    { title: "Quotes", url: createPageUrl("Quotes"), icon: FileText, badge: "NEW" },
    { title: "Price Books", url: createPageUrl("PriceBooks"), icon: BookOpen, badge: "NEW" },
    { title: "Solutions", url: createPageUrl("Solutions"), icon: Lightbulb, badge: "NEW" },
    { title: "Forecasts", url: createPageUrl("Forecasts"), icon: TrendingUp, badge: "NEW" },
    { title: "Visits", url: createPageUrl("Visits"), icon: MapPin, badge: "NEW" },
    { title: "Social", url: createPageUrl("Social"), icon: Share2, badge: "NEW" },
    { title: "Projects", url: createPageUrl("Projects"), icon: Briefcase, badge: "NEW" },
    { title: "Services", url: createPageUrl("Services"), icon: Settings, badge: "NEW" },
    { title: "Workflows", url: createPageUrl("Workflows"), icon: ZapIcon, badge: "NEW" },
    { title: "Mass Email", url: createPageUrl("MassEmail"), icon: MailIcon, badge: "NEW" },
    { title: "Assignment Rules", url: createPageUrl("AssignmentRules"), icon: Users, badge: "NEW" },
    { title: "Validation Rules", url: createPageUrl("ValidationRules"), icon: Shield, badge: "NEW" },
    { title: "Webhooks", url: createPageUrl("WebhookConfigs"), icon: Webhook, badge: "NEW" },
    { title: "Territories", url: createPageUrl("Territories"), icon: Map, badge: "NEW" },
    { title: "AI Assistant", url: createPageUrl("AIAssistant"), icon: Bot, badge: "AI" },
    { title: "Integrations", url: createPageUrl("Integrations"), icon: Zap },
    { title: "Settings", url: createPageUrl("Settings"), icon: Settings },
]

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.log("User not authenticated");
      }
    };
    loadUser();

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to={createPageUrl("Dashboard")} className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Nexa CRM</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.url
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-slate-600 dark:text-slate-400">
                    More
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {moreNavItems.map((item) => (
                     <DropdownMenuItem key={item.title} asChild>
                        <Link to={item.url} className="flex justify-between w-full">
                           <span>{item.title}</span>
                           {item.badge && <Badge variant="secondary" className="ml-4">{item.badge}</Badge>}
                        </Link>
                     </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <Plus className="w-4 h-4 mr-2" />
                Create
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1.5 rounded-full h-auto">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-sm font-bold">
                        {user ? user.full_name.charAt(0) : <UserIcon className="w-4 h-4"/>}
                    </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
      </main>
    </div>
  );
}

