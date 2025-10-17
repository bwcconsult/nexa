import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Edit, X } from "lucide-react";
import { format } from "date-fns";

export default function MeetingDetails({ meeting, onClose, onEdit }) {
  const getStatusBadge = (meeting) => {
    const now = new Date();
    const startDate = new Date(meeting.start_date);
    const endDate = new Date(meeting.end_date);
    
    let status = meeting.status || "scheduled";
    let color = "bg-blue-100 text-blue-800";
    
    if (meeting.status === "cancelled") {
      status = "cancelled";
      color = "bg-red-100 text-red-800";
    } else if (meeting.status === "completed") {
      status = "completed";
      color = "bg-green-100 text-green-800";
    } else if (now >= startDate && now <= endDate) {
      status = "in progress";
      color = "bg-orange-100 text-orange-800";
    } else if (now > endDate) {
      status = "completed";
      color = "bg-gray-100 text-gray-800";
    }
    
    return <Badge className={`${color} capitalize`}>{status}</Badge>;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{meeting.title}</DialogTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(meeting)}
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div>
              <div className="font-medium">
                {format(new Date(meeting.start_date), 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="text-sm text-slate-500">
                {format(new Date(meeting.start_date), 'h:mm a')} - {format(new Date(meeting.end_date), 'h:mm a')}
              </div>
            </div>
          </div>

          {/* Location */}
          {meeting.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm text-slate-600">{meeting.location}</div>
              </div>
            </div>
          )}

          {/* Meeting URL */}
          {meeting.meeting_url && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                🔗
              </div>
              <div>
                <div className="font-medium">Meeting Link</div>
                <a 
                  href={meeting.meeting_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {meeting.meeting_url}
                </a>
              </div>
            </div>
          )}

          {/* Host */}
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-slate-400" />
            <div>
              <div className="font-medium">Host</div>
              <div className="text-sm text-slate-600">{meeting.host || meeting.created_by}</div>
            </div>
          </div>

          {/* Participants */}
          {meeting.participants && meeting.participants.length > 0 && (
            <div>
              <div className="font-medium mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Participants ({meeting.participants.length})
              </div>
              <div className="space-y-2">
                {meeting.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div>
                      <div className="font-medium">{participant.name || participant.email}</div>
                      {participant.name && participant.email && (
                        <div className="text-sm text-slate-500">{participant.email}</div>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {participant.status || 'invited'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agenda */}
          {meeting.agenda && (
            <div>
              <div className="font-medium mb-2">Agenda</div>
              <div className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded">
                {meeting.agenda}
              </div>
            </div>
          )}

          {/* Notes */}
          {meeting.notes && (
            <div>
              <div className="font-medium mb-2">Notes</div>
              <div className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded">
                {meeting.notes}
              </div>
            </div>
          )}

          {/* Meeting Details */}
          <div className="border-t pt-4">
            <div className="text-sm text-slate-500 space-y-1">
              <div>Created: {format(new Date(meeting.created_date), 'MMM d, yyyy h:mm a')}</div>
              {meeting.repeat !== "none" && (
                <div>Repeats: {meeting.repeat}</div>
              )}
              {meeting.reminder !== "none" && (
                <div>Reminder: {meeting.reminder.replace('_', ' ')}</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}