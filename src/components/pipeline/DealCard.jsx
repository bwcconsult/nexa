import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { format } from "date-fns";

export default function DealCard({ deal, accountName, contactName, onClick, isDragging }) {
  return (
    <Card 
      onClick={onClick} 
      className={`bg-white dark:bg-slate-900 cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${isDragging ? 'shadow-xl rotate-3' : 'shadow-md'} border-blue-500`}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{deal.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{accountName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{contactName}</p>
            </div>
            <CheckSquare className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-2">
          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
            ${(deal.value || 0).toLocaleString()}
          </span>
          {deal.expected_close_date && (
            <span className="text-red-500 font-medium">
              {format(new Date(deal.expected_close_date), "dd MMM, yyyy")}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}