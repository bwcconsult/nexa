
import React, { useState, useEffect } from "react";
import { Call, Contact, Account } from "@/api/apiClient";
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Phone, Eye, Edit, Trash2, ChevronDown, ArrowUpDown, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import CallForm from "../components/calls/CallForm";

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCalls, setSelectedCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('schedule');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("-due_date");
  const [sortField, setSortField] = useState("due_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [systemFilters, setSystemFilters] = useState({
    touched_records: false,
    untouched_records: false,
    record_action: false,
    related_records_action: false,
  });

  const [fieldFilters, setFieldFilters] = useState({
    call_agenda: false,
    call_duration: false,
    call_owner: false,
    call_purpose: false,
    call_result: false,
    call_start_time: false,
    call_type: false,
    caller_id: false,
    contact_name: false,
    created_by: false,
    created_time: false,
    dialed_number: false,
    last_activity_time: false,
    modified_by: false,
    modified_time: false,
    outgoing_call_status: false,
    related_to: false,
    scheduled_in_crm: false,
    subject: false,
    tag: false,
  });

  const [relatedModuleFilters, setRelatedModuleFilters] = useState({
    notes: false,
  });

  useEffect(() => {
    loadData();
  }, [sortBy]);

  useEffect(() => {
    filterData();
  }, [calls, searchTerm]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [callsData, contactsData, accountsData] = await Promise.all([
        Activity.filter({ type: "call" }, sortBy, 1000),
        Contact.list(),
        Account.list()
      ]);
      setCalls(callsData);
      setContacts(contactsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...calls];
    if (searchTerm) {
      filtered = filtered.filter(call =>
        call.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCalls(filtered);
  };
  
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setSortBy(`${newDirection === "desc" ? "-" : ""}${field}`);
  };

  const handleSelect = (id) => {
    setSelectedCalls(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCalls.length === paginatedCalls.length) {
      setSelectedCalls([]);
    } else {
      setSelectedCalls(paginatedCalls.map(c => c.id));
    }
  };

  const handleSave = async (data) => {
    try {
      const payload = { ...data, type: 'call' };
      if (selectedCall) {
        await Activity.update(selectedCall.id, payload);
      } else {
        await Activity.create(payload);
      }
      await loadData();
      setShowForm(false);
      setSelectedCall(null);
    } catch (error) {
      console.error("Error saving call:", error);
    }
  };

  const handleCreateClick = (mode) => {
    setFormMode(mode);
    setSelectedCall(null);
    setShowForm(true);
  };

  // Pagination
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCalls = filteredCalls.slice(startIndex, startIndex + itemsPerPage);

  const getRelatedName = (item, field) => {
    if (field === 'contact_id' && item.contact_id) {
        const contact = contacts.find(c => c.id === item.contact_id);
        return contact ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() : 'Unknown';
    }
    if (field === 'account_id' && item.account_id) {
        const account = accounts.find(a => a.id === item.account_id);
        return account ? account.name : 'Unknown';
    }
    return 'N/A';
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">All Calls</h1>
          <p className="text-sm text-slate-500 mt-1">Total Records: {filteredCalls.length}</p>
        </div>
        <div className="flex items-center gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">Create Call <ChevronDown className="w-4 h-4 ml-2"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleCreateClick('schedule')}>Schedule a call</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCreateClick('log')}>Log a call</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline">Actions <ChevronDown className="w-4 h-4 ml-2"/></Button>
        </div>
      </div>

      <div className="flex gap-6">
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="flex-shrink-0">
              <Card>
                <CardHeader><CardTitle className="text-lg flex justify-between items-center">Filter Calls by <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></Button></CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">System Defined Filters</h3>
                    {Object.entries(systemFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`sys_${key}`} checked={checked} onCheckedChange={v => setSystemFilters(p => ({...p, [key]: v}))} />
                        <label htmlFor={`sys_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Filter By Fields</h3>
                    {Object.entries(fieldFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`field_${key}`} checked={checked} onCheckedChange={v => setFieldFilters(p => ({...p, [key]: v}))} />
                        <label htmlFor={`field_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                   <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Filter By Related Modules</h3>
                    {Object.entries(relatedModuleFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`related_${key}`} checked={checked} onCheckedChange={v => setRelatedModuleFilters(p => ({...p, [key]: v}))} />
                        <label htmlFor={`related_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 space-y-4">
            {!showFilters && <Button variant="outline" onClick={() => setShowFilters(true)} className="gap-2"><Filter className="w-4 h-4"/>Show Filters</Button>}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"><Checkbox checked={selectedCalls.length > 0 && selectedCalls.length === paginatedCalls.length} onCheckedChange={handleSelectAll} /></TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Call Type</TableHead>
                                <TableHead>Call Start Time</TableHead>
                                <TableHead>Call Duration</TableHead>
                                <TableHead>Related To</TableHead>
                                <TableHead>Contact Name</TableHead>
                                <TableHead>Call Owner</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? [...Array(5)].map((_, i) => <TableRow key={i}><TableCell colSpan={9}><div className="h-8 bg-slate-200 animate-pulse rounded" /></TableCell></TableRow>)
                            : paginatedCalls.length === 0 ? <TableRow><TableCell colSpan={9} className="text-center py-8">No calls found.</TableCell></TableRow>
                            : paginatedCalls.map(call => (
                                <TableRow key={call.id}>
                                    <TableCell><Checkbox checked={selectedCalls.includes(call.id)} onCheckedChange={() => handleSelect(call.id)} /></TableCell>
                                    <TableCell>{call.title}</TableCell>
                                    <TableCell className="capitalize">{call.call_type}</TableCell>
                                    <TableCell>{call.due_date ? format(new Date(call.due_date), 'dd MMM, yyyy HH:mm') : 'N/A'}</TableCell>
                                    <TableCell>{call.call_duration ? `${call.call_duration}s` : '-'}</TableCell>
                                    <TableCell>{getRelatedName(call, 'account_id')}</TableCell>
                                    <TableCell>{getRelatedName(call, 'contact_id')}</TableCell>
                                    <TableCell>{call.assigned_to || call.created_by}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => { setSelectedCall(call); setFormMode('log'); setShowForm(true); }}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {/* Pagination would go here */}
        </div>
      </div>
      {showForm && <CallForm mode={formMode} call={selectedCall} contacts={contacts} accounts={accounts} onSave={handleSave} onCancel={() => setShowForm(false)} />}
    </div>
  );
}
