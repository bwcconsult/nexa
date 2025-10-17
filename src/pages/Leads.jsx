
import React, { useState, useEffect } from "react";
import { Lead, Activity, Deal } from "@/api/apiClient";
import { createPageUrl } from "@/utils";
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Phone, Mail, Calendar, MapPin, Building, Star, Eye, Edit, Trash2, Users, TrendingUp, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

import LeadsStats from "../components/leads/LeadsStats";
import LeadForm from "../components/leads/LeadForm";
import LeadProfile from "../components/leads/LeadProfile";
import BulkActions from "../components/leads/BulkActions";
import AdvancedFilters from "../components/leads/AdvancedFilters";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState("-created_date");
  const [filters, setFilters] = useState({
    status: "all",
    source: "all",
    score_range: "all",
    owner: "all",
    date_range: "all"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, filters, sortBy]);

  const loadData = async () => {
    try {
      const [leadsData, activitiesData, dealsData] = await Promise.all([
        Lead.list(sortBy, 1000),
        Activity.list("-created_date", 500),
        Deal.list("-created_date", 200)
      ]);
      setLeads(leadsData);
      setActivities(activitiesData);
      setDeals(dealsData);
    } catch (error) {
      console.error("Error loading leads data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Source filter
    if (filters.source !== "all") {
      filtered = filtered.filter(lead => lead.source === filters.source);
    }

    // Lead score filter
    if (filters.score_range !== "all") {
      filtered = filtered.filter(lead => {
        const score = lead.lead_score || 0;
        if (filters.score_range === "hot") return score >= 80;
        if (filters.score_range === "warm") return score >= 50 && score < 80;
        if (filters.score_range === "cold") return score < 50;
        return true;
      });
    }

    setFilteredLeads(filtered);
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === paginatedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(paginatedLeads.map(lead => lead.id));
    }
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (selectedLead) {
        await Lead.update(selectedLead.id, leadData);
      } else {
        await Lead.create(leadData);
      }
      await loadData();
      setShowForm(false);
      setSelectedLead(null);
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  const handleViewProfile = (lead) => {
    setSelectedLead(lead);
    setShowProfile(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowForm(true);
  };

  const handleConvertToCustomer = async (lead) => {
    try {
      await Contact.update(lead.id, { status: "customer" });
      await loadData();
    } catch (error) {
      console.error("Error converting lead:", error);
    }
  };

  const handleCreateDeal = (lead) => {
    // Navigate to Pipeline with pre-filled lead data
    window.location.href = createPageUrl("Pipeline") + `?contact_email=${lead.email}`;
  };

  const calculateLeadScores = async () => {
    setIsScoring(true);
    try {
      for (const lead of leads.slice(0, 10)) { // Process first 10 for demo
        const leadActivities = activities.filter(a => a.contact_email === lead.email);
        const leadDeals = deals.filter(d => d.contact_email === lead.email);
        
        const scoreData = await InvokeLLM({
          prompt: `Calculate a lead score (0-100) for this contact:
          
          Contact: ${lead.first_name} ${lead.last_name}
          Email: ${lead.email}
          Company: ${lead.company || 'N/A'}
          Source: ${lead.source}
          Status: ${lead.status}
          Phone: ${lead.phone || 'N/A'}
          Activities: ${leadActivities.length} interactions
          Deals: ${leadDeals.length} opportunities
          
          Consider factors like engagement, company size, source quality, and interaction frequency.
          Return only a score between 0-100.`,
          response_json_schema: {
            type: "object",
            properties: {
              score: { type: "number", minimum: 0, maximum: 100 }
            }
          }
        });

        if (scoreData.score) {
          await Contact.update(lead.id, { 
            lead_score: Math.round(scoreData.score) 
          });
        }
      }
      
      await loadData();
    } catch (error) {
      console.error("Error calculating lead scores:", error);
    } finally {
      setIsScoring(false);
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Status", "Source", "Lead Score", "Created Date"],
      ...filteredLeads.map(lead => [
        `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
        lead.email,
        lead.phone || '',
        lead.company || '',
        lead.status,
        lead.source || '',
        lead.lead_score || 0,
        new Date(lead.created_date).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
  };

  const getLeadScoreColor = (score) => {
    if (score >= 80) return "text-red-600 bg-red-100";
    if (score >= 50) return "text-orange-600 bg-orange-100";
    return "text-blue-600 bg-blue-100";
  };

  const getLeadScoreLabel = (score) => {
    if (score >= 80) return "Hot";
    if (score >= 50) return "Warm";
    return "Cold";
  };

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">All Leads</h1>
            <Badge variant="secondary" className="text-sm">
              {filteredLeads.length} records
            </Badge>
          </div>
          <p className="text-slate-600 mt-1">
            Manage and nurture your sales prospects
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={calculateLeadScores}
            disabled={isScoring}
            className="gap-2"
          >
            <Target className={`w-4 h-4 ${isScoring ? 'animate-spin' : ''}`} />
            {isScoring ? 'Scoring...' : 'AI Score'}
          </Button>
          <Button variant="outline" onClick={exportLeads} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <LeadsStats leads={leads} />

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search leads by name, email, company, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={filters.status} onValueChange={v => setFilters(prev => ({ ...prev, status: v }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.source} onValueChange={v => setFilters(prev => ({ ...prev, source: v }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="paid_ads">Paid Ads</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.score_range} onValueChange={v => setFilters(prev => ({ ...prev, score_range: v }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="hot">Hot (80+)</SelectItem>
                  <SelectItem value="warm">Warm (50-79)</SelectItem>
                  <SelectItem value="cold">Cold (&lt;50)</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Advanced
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedLeads.length > 0 && (
            <BulkActions 
              selectedCount={selectedLeads.length}
              onClearSelection={() => setSelectedLeads([])}
              onBulkAction={(action) => {
                // Handle bulk actions
                console.log(`Bulk action: ${action} on ${selectedLeads.length} leads`);
              }}
            />
          )}

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <AdvancedFilters 
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Lead Source</TableHead>
                  <TableHead>Lead Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
                    </TableRow>
                  ))
                ) : paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 cursor-pointer group"
                      onClick={() => handleViewProfile(lead)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => handleSelectLead(lead.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                            {(lead.first_name?.[0] || lead.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 'Unnamed Lead'}
                            </div>
                            <div className="text-xs text-slate-500">
                              Created {new Date(lead.created_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lead.company && <Building className="w-4 h-4 text-slate-400" />}
                          {lead.company || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-blue-600 hover:underline">
                            {lead.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lead.phone ? (
                            <>
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-700">{lead.phone}</span>
                            </>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {lead.source || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            lead.lead_score >= 80 ? 'bg-red-500' :
                            lead.lead_score >= 50 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}></div>
                          <span className="font-medium">{lead.lead_score || 0}</span>
                          <Badge variant="secondary" className={`text-xs ${getLeadScoreColor(lead.lead_score || 0)}`}>
                            {getLeadScoreLabel(lead.lead_score || 0)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={lead.status === 'customer' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                            {lead.created_by?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="text-sm text-slate-600">
                            {lead.created_by?.split('@')[0] || 'Unassigned'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(lead)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Lead
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCreateDeal(lead)}>
                              <Target className="w-4 h-4 mr-2" />
                              Create Deal
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleConvertToCustomer(lead)}>
                              <Award className="w-4 h-4 mr-2" />
                              Convert to Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-slate-300 mb-2" />
                        <p className="text-slate-500">No leads found</p>
                        <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredLeads.length > itemsPerPage && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Show</span>
                <Select value={itemsPerPage.toString()} onValueChange={v => setItemsPerPage(Number(v))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-slate-600">per page</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLeads.length)} of {filteredLeads.length}
                </span>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ←
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    →
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          lead={selectedLead}
          onSave={handleSaveLead}
          onCancel={() => {
            setShowForm(false);
            setSelectedLead(null);
          }}
        />
      )}

      {/* Lead Profile Modal */}
      {showProfile && selectedLead && (
        <LeadProfile
          lead={selectedLead}
          activities={activities.filter(a => a.contact_email === selectedLead.email)}
          deals={deals.filter(d => d.contact_email === selectedLead.email)}
          onClose={() => {
            setShowProfile(false);
            setSelectedLead(null);
          }}
          onEdit={() => {
            setShowProfile(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}
