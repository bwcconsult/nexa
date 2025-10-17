import React, { useState, useEffect } from "react";
import { Account } from "@/api/apiClient";
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Phone, Mail, Globe, Eye, Edit, Trash2, Building, ChevronDown, ArrowUpDown, X } from "lucide-react";
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

import AccountForm from "../components/accounts/AccountForm";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("-created_date");
  const [sortField, setSortField] = useState("created_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // System Defined Filters
  const [systemFilters, setSystemFilters] = useState({
    touched_records: false,
    untouched_records: false,
    record_action: false,
    related_records_action: false,
    locked: false,
    cadences: false
  });

  // Filter By Fields
  const [fieldFilters, setFieldFilters] = useState({
    account_name: false,
    account_number: false,
    account_owner: false,
    account_site: false,
    account_type: false,
    annual_revenue: false,
    billing_city: false,
    billing_code: false,
    billing_country: false,
    billing_province: false,
    billing_street: false,
    created_by: false,
    created_time: false,
    employees: false,
    fax: false,
    industry: false,
    last_activity_time: false,
    modified_by: false,
    modified_time: false,
    ownership: false,
    parent_account: false,
    phone: false,
    rating: false,
    shipping_city: false,
    shipping_code: false,
    shipping_country: false,
    shipping_province: false,
    shipping_street: false,
    sic_code: false,
    tag: false,
    ticker_symbol: false,
    website: false
  });

  // Filter By Related Modules
  const [relatedModuleFilters, setRelatedModuleFilters] = useState({
    account_product_relation: false,
    accounts_member_accounts: false,
    cases: false,
    contacts: false,
    deals: false,
    emails: false,
    invoices: false,
    leads_converted_leads: false,
    quotes: false,
    sales_orders: false
  });

  useEffect(() => {
    loadData();
  }, [sortBy]);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchTerm]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const accountsData = await Account.list(sortBy, 1000);
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error loading accounts data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAccounts = () => {
    let filtered = [...accounts];
    if (searchTerm) {
      filtered = filtered.filter(acc =>
        acc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.phone?.includes(searchTerm)
      );
    }
    setFilteredAccounts(filtered);
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setSortBy(`${newDirection === "desc" ? "-" : ""}${field}`);
  };
  
  const handleSelectAccount = (accountId) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === paginatedAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(paginatedAccounts.map(acc => acc.id));
    }
  };

  const handleSaveAccount = async (accountData) => {
    try {
      if (selectedAccount) {
        await Account.update(selectedAccount.id, accountData);
      } else {
        await Account.create(accountData);
      }
      await loadData();
      setShowForm(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error("Error saving account:", error);
    }
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setShowForm(true);
  };

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building className="w-6 h-6" />
            All Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Total Records: {filteredAccounts.length}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" className="gap-2">Actions <ChevronDown className="w-4 h-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem><Upload className="w-4 h-4 mr-2" /> Import Accounts</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Delete Selected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Create Account
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="flex-shrink-0">
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Filter Accounts by
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
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      System Defined Filters
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(systemFilters).map(([key, checked]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={checked}
                            onCheckedChange={(value) => setSystemFilters(prev => ({...prev, [key]: value}))}
                          />
                          <label htmlFor={key} className="text-sm capitalize cursor-pointer">
                            {key.replace(/_/g, ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Filter By Fields */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Filter By Fields</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {Object.entries(fieldFilters).map(([key, checked]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`field_${key}`}
                            checked={checked}
                            onCheckedChange={(value) => setFieldFilters(prev => ({...prev, [key]: value}))}
                          />
                          <label htmlFor={`field_${key}`} className="text-sm capitalize cursor-pointer">
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
            <Button variant="outline" onClick={() => setShowFilters(true)} className="gap-2"><Filter className="w-4 h-4" /> Show Filters</Button>
          )}
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"><Checkbox checked={selectedAccounts.length === paginatedAccounts.length && paginatedAccounts.length > 0} onCheckedChange={handleSelectAll} /></TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}><div className="flex items-center gap-2">Account Name <ArrowUpDown className="w-4 h-4" /></div></TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Account Owner</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? [...Array(10)].map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={6} className="p-4"><div className="h-4 bg-slate-200 rounded animate-pulse" /></TableCell></TableRow>
                  )) : paginatedAccounts.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8">No accounts found.</TableCell></TableRow>
                  ) : paginatedAccounts.map((account) => (
                    <TableRow key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell><Checkbox checked={selectedAccounts.includes(account.id)} onCheckedChange={() => handleSelectAccount(account.id)} /></TableCell>
                      <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleEditAccount(account)}>{account.name}</TableCell>
                      <TableCell><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" />{account.phone || 'N/A'}</div></TableCell>
                      <TableCell><a href={account.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:underline"><Globe className="w-4 h-4" />{account.website || 'N/A'}</a></TableCell>
                      <TableCell>{account.created_by || 'System'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditAccount(account)}><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
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
          {filteredAccounts.length > itemsPerPage && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts</div>
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

      {showForm && <AccountForm account={selectedAccount} onSave={handleSaveAccount} onCancel={() => { setShowForm(false); setSelectedAccount(null); }} />}
    </div>
  );
}