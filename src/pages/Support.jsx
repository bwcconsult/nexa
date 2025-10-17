import React, { useState, useEffect } from 'react';
import { Ticket } from "@/api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, LifeBuoy, Search, MoreVertical, Edit, Trash2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion } from "framer-motion";
import { format } from "date-fns";

import TicketForm from "../components/support/TicketForm";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await Ticket.list("-created_date");
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTicket = async (ticketData) => {
    try {
      if (selectedTicket) {
        await Ticket.update(selectedTicket.id, ticketData);
      } else {
        await Ticket.create(ticketData);
      }
      await loadTickets();
      setShowForm(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  };

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowForm(true);
  };

  const filteredTickets = tickets.filter(t =>
    searchTerm === "" ||
    t.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-300",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };
    return <Badge className={`${styles[priority] || 'bg-slate-100 text-slate-800'} capitalize`}>{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      pending: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      closed: "bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-300",
    };
    return <Badge className={`${styles[status] || 'bg-slate-100 text-slate-800'} capitalize`}>{status.replace('_', ' ')}</Badge>;
  };

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Support Hub</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage customer support tickets</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Tickets</CardTitle>
            <LifeBuoy className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : totalTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Open</CardTitle>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : openTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">In Progress</CardTitle>
            <Clock className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : inProgressTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Resolved</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : resolvedTickets}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search tickets..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No support tickets found. Create your first ticket to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <motion.tr key={ticket.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <TableCell className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => handleEditTicket(ticket)}>
                      {ticket.ticket_number}
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.customer_email}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{ticket.created_date ? format(new Date(ticket.created_date), "MMM d, yyyy") : '-'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTicket(ticket)}>
                            <Edit className="w-4 h-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <TicketForm
          ticket={selectedTicket}
          onSave={handleSaveTicket}
          onCancel={() => {
            setShowForm(false);
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
}