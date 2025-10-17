import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Deal, Contact, Order, Activity } from "@/api/apiClient";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, Target, Calendar } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function AdvancedAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [data, setData] = useState({
    revenue: [],
    pipeline: [],
    leadSource: [],
    salesRep: [],
    conversionFunnel: [],
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDeals: 0,
    conversionRate: 0,
    avgDealSize: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [deals, contacts, orders, activities] = await Promise.all([
        Deal.list("-created_date", 1000),
        Contact.list("-created_date", 1000),
        Order.list("-order_date", 500),
        Activity.list("-created_date", 500),
      ]);

      // Calculate revenue over time
      const revenueByMonth = {};
      deals.filter(d => d.stage === 'Closed Won').forEach(deal => {
        const month = new Date(deal.close_date || deal.created_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + (deal.amount || 0);
      });

      const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
        month,
        revenue: Math.round(revenue),
      })).slice(-6);

      // Pipeline by stage
      const pipelineByStage = {};
      deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).forEach(deal => {
        pipelineByStage[deal.stage] = (pipelineByStage[deal.stage] || 0) + (deal.amount || 0);
      });

      const pipelineData = Object.entries(pipelineByStage).map(([stage, value]) => ({
        stage: stage.substring(0, 15),
        value: Math.round(value),
      }));

      // Lead source analysis
      const sourceCount = {};
      contacts.forEach(contact => {
        const source = contact.source || 'Unknown';
        sourceCount[source] = (sourceCount[source] || 0) + 1;
      });

      const sourceData = Object.entries(sourceCount).map(([name, value]) => ({
        name,
        value,
      }));

      // Conversion funnel
      const funnelData = [
        { stage: 'Leads', count: contacts.filter(c => c.status === 'lead').length },
        { stage: 'Qualified', count: contacts.filter(c => c.status === 'qualified').length },
        { stage: 'Proposal', count: deals.filter(d => d.stage === 'Proposal/Price Quote').length },
        { stage: 'Negotiation', count: deals.filter(d => d.stage === 'Negotiation/Review').length },
        { stage: 'Closed Won', count: deals.filter(d => d.stage === 'Closed Won').length },
      ];

      // Calculate stats
      const wonDeals = deals.filter(d => d.stage === 'Closed Won');
      const totalRevenue = wonDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
      const totalDeals = deals.length;
      const conversionRate = totalDeals > 0 ? (wonDeals.length / totalDeals * 100) : 0;
      const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;

      setData({
        revenue: revenueData,
        pipeline: pipelineData,
        leadSource: sourceData,
        conversionFunnel: funnelData,
      });

      setStats({
        totalRevenue,
        totalDeals,
        conversionRate,
        avgDealSize,
      });

    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Comprehensive business insights and reporting</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-32" /> : (
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Deals</CardTitle>
            <Target className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : (
              <div className="text-2xl font-bold">{stats.totalDeals}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : (
              <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg Deal Size</CardTitle>
            <DollarSign className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-28" /> : (
              <div className="text-2xl font-bold">${stats.avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pipeline by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.pipeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#8b5cf6" name="Value" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Lead Source */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.leadSource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.leadSource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.conversionFunnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
