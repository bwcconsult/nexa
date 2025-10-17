
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function ContactFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={filters.status} onValueChange={v => handleFilterChange("status", v)}>
        <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="lead">Lead</SelectItem>
          <SelectItem value="prospect">Prospect</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="vip">VIP</SelectItem>
          <SelectItem value="churned">Churned</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.source} onValueChange={v => handleFilterChange("source", v)}>
        <SelectTrigger className="w-32"><SelectValue placeholder="Source" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="organic">Organic</SelectItem>
          <SelectItem value="paid_ads">Paid Ads</SelectItem>
          <SelectItem value="referral">Referral</SelectItem>
          <SelectItem value="social">Social</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="direct">Direct</SelectItem>
          <SelectItem value="linktree">Linktree</SelectItem>
          <SelectItem value="beacons">Beacons</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.tier} onValueChange={v => handleFilterChange("tier", v)}>
        <SelectTrigger className="w-32"><SelectValue placeholder="Tier" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          <SelectItem value="vip">VIP (&gt;$5k)</SelectItem>
          <SelectItem value="premium">Premium (&gt;$1k)</SelectItem>
          <SelectItem value="regular">Regular</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.engagement} onValueChange={v => handleFilterChange("engagement", v)}>
        <SelectTrigger className="w-32"><SelectValue placeholder="Engagement" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Engagement</SelectItem>
          <SelectItem value="high">High (7+)</SelectItem>
          <SelectItem value="medium">Medium (4-6)</SelectItem>
          <SelectItem value="low">Low (0-3)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
