import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Mail, Phone, Target, Trash2, Download, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BulkActions({ selectedCount, onClearSelection, onBulkAction }) {
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} selected
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSelection}
            className="gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onBulkAction('email')}
            className="gap-2"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onBulkAction('call')}
            className="gap-2"
          >
            <Phone className="w-4 h-4" />
            Schedule Call
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onBulkAction('deal')}
            className="gap-2"
          >
            <Target className="w-4 h-4" />
            Create Deals
          </Button>
          
          <Select onValueChange={onBulkAction}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status-prospect">Mark as Prospect</SelectItem>
              <SelectItem value="status-customer">Convert to Customer</SelectItem>
              <SelectItem value="status-churned">Mark as Churned</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onBulkAction('export')}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onBulkAction('delete')}
            className="gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}