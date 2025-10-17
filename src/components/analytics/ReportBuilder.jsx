import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Download, Eye, Edit, Trash2, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table2, Filter, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function ReportBuilder() {
  const [reports, setReports] = useState([
    { id: 1, name: 'Sales Performance Q4', type: 'bar', entity: 'Deal', metrics: ['Count', 'Total Value'], groupBy: 'Stage', dateRange: 'last_quarter', createdAt: '2025-09-15' },
    { id: 2, name: 'Lead Sources Analysis', type: 'pie', entity: 'Lead', metrics: ['Count'], groupBy: 'Source', dateRange: 'last_month', createdAt: '2025-09-20' },
    { id: 3, name: 'Revenue Trend', type: 'line', entity: 'Deal', metrics: ['Total Value'], groupBy: 'Month', dateRange: 'last_year', createdAt: '2025-09-01' },
    { id: 4, name: 'Customer Growth', type: 'line', entity: 'Customer', metrics: ['Count'], groupBy: 'Month', dateRange: 'last_6_months', createdAt: '2025-08-15' },
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const [reportConfig, setReportConfig] = useState({
    name: '',
    type: 'bar',
    entity: 'Lead',
    metrics: [],
    groupBy: 'Status',
    dateRange: 'last_month',
    filters: [],
    sortBy: 'value_desc',
  });

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChartIcon },
    { value: 'pie', label: 'Pie Chart', icon: PieChartIcon },
    { value: 'table', label: 'Table', icon: Table2 },
  ];

  const entities = [
    { value: 'Lead', label: 'Leads' },
    { value: 'Contact', label: 'Contacts' },
    { value: 'Account', label: 'Accounts' },
    { value: 'Deal', label: 'Deals' },
    { value: 'Customer', label: 'Customers' },
    { value: 'Order', label: 'Orders' },
    { value: 'Ticket', label: 'Support Tickets' },
  ];

  const metricOptions = {
    Lead: ['Count', 'Lead Score Average', 'Conversion Rate'],
    Contact: ['Count', 'Deals Created', 'Total Revenue'],
    Account: ['Count', 'Total Revenue', 'Active Deals'],
    Deal: ['Count', 'Total Value', 'Average Value', 'Win Rate'],
    Customer: ['Count', 'Total Spent', 'Average Order Value', 'LTV'],
    Order: ['Count', 'Total Revenue', 'Average Order Value'],
    Ticket: ['Count', 'Average Resolution Time', 'Satisfaction Score'],
  };

  const groupByOptions = {
    Lead: ['Status', 'Source', 'Assigned To', 'Industry', 'Month', 'Week'],
    Contact: ['Status', 'Assigned To', 'Account', 'Month', 'Week'],
    Account: ['Industry', 'Type', 'Assigned To', 'Month', 'Size'],
    Deal: ['Stage', 'Assigned To', 'Source', 'Month', 'Week', 'Quarter'],
    Customer: ['Tier', 'Status', 'Month', 'Source'],
    Order: ['Status', 'Customer', 'Month', 'Week'],
    Ticket: ['Status', 'Priority', 'Category', 'Assigned To', 'Month'],
  };

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'all_time', label: 'All Time' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  // Sample data for preview
  const generateSampleData = () => {
    const data = [];
    const categories = groupByOptions[reportConfig.entity] || ['Category A', 'Category B', 'Category C'];
    
    categories.slice(0, 6).forEach((category, index) => {
      data.push({
        name: category,
        value: Math.floor(Math.random() * 100) + 20,
        count: Math.floor(Math.random() * 50) + 10,
      });
    });
    return data;
  };

  const handleSaveReport = () => {
    const newReport = {
      id: Date.now(),
      ...reportConfig,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReports(prev => [...prev, newReport]);
    setShowBuilder(false);
    setReportConfig({
      name: '',
      type: 'bar',
      entity: 'Lead',
      metrics: [],
      groupBy: 'Status',
      dateRange: 'last_month',
      filters: [],
      sortBy: 'value_desc',
    });
  };

  const handleDeleteReport = (id) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const handlePreview = (report) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  const renderChart = (type, data) => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'table':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-right">{row.value.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
    }
  };

  const toggleMetric = (metric) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report Builder</CardTitle>
              <CardDescription>
                Create custom reports and visualizations
              </CardDescription>
            </div>
            <Button onClick={() => setShowBuilder(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {reports.map((report) => {
                const ChartIcon = chartTypes.find(t => t.value === report.type)?.icon || BarChart3;
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="group hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                              <ChartIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{report.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {report.entity} • {report.dateRange.replace(/_/g, ' ')}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" onClick={() => handlePreview(report)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="mt-4 flex gap-2 flex-wrap">
                          {report.metrics.map(metric => (
                            <Badge key={metric} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {reports.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No reports yet. Create your first custom report to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Builder Dialog */}
      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Report Name *</Label>
                <Input
                  value={reportConfig.name}
                  onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                  placeholder="e.g., Q4 Sales Performance"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Source *</Label>
                  <Select
                    value={reportConfig.entity}
                    onValueChange={(value) => setReportConfig({ 
                      ...reportConfig, 
                      entity: value,
                      metrics: [],
                      groupBy: groupByOptions[value][0]
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map(entity => (
                        <SelectItem key={entity.value} value={entity.value}>
                          {entity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chart Type *</Label>
                  <Select
                    value={reportConfig.type}
                    onValueChange={(value) => setReportConfig({ ...reportConfig, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Metrics *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(metricOptions[reportConfig.entity] || []).map(metric => (
                    <div key={metric} className="flex items-center space-x-2">
                      <Checkbox
                        id={metric}
                        checked={reportConfig.metrics.includes(metric)}
                        onCheckedChange={() => toggleMetric(metric)}
                      />
                      <Label htmlFor={metric} className="font-normal text-sm">
                        {metric}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Group By *</Label>
                  <Select
                    value={reportConfig.groupBy}
                    onValueChange={(value) => setReportConfig({ ...reportConfig, groupBy: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(groupByOptions[reportConfig.entity] || []).map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range *</Label>
                  <Select
                    value={reportConfig.dateRange}
                    onValueChange={(value) => setReportConfig({ ...reportConfig, dateRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRangeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview */}
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderChart(reportConfig.type, generateSampleData())}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowBuilder(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveReport} disabled={!reportConfig.name || reportConfig.metrics.length === 0}>
                Save Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge>{selectedReport.entity}</Badge>
                <Badge variant="outline">{selectedReport.type} chart</Badge>
                <Badge variant="secondary">{selectedReport.dateRange.replace(/_/g, ' ')}</Badge>
              </div>
              {renderChart(selectedReport.type, generateSampleData())}
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
