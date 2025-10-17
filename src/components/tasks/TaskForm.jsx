import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

const TASK_STATUSES = ["Not Started", "Deferred", "In Progress", "Completed", "Waiting on someone else"];
const TASK_PRIORITIES = ["Highest", "High", "Normal", "Low", "Lowest"];

export default function TaskForm({ task, contacts, accounts, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
    contact_id: task?.contact_id || "",
    account_id: task?.account_id || "",
    status: task?.status || "Not Started",
    priority: task?.priority || "Normal",
    reminder: task?.reminder || false,
    repeat: task?.repeat || false,
    description: task?.description || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>Fill in the task information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-4">
            <div><Label htmlFor="title">Subject *</Label><Input id="title" value={formData.title} onChange={e => handleChange("title", e.target.value)} required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label htmlFor="due_date">Due Date</Label><Input id="due_date" type="date" value={formData.due_date} onChange={e => handleChange("due_date", e.target.value)} /></div>
                <div><Label htmlFor="contact_id">Contact</Label><Select value={formData.contact_id} onValueChange={v => handleChange("contact_id", v)}><SelectTrigger><SelectValue placeholder="Select contact" /></SelectTrigger><SelectContent>{contacts.map(c => <SelectItem key={c.id} value={c.id}>{`${c.first_name || ''} ${c.last_name || ''}`.trim()}</SelectItem>)}</SelectContent></Select></div>
                <div><Label htmlFor="account_id">Account</Label><Select value={formData.account_id} onValueChange={v => handleChange("account_id", v)}><SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger><SelectContent>{accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select></div>
                <div><Label htmlFor="status">Status</Label><Select value={formData.status} onValueChange={v => handleChange("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                <div><Label htmlFor="priority">Priority</Label><Select value={formData.priority} onValueChange={v => handleChange("priority", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TASK_PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                <div className="flex flex-col gap-2 pt-2"><Label>Reminder</Label><div className="flex items-center space-x-2"><Switch id="reminder" checked={formData.reminder} onCheckedChange={v => handleChange("reminder", v)} /><Label htmlFor="reminder">Set Reminder</Label></div></div>
                <div className="flex flex-col gap-2 pt-2"><Label>Repeat</Label><div className="flex items-center space-x-2"><Switch id="repeat" checked={formData.repeat} onCheckedChange={v => handleChange("repeat", v)} /><Label htmlFor="repeat">Set Repeat</Label></div></div>
            </div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={e => handleChange("description", e.target.value)} /></div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit"><Save className="w-4 h-4 mr-2" />{task ? "Update Task" : "Save Task"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}