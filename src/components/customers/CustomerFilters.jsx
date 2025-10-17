import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CustomerFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex gap-2">
      <Select value={filters.status} onValueChange={v => handleFilterChange("status", v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="lead">Lead</SelectItem>
          <SelectItem value="prospect">Prospect</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="vip">VIP</SelectItem>
          <SelectItem value="churned">Churned</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.source} onValueChange={v => handleFilterChange("source", v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="direct">Direct</SelectItem>
          <SelectItem value="organic">Organic</SelectItem>
          <SelectItem value="paid_ads">Paid Ads</SelectItem>
          <SelectItem value="referral">Referral</SelectItem>
          <SelectItem value="social">Social</SelectItem>
          <SelectItem value="email">Email</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.tier} onValueChange={v => handleFilterChange("tier", v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          <SelectItem value="vip">VIP ($5K+)</SelectItem>
          <SelectItem value="premium">Premium ($1K-$5K)</SelectItem>
          <SelectItem value="regular">Regular (&lt;$1K)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
