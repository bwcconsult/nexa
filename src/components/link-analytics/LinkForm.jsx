import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save } from 'lucide-react';

export default function LinkForm({ link, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: link?.title || "",
    link_url: link?.link_url || "",
    destination_url: link?.destination_url || "",
    platform: link?.platform || "custom",
  });

  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  const handleChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader><DialogTitle>{link ? "Edit Link" : "Add New Link"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="title">Title *</Label><Input id="title" value={formData.title} onChange={e => handleChange("title", e.target.value)} required /></div>
          <div><Label htmlFor="link_url">Tracked Link URL *</Label><Input id="link_url" placeholder="https://nexus.io/link/your-name" value={formData.link_url} onChange={e => handleChange("link_url", e.target.value)} required /></div>
          <div><Label htmlFor="destination_url">Destination URL *</Label><Input id="destination_url" placeholder="https://your-product-page.com" value={formData.destination_url} onChange={e => handleChange("destination_url", e.target.value)} required /></div>
          <div><Label>Platform</Label><Select value={formData.platform} onValueChange={v => handleChange("platform", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
            <SelectItem value="custom">Custom</SelectItem><SelectItem value="linktree">Linktree</SelectItem><SelectItem value="beacons">Beacons</SelectItem><SelectItem value="stan_store">Stan.store</SelectItem>
          </SelectContent></Select></div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit"><Save className="w-4 h-4 mr-2" />{link ? "Update Link" : "Create Link"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}