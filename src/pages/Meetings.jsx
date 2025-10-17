import React, { useState, useEffect } from "react";
import { Meeting, Contact, Account } from "@/api/apiClient";
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Calendar, Users, MapPin, Clock, Eye, Edit, Trash2, ChevronDown, ArrowUpDown, X } from "lucide-react";
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

import MeetingForm from "../components/meetings/MeetingForm";
import MeetingDetails from "../components/meetings/MeetingDetails";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("-start_date");
  const [sortField, setSortField] = useState("start_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // System Defined Filters
  const [systemFilters, setSystemFilters] = useState({
    touched_records: false,
    untouched_records: false,
    record_action: false,
    related_records_action: false,
    locked: false
  });

  // Filter By Fields
  const [fieldFilters, setFieldFilters] = useState({
    all_day: false,
    check_in_address: false,
    check_in_by: false,
    check_in_city: false,
    check_in_country: false,
    check_in_state: false,
    check_in_sub_locality: false,
    check_in_time: false,
    checked_in_status: false,
    contact_name: false,
    created_by: false,
    created_time: false,
    from: false,
    host: false,
    last_activity_time: false,
    location: false,
    modified_by: false,
    modified_time: false,
    related_to: false,
    tag: false,
    title: false,
    to: false,
    zip_code: false
  });

  // Filter By Related Modules
  const [relatedModuleFilters, setRelatedModuleFilters] = useState({
    invitees_invited_event: false,
    notes: false
  });

  useEffect(() => {
    loadData();
  }, [sortBy]);

  useEffect(() => {
    filterMeetings();
  }, [meetings, searchTerm]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [meetingsData, contactsData, accountsData] = await Promise.all([
        Meeting.list(sortBy, 1000),
        Contact.list(),
        Account.list()
      ]);
      setMeetings(meetingsData);
      setContacts(contactsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error loading meetings data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMeetings = () => {
    let filtered = [...meetings];
    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.host?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredMeetings(filtered);
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setSortBy(`${newDirection === "desc" ? "-" : ""}${field}`);
  };

  const handleSelectMeeting = (meetingId) => {
    setSelectedMeetings(prev => 
      prev.includes(meetingId) 
        ? prev.filter(id => id !== meetingId)
        : [...prev, meetingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMeetings.length === paginatedMeetings.length) {
      setSelectedMeetings([]);
    } else {
      setSelectedMeetings(paginatedMeetings.map(meeting => meeting.id));
    }
  };

  const handleSaveMeeting = async (meetingData) => {
    try {
      if (selectedMeeting) {
        await Meeting.update(selectedMeeting.id, meetingData);
      } else {
        await Meeting.create(meetingData);
      }
      await loadData();
      setShowForm(false);
      setSelectedMeeting(null);
    } catch (error) {
      console.error("Error saving meeting:", error);
    }
  };

  const handleViewDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setShowDetails(true);
  };

  const handleEditMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setShowForm(true);
  };

  const getStatusBadge = (meeting) => {
    const now = new Date();
    const startDate = new Date(meeting.start_date);
    const endDate = new Date(meeting.end_date);
    
    let status = meeting.status || "scheduled";
    let color = "bg-blue-100 text-blue-800";
    
    if (meeting.status === "cancelled") {
      status = "cancelled";
      color = "bg-red-100 text-red-800";
    } else if (meeting.status === "completed") {
      status = "completed";
      color = "bg-green-100 text-green-800";
    } else if (now >= startDate && now <= endDate) {
      status = "in progress";
      color = "bg-orange-100 text-orange-800";
    } else if (now > endDate) {
      status = "completed";
      color = "bg-gray-100 text-gray-800";
    }
    
    return <Badge className={`${color} capitalize`}>{status}</Badge>;
  };

  // Pagination
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeetings = filteredMeetings.slice(startIndex, startIndex + itemsPerPage);

  const exportMeetings = () => {
    const csvContent = [
      ["Title", "Date", "Time", "Location", "Host", "Participants", "Status"],
      ...filteredMeetings.map(meeting => [
        meeting.title,
        format(new Date(meeting.start_date), 'yyyy-MM-dd'),
        `${format(new Date(meeting.start_date), 'HH:mm')} - ${format(new Date(meeting.end_date), 'HH:mm')}`,
        meeting.location || '',
        meeting.host,
        meeting.participants?.length || 0,
        meeting.status || 'scheduled'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexa-meetings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              All Meetings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Total Records: {filteredMeetings.length}
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
          
          <Button variant="outline" onClick={exportMeetings} className="gap-2">
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
                Import Meetings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="w-4 h-4 mr-2" />
                Calendar View
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
            Create Meeting
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
                    Filter Meetings by
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
                      placeholder="Search meetings..."
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
                    <div className="space-y-2">
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
            <Button variant="outline" onClick={() => setShowFilters(true)} className="gap-2">
              <Filter className="w-4 h-4" />
              Show Filters
            </Button>
          )}

          {/* Selected Actions Bar */}
          {selectedMeetings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedMeetings.length} meeting{selectedMeetings.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Add Participants
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedMeetings([])}>
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Meetings Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedMeetings.length === paginatedMeetings.length && paginatedMeetings.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-2">
                        Title
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('start_date')}>
                      <div className="flex items-center gap-2">
                        From
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Related To</TableHead>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Host</TableHead>
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
                        <TableCell><div className="w-24 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-28 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-24 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-20 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="w-8 h-4 bg-slate-200 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginatedMeetings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Calendar className="w-12 h-12 text-slate-300" />
                          <p className="text-slate-500">No meetings found</p>
                          <Button onClick={() => setShowForm(true)} size="sm">
                            Schedule your first meeting
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedMeetings.map((meeting) => (
                    <TableRow 
                      key={meeting.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                      onClick={() => handleViewDetails(meeting)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedMeetings.includes(meeting.id)}
                          onCheckedChange={() => handleSelectMeeting(meeting.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">{meeting.title}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                              {getStatusBadge(meeting)}
                              {meeting.location && (
                                <Badge variant="outline" className="text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {meeting.location}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="text-sm font-medium">
                              {format(new Date(meeting.start_date), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-slate-500">
                              {format(new Date(meeting.start_date), 'HH:mm')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(meeting.end_date), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-slate-500">
                          {format(new Date(meeting.end_date), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {meeting.related_to || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {meeting.participants && meeting.participants.length > 0 
                            ? meeting.participants[0].name || meeting.participants[0].email
                            : 'N/A'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {meeting.host || meeting.created_by}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(meeting)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditMeeting(meeting)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Meeting
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Users className="w-4 h-4 mr-2" />
                              Add Participants
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 mr-2" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Cancel Meeting
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
          {filteredMeetings.length > itemsPerPage && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMeetings.length)} of {filteredMeetings.length} meetings
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

      {/* Meeting Form Modal */}
      {showForm && (
        <MeetingForm
          meeting={selectedMeeting}
          contacts={contacts}
          accounts={accounts}
          onSave={handleSaveMeeting}
          onCancel={() => {
            setShowForm(false);
            setSelectedMeeting(null);
          }}
        />
      )}

      {/* Meeting Details Modal */}
      {showDetails && selectedMeeting && (
        <MeetingDetails
          meeting={selectedMeeting}
          onClose={() => {
            setShowDetails(false);
            setSelectedMeeting(null);
          }}
          onEdit={() => {
            setShowDetails(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}