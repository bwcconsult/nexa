import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles,
  Mail,
  Copy,
  RefreshCw,
  Zap,
  CheckCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function EmailAssistant({ recipient, onApply }) {
  const [purpose, setPurpose] = useState('follow_up');
  const [tone, setTone] = useState('professional');
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/generate-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            recipient: {
              first_name: recipient?.first_name || recipient?.name || 'there',
              company: recipient?.company || recipient?.account_name
            },
            purpose,
            tone
          })
        }
      );
      
      const data = await response.json();
      setDraft(data);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Email Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            AI Email Assistant
          </DialogTitle>
          <DialogDescription>
            Generate personalized email drafts with AI
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="introduction">Introduction</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="meeting_request">Meeting Request</SelectItem>
                  <SelectItem value="check_in">Check-in</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={generateEmail} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Email Draft
              </>
            )}
          </Button>
          
          {draft && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Subject Line</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(draft.subject)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm font-medium">
                  {draft.subject}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Email Body</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(draft.body)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <Textarea
                  value={draft.body}
                  onChange={(e) => setDraft({...draft, body: e.target.value})}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              
              {draft.confidence && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Confidence: {Math.round(draft.confidence * 100)}%</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {draft && (
          <DialogFooter>
            <Button variant="outline">
              Save as Template
            </Button>
            <Button onClick={() => onApply?.(draft)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Use This Draft
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function NextBestActionWidget({ entityType, entityId }) {
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNextAction();
  }, [entityType, entityId]);

  const fetchNextAction = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/next-action/${entityType}/${entityId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setAction(data);
    } catch (error) {
      console.error('Error fetching next action:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            AI Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Analyzing...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!action) return null;

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            AI Recommendation
          </CardTitle>
          <Badge className={getPriorityColor(action.priority)}>
            {action.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="font-medium mb-1">{action.title}</div>
          <div className="text-sm text-muted-foreground">
            {action.description}
          </div>
        </div>
        
        {action.estimated_impact && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <strong>Impact:</strong> {action.estimated_impact}
          </div>
        )}
        
        {action.confidence && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>{Math.round(action.confidence * 100)}% confidence</span>
          </div>
        )}
        
        <Button size="sm" className="w-full">
          <CheckCircle className="w-4 h-4 mr-2" />
          Take Action
        </Button>
      </CardContent>
    </Card>
  );
}

export default { EmailAssistant, NextBestActionWidget };
