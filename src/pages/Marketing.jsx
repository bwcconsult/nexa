
import React, { useState, useEffect } from "react";
import { Campaign } from "@/api/apiClient";
import { Plus, Search, Filter, Mail, Send, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Marketing() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await Campaign.list("-created_date");
        setCampaigns(data);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaigns();
  }, []);
  const getStatusBadge = (status) => {
    switch (status) {
      case "active": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Active</Badge>;
      case "completed": return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Completed</Badge>;
      case "draft": return <Badge variant="secondary">Draft</Badge>;
      case "scheduled": return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">Scheduled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const totalSubscribers = campaigns.reduce((sum, c) => sum + (c.total_recipients || 0), 0);
  const avgOpenRate = campaigns.length > 0 ? 
    campaigns.reduce((sum, c) => sum + (parseFloat(c.open_rate) || 0), 0) / campaigns.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketing Automation</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Create and manage your marketing campaigns.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Total Campaigns</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : campaigns.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Total Recipients</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{isLoading ? <Skeleton className="h-8 w-24" /> : totalSubscribers.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Avg. Open Rate</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : `${avgOpenRate.toFixed(1)}%`}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No campaigns yet. Create your first campaign to get started.
              </div>
            ) : campaigns.map(c => (
              <Card key={c.id} className="flex flex-col md:flex-row items-center justify-between p-4">
                <div className="flex-1 mb-4 md:mb-0">
                  <h3 className="font-semibold">{c.name || c.campaign_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <Badge variant="outline" className="capitalize">{c.type || c.campaign_type || 'email'}</Badge>
                    {getStatusBadge(c.status)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center w-full md:w-auto">
                  <div>
                    <p className="font-bold text-lg">{(c.total_sent || c.total_recipients || 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Sent</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{c.open_rate ? `${parseFloat(c.open_rate).toFixed(1)}%` : '0%'}</p>
                    <p className="text-xs text-slate-500">Open Rate</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{c.click_rate ? `${parseFloat(c.click_rate).toFixed(1)}%` : '0%'}</p>
                    <p className="text-xs text-slate-500">Click Rate</p>
                  </div>
                </div>
                <div className="ml-4 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">View Report</Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
