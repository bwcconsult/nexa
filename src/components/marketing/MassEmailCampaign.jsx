import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Mail, Users, Send, Calendar, BarChart3, Target, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from "framer-motion";
import { EmailAPI, Lead, Contact } from "@/api/apiClient";

export default function MassEmailCampaign() {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    fromName: '',
    fromEmail: 'noreply@nexacrm.com',
    replyTo: '',
    body: '',
    template: 'none',
    sendTime: 'now',
    scheduledDate: '',
    scheduledTime: '',
  });

  const [recipients, setRecipients] = useState({
    type: 'all_leads',
    count: 0,
    filters: {},
    selectedIds: [],
  });

  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const emailTemplates = [
    { id: 'none', name: 'Blank Template' },
    { id: 'newsletter', name: 'Newsletter', body: 'Hi {name},\n\nCheck out our latest updates...' },
    { id: 'product_launch', name: 'Product Launch', body: 'Hi {name},\n\nExciting news! We\'re launching...' },
    { id: 'event_invite', name: 'Event Invitation', body: 'Hi {name},\n\nYou\'re invited to...' },
    { id: 'promotion', name: 'Promotion', body: 'Hi {name},\n\nSpecial offer just for you...' },
    { id: 'followup', name: 'Follow-up', body: 'Hi {name},\n\nJust following up on...' },
  ];

  const recipientOptions = [
    { value: 'all_leads', label: 'All Leads', icon: Target },
    { value: 'all_contacts', label: 'All Contacts', icon: Users },
    { value: 'hot_leads', label: 'Hot Leads (Score > 80)', icon: Target },
    { value: 'warm_leads', label: 'Warm Leads (Score 50-80)', icon: Target },
    { value: 'new_leads', label: 'New Leads (This Month)', icon: Target },
    { value: 'custom', label: 'Custom Selection', icon: Users },
  ];

  useEffect(() => {
    // Simulate getting recipient count
    const counts = {
      'all_leads': 1250,
      'all_contacts': 850,
      'hot_leads': 180,
      'warm_leads': 420,
      'new_leads': 95,
      'custom': 0,
    };
    setRecipients(prev => ({ ...prev, count: counts[prev.type] || 0 }));
  }, [recipients.type]);

  const handleTemplateSelect = (templateId) => {
    const template = emailTemplates.find(t => t.id === templateId);
    setCampaignData(prev => ({
      ...prev,
      template: templateId,
      body: template?.body || '',
    }));
  };

  const handleSendCampaign = async () => {
    setSending(true);
    setProgress(0);

    try {
      // Simulate sending emails in batches
      const totalEmails = recipients.count;
      const batchSize = 50;
      const batches = Math.ceil(totalEmails / batchSize);

      for (let i = 0; i < batches; i++) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(((i + 1) / batches) * 100);
      }

      // Set results
      setResults({
        sent: totalEmails,
        failed: Math.floor(Math.random() * 10),
        scheduled: campaignData.sendTime === 'scheduled' ? totalEmails : 0,
        timestamp: new Date().toISOString(),
      });

      setStep(4); // Go to results step
    } catch (error) {
      console.error('Campaign send error:', error);
      alert('Failed to send campaign. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                    placeholder="e.g., Q1 Newsletter"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Email Template</Label>
                  <Select
                    value={campaignData.template}
                    onValueChange={handleTemplateSelect}
                  >
                    <SelectTrigger id="template">
                      <SelectValue />
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromName">From Name *</Label>
                    <Input
                      id="fromName"
                      value={campaignData.fromName}
                      onChange={(e) => setCampaignData({ ...campaignData, fromName: e.target.value })}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email *</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={campaignData.fromEmail}
                      onChange={(e) => setCampaignData({ ...campaignData, fromEmail: e.target.value })}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="replyTo">Reply-To Email</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={campaignData.replyTo}
                    onChange={(e) => setCampaignData({ ...campaignData, replyTo: e.target.value })}
                    placeholder="replies@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject *</Label>
                  <Input
                    id="subject"
                    value={campaignData.subject}
                    onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
                    placeholder="e.g., Don't miss our latest updates!"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Email Body *</Label>
                  <Textarea
                    id="body"
                    value={campaignData.body}
                    onChange={(e) => setCampaignData({ ...campaignData, body: e.target.value })}
                    placeholder="Write your email message here..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-slate-500">
                    Use {'{name}'} to personalize with recipient's name
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Recipients</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {recipientOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all ${
                          recipients.type === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'hover:border-slate-300'
                        }`}
                        onClick={() => setRecipients({ ...recipients, type: option.value })}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${
                              recipients.type === option.value ? 'text-blue-600' : 'text-slate-400'
                            }`} />
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              {recipients.type === option.value && (
                                <div className="text-sm text-slate-500">
                                  {recipients.count.toLocaleString()} recipients
                                </div>
                              )}
                            </div>
                            {recipients.type === option.value && (
                              <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {recipients.count.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Total recipients selected
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Schedule & Review</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Send Time</Label>
                  <Select
                    value={campaignData.sendTime}
                    onValueChange={(value) => setCampaignData({ ...campaignData, sendTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send Now</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {campaignData.sendTime === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Date</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={campaignData.scheduledDate}
                        onChange={(e) => setCampaignData({ ...campaignData, scheduledDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime">Time</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={campaignData.scheduledTime}
                        onChange={(e) => setCampaignData({ ...campaignData, scheduledTime: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Campaign Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Campaign Name:</span>
                      <span className="font-medium">{campaignData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subject:</span>
                      <span className="font-medium">{campaignData.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">From:</span>
                      <span className="font-medium">{campaignData.fromName} ({campaignData.fromEmail})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Recipients:</span>
                      <span className="font-medium">{recipients.count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Send Time:</span>
                      <span className="font-medium capitalize">{campaignData.sendTime}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Please review all details carefully before sending. This email will be sent to {recipients.count.toLocaleString()} recipients.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Campaign {campaignData.sendTime === 'scheduled' ? 'Scheduled' : 'Sent'} Successfully!</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your email campaign has been {campaignData.sendTime === 'scheduled' ? 'scheduled' : 'sent'} to {results?.sent.toLocaleString()} recipients.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600">{results?.sent.toLocaleString()}</div>
                  <p className="text-sm text-slate-500">Emails Sent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-red-600">{results?.failed || 0}</div>
                  <p className="text-sm text-slate-500">Failed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600">
                    {((results?.sent / (results?.sent + results?.failed)) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-slate-500">Success Rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Track open rates and clicks in Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Monitor recipient engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Set up follow-up campaigns</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mass Email Campaign</CardTitle>
              <CardDescription>
                Send emails to multiple recipients at once
              </CardDescription>
            </div>
            {step < 4 && (
              <Badge variant="outline" className="text-lg px-4 py-2">
                Step {step} of 3
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          {step < 4 && (
            <div className="mb-8">
              <Progress value={(step / 3) * 100} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-slate-500">
                <span className={step >= 1 ? 'text-blue-600 font-medium' : ''}>Compose</span>
                <span className={step >= 2 ? 'text-blue-600 font-medium' : ''}>Recipients</span>
                <span className={step >= 3 ? 'text-blue-600 font-medium' : ''}>Review</span>
              </div>
            </div>
          )}

          {/* Sending Progress */}
          {sending && (
            <div className="mb-8">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold">Sending Campaign...</div>
                <div className="text-sm text-slate-500">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}

          {/* Step Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {step > 1 && step < 4 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} disabled={sending}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {step < 3 && (
                <Button onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              )}
              {step === 3 && (
                <Button onClick={handleSendCampaign} disabled={sending}>
                  <Send className="w-4 h-4 mr-2" />
                  {campaignData.sendTime === 'scheduled' ? 'Schedule' : 'Send'} Campaign
                </Button>
              )}
              {step === 4 && (
                <Button onClick={() => {
                  setStep(1);
                  setCampaignData({
                    name: '',
                    subject: '',
                    fromName: '',
                    fromEmail: 'noreply@nexacrm.com',
                    replyTo: '',
                    body: '',
                    template: 'none',
                    sendTime: 'now',
                    scheduledDate: '',
                    scheduledTime: '',
                  });
                  setResults(null);
                }}>
                  Create New Campaign
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
