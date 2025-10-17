import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

const DEAL_STAGES = [
    { value: "Qualification", label: "Qualification" },
    { value: "Needs Analysis", label: "Needs Analysis" },
    { value: "Value Proposition", label: "Value Proposition" },
    { value: "Identify Decision Makers", label: "Identify Decision Makers" },
    { value: "Proposal/Price Quote", label: "Proposal/Price Quote" },
    { value: "Negotiation/Review", label: "Negotiation/Review" },
    { value: "Closed Won", label: "Closed Won" },
    { value: "Closed Lost", label: "Closed Lost" },
    { value: "Closed Lost to Competition", label: "Closed Lost to Competition" }
];

const DEAL_TYPES = ["New Business", "Existing Business"];
const LEAD_SOURCES = ["Cold Call", "Advertisement", "Web Download", "Seminar Partner", "Online Store", "Referral", "Partner", "Event", "Social"];

export default function DealForm({ deal, contacts, accounts, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: deal?.title || "",
    account_id: deal?.account_id || "",
    contact_email: deal?.contact_email || "",
    value: deal?.value || "",
    stage: deal?.stage || "Qualification",
    probability: deal?.probability || 10,
    expected_close_date: deal?.expected_close_date ? new Date(deal.expected_close_date).toISOString().split('T')[0] : "",
    notes: deal?.notes || "",
    type: deal?.type || "New Business",
    source: deal?.source || "",
    next_step: deal?.next_step || "",
    campaign_source: deal?.campaign_source || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 0
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  useEffect(() => {
    const stageData = DEAL_STAGES.find(s => s.value === formData.stage);
    if (stageData) {
        handleChange("probability", stageData.label === "Closed Won" ? 100 : stageData.label.includes("Lost") ? 0 : stageData.probability || 10);
    }
  }, [formData.stage]);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{deal ? "Edit Deal" : "Create Deal"}</DialogTitle>
          <DialogDescription>Fill in the deal information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><Label htmlFor="title">Deal Name *</Label><Input id="title" value={formData.title} onChange={e => handleChange("title", e.target.value)} required /></div>
              <div><Label htmlFor="account_id">Account Name *</Label><Select value={formData.account_id} onValueChange={v => handleChange("account_id", v)}><SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger><SelectContent>{accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="type">Type</Label><Select value={formData.type} onValueChange={v => handleChange("type", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DEAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="next_step">Next Step</Label><Input id="next_step" value={formData.next_step} onChange={e => handleChange("next_step", e.target.value)} /></div>
              <div><Label htmlFor="source">Lead Source</Label><Select value={formData.source} onValueChange={v => handleChange("source", v)}><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger><SelectContent>{LEAD_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="contact_email">Contact Name *</Label><Select value={formData.contact_email} onValueChange={v => handleChange("contact_email", v)}><SelectTrigger><SelectValue placeholder="Select contact" /></SelectTrigger><SelectContent>{contacts.map(c => <SelectItem key={c.id} value={c.email}>{`${c.first_name || ''} ${c.last_name || ''}`.trim()}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-4">
              <div><Label htmlFor="value">Amount ($) *</Label><Input id="value" type="number" min="0" value={formData.value} onChange={e => handleChange("value", e.target.value)} required /></div>
              <div><Label htmlFor="expected_close_date">Closing Date</Label><Input id="expected_close_date" type="date" value={formData.expected_close_date} onChange={e => handleChange("expected_close_date", e.target.value)} /></div>
              <div><Label htmlFor="stage">Stage</Label><Select value={formData.stage} onValueChange={v => handleChange("stage", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DEAL_STAGES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="probability">Probability (%)</Label><Input id="probability" type="number" min="0" max="100" value={formData.probability} onChange={e => handleChange("probability", e.target.value)} /></div>
              <div><Label htmlFor="campaign_source">Campaign Source</Label><Input id="campaign_source" value={formData.campaign_source} onChange={e => handleChange("campaign_source", e.target.value)} /></div>
            </div>
          </div>
          <div><Label htmlFor="notes">Description</Label><Textarea id="notes" value={formData.notes} onChange={e => handleChange("notes", e.target.value)} /></div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit"><Save className="w-4 h-4 mr-2" />{deal ? "Update Deal" : "Save Deal"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}