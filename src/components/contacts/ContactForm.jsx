import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

export default function ContactForm({ contact, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: contact?.first_name || "",
    last_name: contact?.last_name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    status: contact?.status || "lead",
    source: contact?.source || "direct"
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "Create New Contact"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="first_name">First Name</Label><Input id="first_name" value={formData.first_name} onChange={e => handleChange("first_name", e.target.value)} /></div>
            <div><Label htmlFor="last_name">Last Name</Label><Input id="last_name" value={formData.last_name} onChange={e => handleChange("last_name", e.target.value)} /></div>
          </div>
          <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} required /></div>
          <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} /></div>
          <div><Label htmlFor="company">Company</Label><Input id="company" value={formData.company} onChange={e => handleChange("company", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={v => handleChange("status", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                <SelectItem value="lead">Lead</SelectItem><SelectItem value="prospect">Prospect</SelectItem><SelectItem value="customer">Customer</SelectItem><SelectItem value="vip">VIP</SelectItem><SelectItem value="churned">Churned</SelectItem>
              </SelectContent></Select>
            </div>
            <div>
              <Label>Source</Label>
              <Select value={formData.source} onValueChange={v => handleChange("source", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                <SelectItem value="direct">Direct</SelectItem><SelectItem value="organic">Organic</SelectItem><SelectItem value="paid_ads">Paid Ads</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="social">Social</SelectItem><SelectItem value="email">Email</SelectItem>
              </SelectContent></Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit"><Save className="w-4 h-4 mr-2" />{contact ? "Update Contact" : "Create Contact"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}