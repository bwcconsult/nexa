import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, X } from "lucide-react";

const REMINDER_OPTIONS = [
  { value: "none", label: "None" },
  { value: "5_minutes", label: "5 minutes before" },
  { value: "10_minutes", label: "10 minutes before" },
  { value: "15_minutes", label: "15 minutes before" },
  { value: "30_minutes", label: "30 minutes before" },
  { value: "1_hour", label: "1 hour before" },
  { value: "2_hours", label: "2 hours before" },
  { value: "1_day", label: "1 day before" },
  { value: "2_days", label: "2 days before" }
];

const REPEAT_OPTIONS = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" }
];

export default function MeetingForm({ meeting, contacts, accounts, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: meeting?.title || "",
    location: meeting?.location || "",
    all_day: meeting?.all_day || false,
    start_date: meeting?.start_date ? new Date(meeting.start_date).toISOString().slice(0, 16) : "",
    end_date: meeting?.end_date ? new Date(meeting.end_date).toISOString().slice(0, 16) : "",
    host: meeting?.host || "",
    participants: meeting?.participants || [],
    related_to: meeting?.related_to || "",
    related_to_type: meeting?.related_to_type || "contact",
    repeat: meeting?.repeat || "none",
    reminder: meeting?.reminder || "15_minutes",
    notes: meeting?.notes || "",
    agenda: meeting?.agenda || "",
    meeting_url: meeting?.meeting_url || ""
  });

  const [newParticipant, setNewParticipant] = useState({ email: "", name: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    if (newParticipant.email) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, { ...newParticipant, status: "invited" }]
      }));
      setNewParticipant({ email: "", name: "" });
    }
  };

  const removeParticipant = (index) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meeting ? "Edit Meeting" : "Create Meeting"}</DialogTitle>
          <DialogDescription>Fill in the meeting information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {/* Meeting Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Meeting Information</h3>
            
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={e => handleChange("title", e.target.value)} 
                required 
                placeholder="New Meeting"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={e => handleChange("location", e.target.value)} 
                placeholder="Meeting room or virtual link"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="all_day" 
                checked={formData.all_day} 
                onCheckedChange={v => handleChange("all_day", v)} 
              />
              <Label htmlFor="all_day">All day</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start_date">From *</Label>
                <Input 
                  id="start_date" 
                  type="datetime-local" 
                  value={formData.start_date} 
                  onChange={e => handleChange("start_date", e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="end_date">To *</Label>
                <Input 
                  id="end_date" 
                  type="datetime-local" 
                  value={formData.end_date} 
                  onChange={e => handleChange("end_date", e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="host">Host</Label>
              <Input 
                id="host" 
                value={formData.host} 
                onChange={e => handleChange("host", e.target.value)} 
                placeholder="Meeting host"
              />
            </div>

            {/* Participants */}
            <div>
              <Label>Participants</Label>
              <div className="space-y-2">
                {formData.participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                    <Badge variant="outline">{participant.name || participant.email}</Badge>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeParticipant(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Participant email" 
                    value={newParticipant.email}
                    onChange={e => setNewParticipant(prev => ({...prev, email: e.target.value}))}
                  />
                  <Input 
                    placeholder="Name (optional)" 
                    value={newParticipant.name}
                    onChange={e => setNewParticipant(prev => ({...prev, name: e.target.value}))}
                  />
                  <Button type="button" onClick={addParticipant} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="related_to_type">Related To</Label>
                <Select value={formData.related_to_type} onValueChange={v => handleChange("related_to_type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="deal">Deal</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="repeat">Repeat</Label>
                <Select value={formData.repeat} onValueChange={v => handleChange("repeat", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPEAT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="reminder">Participants Reminder</Label>
              <Select value={formData.reminder} onValueChange={v => handleChange("reminder", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REMINDER_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="meeting_url">Meeting URL</Label>
              <Input 
                id="meeting_url" 
                value={formData.meeting_url} 
                onChange={e => handleChange("meeting_url", e.target.value)} 
                placeholder="Zoom, Teams, or other meeting link"
              />
            </div>

            <div>
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea 
                id="agenda" 
                value={formData.agenda} 
                onChange={e => handleChange("agenda", e.target.value)} 
                placeholder="Meeting agenda and topics"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={formData.notes} 
                onChange={e => handleChange("notes", e.target.value)} 
                placeholder="Additional meeting notes"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {meeting ? "Update Meeting" : "Save Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}