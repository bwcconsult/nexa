import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Paperclip, Image as ImageIcon, AtSign } from "lucide-react";
import { EmailAPI } from "@/api/apiClient";

export default function EmailComposer({ recipient, onClose, onSent }) {
  const [formData, setFormData] = useState({
    to: recipient?.email || "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    template: "none",
  });
  const [sending, setSending] = useState(false);

  const emailTemplates = [
    { id: "none", name: "No Template" },
    { id: "introduction", name: "Introduction Email", body: "Hi {name},\n\nI wanted to reach out and introduce myself..." },
    { id: "followup", name: "Follow-up Email", body: "Hi {name},\n\nI wanted to follow up on our previous conversation..." },
    { id: "meeting_request", name: "Meeting Request", body: "Hi {name},\n\nI'd love to schedule a meeting to discuss..." },
    { id: "proposal", name: "Proposal Follow-up", body: "Hi {name},\n\nThank you for your interest. Please find our proposal attached..." },
    { id: "thankyou", name: "Thank You", body: "Hi {name},\n\nThank you for your time today. I appreciate..." },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (templateId) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template && template.body) {
      const personalizedBody = template.body.replace('{name}', recipient?.first_name || recipient?.name || 'there');
      setFormData(prev => ({ ...prev, template: templateId, body: personalizedBody }));
    } else {
      setFormData(prev => ({ ...prev, template: templateId }));
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await EmailAPI.send({
        to: formData.to,
        cc: formData.cc || undefined,
        bcc: formData.bcc || undefined,
        subject: formData.subject,
        body: formData.body,
        html: formData.body.replace(/\n/g, '<br>'),
      });
      
      onSent?.({
        ...formData,
        sent_at: new Date().toISOString(),
        status: 'sent',
      });
      
      onClose();
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
          <DialogDescription>Send an email to your contact</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Selector */}
          <div>
            <Label>Email Template</Label>
            <Select value={formData.template} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipients */}
          <div>
            <Label htmlFor="to">To *</Label>
            <Input
              id="to"
              type="email"
              value={formData.to}
              onChange={e => handleChange("to", e.target.value)}
              placeholder="recipient@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cc">CC</Label>
              <Input
                id="cc"
                type="email"
                value={formData.cc}
                onChange={e => handleChange("cc", e.target.value)}
                placeholder="cc@example.com"
              />
            </div>
            <div>
              <Label htmlFor="bcc">BCC</Label>
              <Input
                id="bcc"
                type="email"
                value={formData.bcc}
                onChange={e => handleChange("bcc", e.target.value)}
                placeholder="bcc@example.com"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={e => handleChange("subject", e.target.value)}
              placeholder="Email subject"
              required
            />
          </div>

          {/* Body */}
          <div>
            <Label htmlFor="body">Message *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={e => handleChange("body", e.target.value)}
              placeholder="Write your email message..."
              rows={12}
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.body.length} characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Paperclip className="w-4 h-4" />
                Attach
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <AtSign className="w-4 h-4" />
                Variable
              </Button>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!formData.to || !formData.subject || !formData.body || sending}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
