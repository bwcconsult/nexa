import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Edit, Mail, Phone, Building, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function ContactProfile({ contact, activities, onClose, onEdit }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{contact.first_name?.[0] || 'A'}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{contact.first_name} {contact.last_name}</h2>
                <p className="text-slate-500">{contact.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-2" />Edit</Button>
              <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Panel: Details */}
          <div className="md:col-span-1 space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold mb-2">Contact Details</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {contact.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {contact.phone || 'N/A'}</p>
                <p className="flex items-center gap-2"><Building className="w-4 h-4 text-slate-400" /> {contact.company || 'N/A'}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold mb-2">CRM Info</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="capitalize" variant="secondary">{contact.status}</Badge>
                <Badge className="capitalize" variant="outline">{contact.source}</Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center justify-between"><span>Lead Score</span> <strong>{contact.lead_score || 0}</strong></p>
                <p className="flex items-center justify-between"><span>Engagement</span> <strong>{contact.engagement_score || 0}/10</strong></p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold mb-2">Financials</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center justify-between"><span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> LTV</span> <strong>${(contact.lifetime_value || 0).toLocaleString()}</strong></p>
                <p className="flex items-center justify-between"><span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3" /> Total Orders</span> <strong>{contact.total_orders || 0}</strong></p>
              </div>
            </div>
          </div>
          
          {/* Right Panel: Activity Timeline */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4 text-lg">Activity Timeline</h3>
            <div className="space-y-4">
              {activities.length > 0 ? activities.map(act => (
                <div key={act.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{act.title}</p>
                    <p className="text-sm text-slate-500">{act.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{format(new Date(act.created_date), "MMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500">No activities found for this contact.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}