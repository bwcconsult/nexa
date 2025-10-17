import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Customers from "./Customers";

import Pipeline from "./Pipeline";

import Contacts from "./Contacts";

import LinkAnalytics from "./LinkAnalytics";

import Products from "./Products";

import Orders from "./Orders";

import Marketing from "./Marketing";

import Analytics from "./Analytics";

import Integrations from "./Integrations";

import AIAssistant from "./AIAssistant";

import Support from "./Support";

import Inventory from "./Inventory";

import Finance from "./Finance";

import Settings from "./Settings";

import Leads from "./Leads";

import Accounts from "./Accounts";

import Tasks from "./Tasks";

import Meetings from "./Meetings";

import Calls from "./Calls";

import Automation from "./Automation";

import Quotes from "./Quotes";

import PriceBooks from "./PriceBooks";

import Solutions from "./Solutions";

import Forecasts from "./Forecasts";

import Visits from "./Visits";

import Social from "./Social";

import Projects from "./Projects";

import Services from "./Services";

import Workflows from "./Workflows";

import MassEmail from "./MassEmail";

import AssignmentRules from "./AssignmentRules";

import ValidationRules from "./ValidationRules";

import WebhookConfigs from "./WebhookConfigs";

import Territories from "./Territories";

import ApprovalProcesses from "./ApprovalProcesses";

import SalesCadences from "./SalesCadences";

import CPQConfigurations from "./CPQConfigurations";

import Blueprints from "./Blueprints";

import CustomFunctions from "./CustomFunctions";

import ClientPortals from "./ClientPortals";

import PageLayouts from "./PageLayouts";

import KioskModes from "./KioskModes";

import IndustryTemplates from "./IndustryTemplates";

import ContactLists from "./ContactLists";

import ImportExport from "./ImportExport";

import Inbox from "./Inbox";

import AIInsights from "./AIInsights";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Customers: Customers,
    
    Pipeline: Pipeline,
    
    Contacts: Contacts,
    
    LinkAnalytics: LinkAnalytics,
    
    Products: Products,
    
    Orders: Orders,
    
    Marketing: Marketing,
    
    Analytics: Analytics,
    
    Integrations: Integrations,
    
    AIAssistant: AIAssistant,
    
    Support: Support,
    
    Inventory: Inventory,
    
    Finance: Finance,
    
    Settings: Settings,
    
    Leads: Leads,
    
    Accounts: Accounts,
    
    Tasks: Tasks,
    
    Meetings: Meetings,
    
    Calls: Calls,
    
    Automation: Automation,
    
    Quotes: Quotes,
    
    PriceBooks: PriceBooks,
    
    Solutions: Solutions,
    
    Forecasts: Forecasts,
    
    Visits: Visits,
    
    Social: Social,
    
    Projects: Projects,
    
    Services: Services,
    
    Workflows: Workflows,
    
    MassEmail: MassEmail,
    
    AssignmentRules: AssignmentRules,
    
    ValidationRules: ValidationRules,
    
    WebhookConfigs: WebhookConfigs,
    
    Territories: Territories,
    
    ApprovalProcesses: ApprovalProcesses,
    
    SalesCadences: SalesCadences,
    
    CPQConfigurations: CPQConfigurations,
    
    Blueprints: Blueprints,
    
    CustomFunctions: CustomFunctions,
    
    ClientPortals: ClientPortals,
    
    PageLayouts: PageLayouts,
    
    KioskModes: KioskModes,
    
    IndustryTemplates: IndustryTemplates,
    
    ContactLists: ContactLists,
    
    ImportExport: ImportExport,
    
    Inbox: Inbox,
    
    AIInsights: AIInsights,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Customers" element={<Customers />} />
                
                <Route path="/Pipeline" element={<Pipeline />} />
                
                <Route path="/Contacts" element={<Contacts />} />
                
                <Route path="/LinkAnalytics" element={<LinkAnalytics />} />
                
                <Route path="/Products" element={<Products />} />
                
                <Route path="/Orders" element={<Orders />} />
                
                <Route path="/Marketing" element={<Marketing />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Integrations" element={<Integrations />} />
                
                <Route path="/AIAssistant" element={<AIAssistant />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/Inventory" element={<Inventory />} />
                
                <Route path="/Finance" element={<Finance />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Leads" element={<Leads />} />
                
                <Route path="/Accounts" element={<Accounts />} />
                
                <Route path="/Tasks" element={<Tasks />} />
                
                <Route path="/Meetings" element={<Meetings />} />
                
                <Route path="/Calls" element={<Calls />} />
                
                <Route path="/Automation" element={<Automation />} />
                
                <Route path="/Quotes" element={<Quotes />} />
                
                <Route path="/PriceBooks" element={<PriceBooks />} />
                
                <Route path="/Solutions" element={<Solutions />} />
                
                <Route path="/Forecasts" element={<Forecasts />} />
                
                <Route path="/Visits" element={<Visits />} />
                
                <Route path="/Social" element={<Social />} />
                
                <Route path="/Projects" element={<Projects />} />
                
                <Route path="/Services" element={<Services />} />
                
                <Route path="/Workflows" element={<Workflows />} />
                
                <Route path="/MassEmail" element={<MassEmail />} />
                
                <Route path="/AssignmentRules" element={<AssignmentRules />} />
                
                <Route path="/ValidationRules" element={<ValidationRules />} />
                
                <Route path="/WebhookConfigs" element={<WebhookConfigs />} />
                
                <Route path="/Territories" element={<Territories />} />
                
                <Route path="/ApprovalProcesses" element={<ApprovalProcesses />} />
                
                <Route path="/SalesCadences" element={<SalesCadences />} />
                
                <Route path="/CPQConfigurations" element={<CPQConfigurations />} />
                
                <Route path="/Blueprints" element={<Blueprints />} />
                
                <Route path="/CustomFunctions" element={<CustomFunctions />} />
                
                <Route path="/ClientPortals" element={<ClientPortals />} />
                
                <Route path="/PageLayouts" element={<PageLayouts />} />
                
                <Route path="/KioskModes" element={<KioskModes />} />
                
                <Route path="/IndustryTemplates" element={<IndustryTemplates />} />
                
                <Route path="/ContactLists" element={<ContactLists />} />
                
                <Route path="/ImportExport" element={<ImportExport />} />
                
                <Route path="/Inbox" element={<Inbox />} />
                
                <Route path="/AIInsights" element={<AIInsights />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}