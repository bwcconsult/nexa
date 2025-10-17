
import React, { useState, useEffect } from "react";
import { LinkAnalytics as LinkAnalyticsEntity } from "@/api/apiClient";
import { Plus, Search, ExternalLink, TrendingUp, MousePointer, DollarSign, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import LinkStatsCards from "../components/link-analytics/LinkStatsCards";
import LinkTable from "../components/link-analytics/LinkTable";
import LinkForm from "../components/link-analytics/LinkForm";
import LinkPerformanceChart from "../components/link-analytics/LinkPerformanceChart";

export default function LinkAnalyticsPage() {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLink, setSelectedLink] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  useEffect(() => {
    filterLinks();
  }, [links, searchTerm, platformFilter]);

  const loadLinks = async () => {
    try {
      const data = await LinkAnalyticsEntity.list("-clicks");
      setLinks(data);
    } catch (error) {
      console.error("Error loading link analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLinks = () => {
    let filtered = links;

    if (searchTerm) {
      filtered = filtered.filter(link =>
        link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.link_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.destination_url?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter(link => link.platform === platformFilter);
    }

    setFilteredLinks(filtered);
  };

  const handleSaveLink = async (linkData) => {
    try {
      if (selectedLink) {
        await LinkAnalyticsEntity.update(selectedLink.id, linkData);
      } else {
        await LinkAnalyticsEntity.create(linkData);
      }
      await loadLinks();
      setShowForm(false);
      setSelectedLink(null);
    } catch (error) {
      console.error("Error saving link:", error);
    }
  };

  const handleEditLink = (link) => {
    setSelectedLink(link);
    setShowForm(true);
  };

  const calculateStats = () => {
    const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const totalConversions = links.reduce((sum, link) => sum + (link.conversions || 0), 0);
    const totalRevenue = links.reduce((sum, link) => sum + (link.revenue_generated || 0), 0);
    const avgConversionRate = totalClicks > 0 ? 
      (totalConversions / totalClicks * 100) : 0;

    return { totalClicks, totalConversions, totalRevenue, avgConversionRate };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Link Analytics
          </h1>
          <p className="text-slate-600 mt-1">
            Track performance of your creator platform links
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowForm(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        </div>
      </div>

      <LinkStatsCards stats={stats} />
      <LinkPerformanceChart links={filteredLinks} />

      <Card className="glass-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20 focus:bg-white/80"
              />
            </div>
            <div className="flex gap-2">
              {["all", "linktree", "beacons", "stan_store", "custom"].map(platform => (
                <Button
                  key={platform}
                  variant={platformFilter === platform ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPlatformFilter(platform)}
                  className="capitalize"
                >
                  {platform === 'all' ? 'All Platforms' : platform.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <LinkTable links={filteredLinks} onEditLink={handleEditLink} isLoading={isLoading} />

      {showForm && (
        <LinkForm
          link={selectedLink}
          onSave={handleSaveLink}
          onCancel={() => { setShowForm(false); setSelectedLink(null); }}
        />
      )}
    </div>
  );
}
