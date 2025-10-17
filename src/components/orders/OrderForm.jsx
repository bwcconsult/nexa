import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function OrderForm({ order, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    order_number: order?.order_number || `ORD-${Date.now()}`,
    customer_email: order?.customer_email || "",
    total_amount: order?.total_amount || "",
    status: order?.status || "pending",
    source: order?.source || "website",
    order_date: order?.order_date || new Date().toISOString().split('T')[0],
    shipping_address: order?.shipping_address || "",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      total_amount: parseFloat(formData.total_amount) || 0,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Create New Order"}</DialogTitle>
          <DialogDescription>Fill in the order details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order_number">Order Number *</Label>
              <Input id="order_number" value={formData.order_number} onChange={e => handleChange("order_number", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="order_date">Order Date *</Label>
              <Input id="order_date" type="date" value={formData.order_date} onChange={e => handleChange("order_date", e.target.value)} required />
            </div>
          </div>

          <div>
            <Label htmlFor="customer_email">Customer Email *</Label>
            <Input id="customer_email" type="email" value={formData.customer_email} onChange={e => handleChange("customer_email", e.target.value)} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_amount">Total Amount ($) *</Label>
              <Input id="total_amount" type="number" step="0.01" value={formData.total_amount} onChange={e => handleChange("total_amount", e.target.value)} required />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Source</Label>
              <Select value={formData.source} onValueChange={v => handleChange("source", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shipping_address">Shipping Address</Label>
            <Input id="shipping_address" value={formData.shipping_address} onChange={e => handleChange("shipping_address", e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {order ? "Update Order" : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
