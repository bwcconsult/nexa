import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

const CALL_TYPES = ["outbound", "inbound"];
const CALL_STATUSES = ["Scheduled", "Completed", "No Answer", "Busy"];
const CALL_PURPOSES = ["Prospecting", "Negotiation", "Follow-up", "Support"];
const REMINDER_OPTIONS = ["None", "5 minutes before", "15 minutes before", "30 minutes before", "1 hour before"];

export default function CallForm({ mode, call, contacts, accounts, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    contact_id: call?.contact_id || "",
    account_id: call?.account_id || "",
    call_type: call?.call_type || "outbound",
    status: call?.status || "Scheduled",
    due_date: call?.due_date ? new Date(call.due_date).toISOString().slice(0, 16) : "",
    assigned_to: call?.assigned_to || "",
    title: call?.title || "",
    reminder: call?.reminder || false,
    call_purpose: call?.call_purpose || "",
    call_agenda: call?.call_agenda || "",
    description: call?.description || "", // For call result/notes
    call_duration: call?.call_duration || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const title = mode === 'schedule' ? "Schedule a Call" : "Log a Call";

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === 'schedule' ? 'Fill in the details to schedule a future call.' : 'Log the details of a completed call.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4">
                <div><Label>Call For (Contact)</Label><Select value={formData.contact_id} onValueChange={v => handleChange("contact_id", v)}><SelectTrigger><SelectValue placeholder="Select Contact..." /></SelectTrigger><SelectContent>{contacts.map(c => <SelectItem key={c.id} value={c.id}>{`${c.first_name || ''} ${c.last_name || ''}`.trim()}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Related To (Account)</Label><Select value={formData.account_id} onValueChange={v => handleChange("account_id", v)}><SelectTrigger><SelectValue placeholder="Select Account..." /></SelectTrigger><SelectContent>{accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Call Type</Label><Select value={formData.call_type} onValueChange={v => handleChange("call_type", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CALL_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Call Status</Label><Select value={formData.status} onValueChange={v => handleChange("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CALL_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            </div>
            
            <div><Label>Call Start Time</Label><Input type="datetime-local" value={formData.due_date} onChange={e => handleChange("due_date", e.target.value)} /></div>
            <div><Label>Call Owner</Label><Input value={formData.assigned_to} onChange={e => handleChange("assigned_to", e.target.value)} placeholder="e.g. bill.essien@example.com" /></div>
            <div><Label>Subject</Label><Input value={formData.title} onChange={e => handleChange("title", e.target.value)} /></div>

            {mode === 'schedule' && (
                <div className="flex items-center space-x-2"><Switch id="reminder" checked={formData.reminder} onCheckedChange={v => handleChange("reminder", v)} /><Label htmlFor="reminder">Set Reminder</Label></div>
            )}
            
            <h3 className="font-semibold pt-4">Purpose Of Outgoing Call</h3>
            <div className="grid grid-cols-2 gap-4">
                <div><Label>Call Purpose</Label><Select value={formData.call_purpose} onValueChange={v => handleChange("call_purpose", v)}><SelectTrigger><SelectValue placeholder="-None-" /></SelectTrigger><SelectContent>{CALL_PURPOSES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div><Label>Call Agenda</Label><Textarea value={formData.call_agenda} onChange={e => handleChange("call_agenda", e.target.value)} /></div>

            {mode === 'log' && (
                <>
                    <h3 className="font-semibold pt-4">Call Result</h3>
                    <div><Label>Description / Notes</Label><Textarea value={formData.description} onChange={e => handleChange("description", e.target.value)} /></div>
                    <div><Label>Call Duration (seconds)</Label><Input type="number" value={formData.call_duration} onChange={e => handleChange("call_duration", Number(e.target.value))} /></div>
                </>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit"><Save className="w-4 h-4 mr-2" />{mode === 'schedule' ? 'Schedule' : 'Log Call'}</Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}