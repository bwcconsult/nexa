
import React, { useState, useEffect } from "react";
import { Deal, Contact, Account } from "@/api/apiClient";
import { Plus, Filter, Search, Calendar, DollarSign, TrendingUp, Target, MoreHorizontal, ChevronDown, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import DealCard from "../components/pipeline/DealCard";
import DealForm from "../components/pipeline/DealForm";

const PIPELINE_STAGES = [
  { id: "Qualification", name: "Qualification", color: "bg-cyan-500", probability: 10 },
  { id: "Needs Analysis", name: "Needs Analysis", color: "bg-blue-500", probability: 20 },
  { id: "Value Proposition", name: "Value Proposition", color: "bg-indigo-500", probability: 40 },
  { id: "Identify Decision Makers", name: "Identify Decision Makers", color: "bg-purple-500", probability: 60 },
  { id: "Proposal/Price Quote", name: "Proposal/Price Quote", color: "bg-yellow-500", probability: 75 },
  { id: "Negotiation/Review", name: "Negotiation/Review", color: "bg-orange-500", probability: 90 },
  { id: "Closed Won", name: "Closed Won", color: "bg-green-500", probability: 100 },
  { id: "Closed Lost", name: "Closed Lost", color: "bg-red-500", probability: 0 },
  { id: "Closed Lost to Competition", name: "Closed Lost to Competition", color: "bg-red-700", probability: 0 }
];

export default function Pipeline() {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // System Defined Filters
  const [systemFilters, setSystemFilters] = useState({
    touched_records: false,
    untouched_records: false,
    record_action: false,
    related_records_action: false,
    locked: false,
    latest_email_status: false,
    activities: false,
    cadences: false
  });

  // Filter By Fields
  const [fieldFilters, setFieldFilters] = useState({
    account_name: false,
    amount: false,
    campaign_source: false,
    closing_date: false,
    contact_name: false,
    created_by: false,
    created_time: false,
    deal_name: false,
    deal_owner: false,
    expected_revenue: false,
    last_activity_time: false,
    lead_conversion_time: false,
    lead_source: false,
    modified_by: false,
    modified_time: false,
    next_step: false,
    overall_sales_duration: false,
    probability: false,
    reason_for_loss: false,
    sales_cycle_duration: false,
    stage: false,
    tag: false,
    type: false
  });

  // Filter By Related Modules
  const [relatedModuleFilters, setRelatedModuleFilters] = useState({
    calls: false,
    cases: false,
    deal_contact_role: false,
    deal_product_relation: false,
    emails: false,
    invoices: false,
    leads: false,
    meetings: false,
    notes: false,
    quotes: false,
    sales_orders: false,
    tasks: false
  });


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dealsData, contactsData, accountsData] = await Promise.all([
        Deal.list("-created_date"),
        Contact.list(),
        Account.list()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error loading pipeline data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const dealId = result.draggableId;
    const newStage = result.destination.droppableId;
    const newProbability = PIPELINE_STAGES.find(s => s.id === newStage)?.probability || 0;
    
    // Optimistic UI Update
    const updatedDeals = deals.map(d => 
      d.id === dealId ? { ...d, stage: newStage, probability: newProbability } : d
    );
    setDeals(updatedDeals);

    // Update deal stage in backend
    try {
      await Deal.update(dealId, { stage: newStage, probability: newProbability });
      // No need to reload data due to optimistic update
    } catch (error) {
      console.error("Error updating deal stage:", error);
      // Revert UI on error
      loadData(); 
    }
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        await Deal.update(selectedDeal.id, dealData);
      } else {
        await Deal.create(dealData);
      }
      await loadData();
      setShowForm(false);
      setSelectedDeal(null);
    } catch (error) {
      console.error("Error saving deal:", error);
    }
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => 
      deal.stage === stage &&
      (searchTerm === "" || 
       deal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       deal.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const calculateStageStats = (stage) => {
    const stageDeals = getDealsByStage(stage);
    const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return { count: stageDeals.length, value: totalValue };
  };

  const getAccountName = (accountId) => {
    return accounts.find(a => a.id === accountId)?.name || "N/A";
  }

  const getContactName = (contactEmail) => {
    const contact = contacts.find(c => c.email === contactEmail);
    if (!contact) return "N/A";
    return `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Filters Sidebar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="flex-shrink-0 h-full overflow-y-auto">
            <Card className="h-full">
              <CardHeader className="pb-4 sticky top-0 bg-white dark:bg-slate-950 z-10">
                <CardTitle className="text-lg flex items-center justify-between">
                  Filter Deals by
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                {/* System Defined Filters */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">System Defined Filters</h3>
                  <div className="space-y-2">
                    {Object.entries(systemFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`sys_${key}`} checked={checked} onCheckedChange={(value) => setSystemFilters(prev => ({...prev, [key]: value}))} />
                        <label htmlFor={`sys_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                {/* Filter By Fields */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Filter By Fields</h3>
                  <div className="space-y-2">
                    {Object.entries(fieldFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`field_${key}`} checked={checked} onCheckedChange={(value) => setFieldFilters(prev => ({...prev, [key]: value}))} />
                        <label htmlFor={`field_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                {/* Filter by Related Modules */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Filter By Related Modules</h3>
                  <div className="space-y-2">
                    {Object.entries(relatedModuleFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`related_${key}`} checked={checked} onCheckedChange={(value) => setRelatedModuleFilters(prev => ({...prev, [key]: value}))} />
                        <label htmlFor={`related_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col space-y-4">
         {/* Header */}
        <div className="flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            {!showFilters && <Button variant="outline" size="icon" onClick={() => setShowFilters(true)}><Filter className="w-4 h-4" /></Button>}
            <h1 className="text-2xl font-bold">All Deals</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">Sort By <ArrowUpDown className="w-4 h-4" /></Button>
            <Button 
              onClick={() => { setSelectedDeal(null); setShowForm(true); }}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Deal
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline">Actions <ChevronDown className="w-4 h-4 ml-2"/></Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                  <DropdownMenuItem>Mass Update</DropdownMenuItem>
                  <DropdownMenuItem>Mass Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="overflow-x-auto pb-4 flex-1">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full">
              {PIPELINE_STAGES.map((stage) => {
                const stageDeals = getDealsByStage(stage.id);
                const stageStats = calculateStageStats(stage.id);
                
                return (
                  <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col">
                    <div className="p-3 rounded-t-lg border-b-4" style={{borderBottomColor: stage.color.replace('bg-','').replace('-500','').replace('-700','')}}>
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-sm">{stage.name} <Badge variant="secondary" className="text-xs">{stageStats.count}</Badge></h3>
                        <p className="text-sm text-slate-500">{stage.probability}%</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                        ${stageStats.value.toLocaleString()}
                      </p>
                    </div>
                    
                    <Droppable droppableId={stage.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-b-lg transition-colors overflow-y-auto ${
                            snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="space-y-3">
                            {stageDeals.map((deal, index) => (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <DealCard 
                                      deal={deal} 
                                      accountName={getAccountName(deal.account_id)}
                                      contactName={getContactName(deal.contact_email)}
                                      onClick={() => { setSelectedDeal(deal); setShowForm(true); }}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>

      </div>

      {/* Deal Form Modal */}
      {showForm && (
        <DealForm
          deal={selectedDeal}
          contacts={contacts}
          accounts={accounts}
          onSave={handleSaveDeal}
          onCancel={() => {
            setShowForm(false);
            setSelectedDeal(null);
          }}
        />
      )}
    </div>
  );
}
