import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";

export default function TaskCard({ task, relatedName, onClick, isDragging }) {
  
  const priorityColors = {
    Highest: "bg-red-500",
    High: "bg-orange-500",
    Normal: "bg-yellow-500",
    Low: "bg-blue-500",
    Lowest: "bg-green-500",
  };
  
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'Completed';

  return (
    <Card 
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${isDragging ? 'shadow-xl rotate-3' : 'shadow-md'}`}
      style={{ borderLeftColor: priorityColors[task.priority] || 'gray' }}
    >
      <CardContent className="p-3 space-y-2">
        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{task.title}</p>
        
        {relatedName && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{relatedName}</p>
        )}
        
        <div className="flex items-center justify-between text-xs pt-2">
            <Badge variant="outline" className={`capitalize ${isOverdue ? 'text-red-500 border-red-500' : ''}`}>
                {task.due_date ? format(new Date(task.due_date), "dd MMM") : 'No due date'}
            </Badge>
            <Badge variant="secondary" className="capitalize">{task.priority}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}