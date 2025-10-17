import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function TicketForm({ ticket, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    ticket_number: ticket?.ticket_number || `TKT-${Date.now()}`,
    subject: ticket?.subject || "",
    customer_email: ticket?.customer_email || "",
    description: ticket?.description || "",
    priority: ticket?.priority || "medium",
    status: ticket?.status || "open",
    category: ticket?.category || "general",
    assigned_to: ticket?.assigned_to || "",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ticket ? "Edit Ticket" : "Create New Ticket"}</DialogTitle>
          <DialogDescription>Fill in the support ticket details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ticket_number">Ticket Number</Label>
              <Input id="ticket_number" value={formData.ticket_number} onChange={e => handleChange("ticket_number", e.target.value)} readOnly className="bg-slate-50 dark:bg-slate-900" />
            </div>
            <div>
              <Label htmlFor="customer_email">Customer Email *</Label>
              <Input id="customer_email" type="email" value={formData.customer_email} onChange={e => handleChange("customer_email", e.target.value)} required />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input id="subject" value={formData.subject} onChange={e => handleChange("subject", e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" value={formData.description} onChange={e => handleChange("description", e.target.value)} rows={4} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={v => handleChange("priority", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={v => handleChange("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="account">Account Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input id="assigned_to" value={formData.assigned_to} onChange={e => handleChange("assigned_to", e.target.value)} placeholder="Agent email or name" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {ticket ? "Update Ticket" : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
