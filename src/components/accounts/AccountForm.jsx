import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function AccountForm({ account, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: account?.name || "",
    phone: account?.phone || "",
    website: account?.website || "",
    industry: account?.industry || "",
    annual_revenue: account?.annual_revenue || "",
    number_of_employees: account?.number_of_employees || "",
    description: account?.description || "",
    billing_address: account?.billing_address || {},
    shipping_address: account?.shipping_address || {},
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{account ? "Edit Account" : "Create Account"}</DialogTitle>
          <DialogDescription>Fill in the details for the account below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-4">
          {/* Account Information */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-medium">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="name">Account Name *</Label><Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} required /></div>
              <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} /></div>
              <div><Label htmlFor="website">Website</Label><Input id="website" value={formData.website} onChange={e => handleChange("website", e.target.value)} /></div>
              <div><Label htmlFor="industry">Industry</Label><Input id="industry" value={formData.industry} onChange={e => handleChange("industry", e.target.value)} /></div>
              <div><Label htmlFor="annual_revenue">Annual Revenue ($)</Label><Input type="number" id="annual_revenue" value={formData.annual_revenue} onChange={e => handleChange("annual_revenue", e.target.value)} /></div>
              <div><Label htmlFor="number_of_employees">Employees</Label><Input type="number" id="number_of_employees" value={formData.number_of_employees} onChange={e => handleChange("number_of_employees", e.target.value)} /></div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-medium">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-600">Billing Address</h4>
                <div><Label>Street</Label><Input value={formData.billing_address.street || ""} onChange={e => handleAddressChange("billing_address", "street", e.target.value)} /></div>
                <div><Label>City</Label><Input value={formData.billing_address.city || ""} onChange={e => handleAddressChange("billing_address", "city", e.target.value)} /></div>
                <div><Label>State/Province</Label><Input value={formData.billing_address.state || ""} onChange={e => handleAddressChange("billing_address", "state", e.target.value)} /></div>
                <div><Label>Zip/Postal Code</Label><Input value={formData.billing_address.zip || ""} onChange={e => handleAddressChange("billing_address", "zip", e.target.value)} /></div>
                <div><Label>Country</Label><Input value={formData.billing_address.country || ""} onChange={e => handleAddressChange("billing_address", "country", e.target.value)} /></div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-slate-600">Shipping Address</h4>
                <div><Label>Street</Label><Input value={formData.shipping_address.street || ""} onChange={e => handleAddressChange("shipping_address", "street", e.target.value)} /></div>
                <div><Label>City</Label><Input value={formData.shipping_address.city || ""} onChange={e => handleAddressChange("shipping_address", "city", e.target.value)} /></div>
                <div><Label>State/Province</Label><Input value={formData.shipping_address.state || ""} onChange={e => handleAddressChange("shipping_address", "state", e.target.value)} /></div>
                <div><Label>Zip/Postal Code</Label><Input value={formData.shipping_address.zip || ""} onChange={e => handleAddressChange("shipping_address", "zip", e.target.value)} /></div>
                <div><Label>Country</Label><Input value={formData.shipping_address.country || ""} onChange={e => handleAddressChange("shipping_address", "country", e.target.value)} /></div>
              </div>
            </div>
          </div>

          {/* Description Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Description Information</h3>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={e => handleChange("description", e.target.value)} /></div>
          </div>
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit"><Save className="w-4 h-4 mr-2" />{account ? "Update Account" : "Save Account"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}