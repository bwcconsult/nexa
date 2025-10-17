import React, { useState, useEffect } from "react";
import { Contact, Activity, Deal } from "@/api/apiClient";
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Phone, Mail, Calendar, MapPin, Building, Star, Eye, Edit, Trash2, Users, TrendingUp, Target, Award, ChevronDown, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import ContactForm from "../components/contacts/ContactForm";
import ContactProfile from "../components/contacts/ContactProfile";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState("-created_date");
  const [sortField, setSortField] = useState("created_date");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Advanced Filters
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    touched_records: false,
    untouched_records: false,
    record_action: false,
    related_records_action: false,
    locked: false,
    latest_email_status: false,
    activities: false,
    campaigns: false,
    cadences: false
  });

  // System Defined Filters
  const [systemFilters, setSystemFilters] = useState({
    status: "all",
    source: "all",
    score_range: "all",
    owner: "all",
    date_range: "all",
    department: "all",
    email: "all",
    first_name: "all",
    home_phone: "all",
    last_activity_time: "all",
    last_name: "all",
    lead_conversion_time: "all",
    lead_name: "all",
    lead_owner: "all",
    lead_source: "all",
    lead_status: "all",
    mobile: "all",
    modified_by: "all",
    modified_time: "all",
    no_of_employees: "all",
    phone: "all",
    postal_code: "all",
    province: "all",
    rating: "all",
    salutation: "all",
    secondary_email: "all"
  });

  // Filter by Related Modules
  const [relatedModuleFilters, setRelatedModuleFilters] = useState({
    calls: false,
    deals: false,
    invoices: false,
    lead_product_relation: false,
    contacts_reporting: false,
    deal_contact_role: false,
    emails: false,
    invited_meetings: false,
    invoices_meetings: false,
    converted_leads: false,
    meetings: false,
    notes: false,
    purchase_orders: false,
    quotes: false,
    sales_orders: false,
    tasks: false
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, systemFilters, sortBy]);

  const loadData = async () => {
    try {
      const [contactsData, activitiesData, dealsData] = await Promise.all([
        Contact.list(sortBy, 1000),
        Activity.list("-created_date", 500),
        Deal.list("-created_date", 200)
      ]);
      setContacts(contactsData);
      setActivities(activitiesData);
      setDeals(dealsData);
    } catch (error) {
      console.error("Error loading contacts data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm)
      );
    }

    // System filters
    Object.entries(systemFilters).forEach(([key, value]) => {
      if (value !== "all") {
        filtered = filtered.filter(contact => {
          switch (key) {
            case "status":
              return contact.status === value;
            case "source":
              return contact.source === value;
            case "score_range":
              const score = contact.lead_score || 0;
              if (value === "hot") return score >= 80;
              if (value === "warm") return score >= 50 && score < 80;
              if (value === "cold") return score < 50;
              return true;
            default:
              return contact[key] === value;
          }
        });
      }
    });

    setFilteredContacts(filtered);
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setSortBy(`${newDirection === "desc" ? "-" : ""}${field}`);
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    const currentPageContacts = paginatedContacts.map(contact => contact.id);
    if (selectedContacts.length === currentPageContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(currentPageContacts);
    }
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await Contact.update(selectedContact.id, contactData);
      } else {
        await Contact.create(contactData);
      }
      await loadData();
      setShowForm(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const handleViewProfile = (contact) => {
    setSelectedContact(contact);
    setShowProfile(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      lead: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      prospect: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      customer: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      vip: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
      churned: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
    };
    return <Badge className={`${statusColors[status] || 'bg-slate-100 text-slate-800'} capitalize`}>{status}</Badge>;
  };

  const getSourceBadge = (source) => {
    const sourceColors = {
      organic: "bg-green-100 text-green-800",
      paid_ads: "bg-orange-100 text-orange-800",
      referral: "bg-purple-100 text-purple-800",
      social: "bg-blue-100 text-blue-800",
      email: "bg-indigo-100 text-indigo-800",
      direct: "bg-gray-100 text-gray-800",
      linktree: "bg-yellow-100 text-yellow-800",
      beacons: "bg-pink-100 text-pink-800",
      stan_store: "bg-teal-100 text-teal-800"
    };
    return source ? <Badge variant="outline" className={sourceColors[source]}>{source.replace('_', ' ')}</Badge> : null;
  };

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  const exportContacts = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Status", "Source", "Lead Score", "Created Date"],
      ...selectedContacts.length > 0 
        ? contacts.filter(c => selectedContacts.includes(c.id)).map(formatContactForExport)
        : filteredContacts.map(formatContactForExport)
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexa-contacts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const formatContactForExport = (contact) => [
    `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
    contact.email,
    contact.phone || '',
    contact.company || '',
    contact.status,
    contact.source || '',
    contact.lead_score || 0,
    format(new Date(contact.created_date), 'yyyy-MM-dd')
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              All Contacts
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Total Records: {filteredContacts.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportContacts} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Actions
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Import Contacts
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Send Email Campaign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Contact
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0"
            >
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Filter Contacts by
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* System Defined Filters */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      System Defined Filters
                    </h3>
                    
                    <div className="space-y-3">
                      {/* Status Filter */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Select value={systemFilters.status} onValueChange={(value) => setSystemFilters(prev => ({...prev, status: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="prospect">Prospect</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="churned">Churned</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Source Filter */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Lead Source</label>
                        <Select value={systemFilters.source} onValueChange={(value) => setSystemFilters(prev => ({...prev, source: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Sources" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="organic">Organic</SelectItem>
                            <SelectItem value="paid_ads">Paid Ads</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="direct">Direct</SelectItem>
                            <SelectItem value="linktree">Linktree</SelectItem>
                            <SelectItem value="beacons">Beacons</SelectItem>
                            <SelectItem value="stan_store">Stan Store</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Score Range Filter */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Lead Score</label>
                        <Select value={systemFilters.score_range} onValueChange={(value) => setSystemFilters(prev => ({...prev, score_range: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Scores" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Scores</SelectItem>
                            <SelectItem value="hot">Hot (80+)</SelectItem>
                            <SelectItem value="warm">Warm (50-79)</SelectItem>
                            <SelectItem value="cold">Cold (&lt;50)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Additional Filter Options */}
                    <div className="space-y-2">
                      {Object.entries(filterOptions).map(([key, checked]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={checked}
                            onCheckedChange={(value) => setFilterOptions(prev => ({...prev, [key]: value}))}
                          />
                          <label htmlFor={key} className="text-sm capitalize cursor-pointer">
                            {key.replace(/_/g, ' ')}
                          </label>
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
                          <Checkbox
                            id={`related_${key}`}
                            checked={checked}
                            onCheckedChange={(value) => setRelatedModuleFilters(prev => ({...prev, [key]: value}))}
                          />
                          <label htmlFor={`related_${key}`} className="text-sm capitalize cursor-pointer">
                            {key.replace(/_/g, ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {!showFilters && (
            <Button variant="outline" onClick={() => setShowFilters(true)} className="gap-2">
              <Filter className="w-4 h-4" />
              Show Filters
            </Button>
          )}

          {/* Selected Actions Bar */}
          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Add to Campaign
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedContacts([])}>
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contacts Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('first_name')}>
                      <div className="flex items-center gap-2">
                        Contact Name
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('company')}>
                      <div className="flex items-center gap-2">
                        Account Name
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                      <div className="flex items-center gap-2">
                        Email
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Lead Source</TableHead>
                    <TableHead>Contact Owner</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="w-4 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-32 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-24 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-40 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-28 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-20 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-24 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-8 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginatedContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-slate-300" />
                          <p className="text-slate-500">No contacts found</p>
                          <Button onClick={() => setShowForm(true)} size="sm">
                            Create your first contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedContacts.map((contact) => (
                    <TableRow 
                      key={contact.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                      onClick={() => handleViewProfile(contact)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => handleSelectContact(contact.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {contact.first_name?.[0] || contact.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-medium">
                              {contact.first_name || contact.last_name 
                                ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                                : 'Unnamed Contact'
                              }
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                              {getStatusBadge(contact.status)}
                              {contact.lead_score && (
                                <Badge variant="outline" className="text-xs">
                                  Score: {contact.lead_score}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contact.company && <Building className="w-4 h-4 text-slate-400" />}
                          {contact.company || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contact.phone && <Phone className="w-4 h-4 text-slate-400" />}
                          {contact.phone || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSourceBadge(contact.source)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {contact.created_by || 'System'}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(contact)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Contact
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Make Call
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Meeting
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {filteredContacts.length > itemsPerPage && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showForm && (
        <ContactForm
          contact={selectedContact}
          onSave={handleSaveContact}
          onCancel={() => {
            setShowForm(false);
            setSelectedContact(null);
          }}
        />
      )}

      {/* Contact Profile Modal */}
      {showProfile && selectedContact && (
        <ContactProfile
          contact={selectedContact}
          activities={activities.filter(a => a.contact_email === selectedContact.email)}
          onClose={() => {
            setShowProfile(false);
            setSelectedContact(null);
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