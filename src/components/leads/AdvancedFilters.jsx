import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Building, DollarSign } from "lucide-react";

export default function AdvancedFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      source: "all",
      score_range: "all",
      owner: "all",
      date_range: "all"
    });
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-slate-900">Advanced Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Label>
          <Select value={filters.date_range} onValueChange={v => handleFilterChange("date_range", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company Size
          </Label>
          <Select onValueChange={v => handleFilterChange("company_size", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Any size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startup">Startup (1-10)</SelectItem>
              <SelectItem value="small">Small (11-50)</SelectItem>
              <SelectItem value="medium">Medium (51-200)</SelectItem>
              <SelectItem value="large">Large (201-1000)</SelectItem>
              <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <Input placeholder="City, State, Country..." />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Expected Value
          </Label>
          <Select onValueChange={v => handleFilterChange("value_range", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Any value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Under $1,000</SelectItem>
              <SelectItem value="medium">$1,000 - $10,000</SelectItem>
              <SelectItem value="high">$10,000 - $50,000</SelectItem>
              <SelectItem value="enterprise">$50,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}