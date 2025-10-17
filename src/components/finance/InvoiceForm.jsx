import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function InvoiceForm({ invoice, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    invoice_number: invoice?.invoice_number || `INV-${Date.now()}`,
    customer_email: invoice?.customer_email || "",
    invoice_date: invoice?.invoice_date || new Date().toISOString().split('T')[0],
    due_date: invoice?.due_date || "",
    amount: invoice?.amount || "",
    tax_amount: invoice?.tax_amount || "",
    total_amount: invoice?.total_amount || "",
    status: invoice?.status || "draft",
    payment_method: invoice?.payment_method || "bank_transfer",
    notes: invoice?.notes || "",
  });

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total if amount or tax changes
      if (field === 'amount' || field === 'tax_amount') {
        const amount = parseFloat(field === 'amount' ? value : updated.amount) || 0;
        const tax = parseFloat(field === 'tax_amount' ? value : updated.tax_amount) || 0;
        updated.total_amount = (amount + tax).toFixed(2);
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      tax_amount: parseFloat(formData.tax_amount) || 0,
      total_amount: parseFloat(formData.total_amount) || 0,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
          <DialogDescription>Fill in the invoice details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_number">Invoice Number *</Label>
              <Input id="invoice_number" value={formData.invoice_number} onChange={e => handleChange("invoice_number", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="customer_email">Customer Email *</Label>
              <Input id="customer_email" type="email" value={formData.customer_email} onChange={e => handleChange("customer_email", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_date">Invoice Date *</Label>
              <Input id="invoice_date" type="date" value={formData.invoice_date} onChange={e => handleChange("invoice_date", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date *</Label>
              <Input id="due_date" type="date" value={formData.due_date} onChange={e => handleChange("due_date", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={e => handleChange("amount", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="tax_amount">Tax ($)</Label>
              <Input id="tax_amount" type="number" step="0.01" value={formData.tax_amount} onChange={e => handleChange("tax_amount", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="total_amount">Total ($)</Label>
              <Input id="total_amount" type="number" step="0.01" value={formData.total_amount} readOnly className="bg-slate-50 dark:bg-slate-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={v => handleChange("payment_method", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={e => handleChange("notes", e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {invoice ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
