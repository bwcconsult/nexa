import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, FileText, DollarSign, User, MessageSquare, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function ActivityTimeline({ activities = [], emails = [], calls = [], meetings = [], deals = [] }) {
  // Combine all activities into a unified timeline
  const allActivities = [
    ...activities.map(a => ({ ...a, type: 'activity', icon: CheckSquare })),
    ...emails.map(e => ({ ...e, type: 'email', icon: Mail })),
    ...calls.map(c => ({ ...c, type: 'call', icon: Phone })),
    ...meetings.map(m => ({ ...m, type: 'meeting', icon: Calendar })),
    ...deals.map(d => ({ ...d, type: 'deal', icon: DollarSign })),
  ].sort((a, b) => new Date(b.created_date || b.date || 0) - new Date(a.created_date || a.date || 0));

  const getActivityColor = (type) => {
    const colors = {
      email: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50',
      call: 'text-green-600 bg-green-100 dark:bg-green-900/50',
      meeting: 'text-purple-600 bg-purple-100 dark:bg-purple-900/50',
      activity: 'text-orange-600 bg-orange-100 dark:bg-orange-900/50',
      deal: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50',
      note: 'text-slate-600 bg-slate-100 dark:bg-slate-900/50',
    };
    return colors[type] || colors.note;
  };

  const getActivityTitle = (activity) => {
    switch (activity.type) {
      case 'email':
        return activity.subject || 'Email sent';
      case 'call':
        return `Call: ${activity.duration || 'N/A'} mins`;
      case 'meeting':
        return activity.title || 'Meeting scheduled';
      case 'deal':
        return `Deal ${activity.stage || 'updated'}`;
      case 'activity':
        return activity.title || activity.subject || 'Task completed';
      default:
        return 'Activity';
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'email':
        return `To: ${activity.to || 'Unknown'}`;
      case 'call':
        return activity.notes || activity.purpose || 'Call logged';
      case 'meeting':
        return `${format(new Date(activity.start_date || activity.date), 'MMM d, h:mm a')}`;
      case 'deal':
        return `$${(activity.amount || 0).toLocaleString()} - ${activity.stage}`;
      case 'activity':
        return activity.description || activity.notes || '';
      default:
        return '';
    }
  };

  if (allActivities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-slate-500">
          No activity yet. Start engaging with this record!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {allActivities.map((activity, index) => {
        const Icon = activity.icon;
        const color = getActivityColor(activity.type);
        
        return (
          <Card key={index} className="relative">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {getActivityTitle(activity)}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {getActivityDescription(activity)}
                      </p>
                      {activity.body && (
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2 line-clamp-2">
                          {activity.body}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className="capitalize">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {format(new Date(activity.created_date || activity.date || Date.now()), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>

                  {/* User */}
                  {activity.created_by && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                      <User className="w-3 h-3" />
                      <span>{activity.created_by}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < allActivities.length - 1 && (
                <div className="absolute left-8 top-14 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
