import React, { useState, useEffect } from "react";
import { Plus, Search, TrendingUp, MoreVertical, Edit, Trash2, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Forecasts() {
  const [forecasts, setForecasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    forecast_name: "",
    forecast_period: "",
    start_date: "",
    end_date: "",
    quota: 0,
    committed_amount: 0,
    best_case_amount: 0,
    pipeline_amount: 0,
    closed_amount: 0,
    status: "Draft",
    notes: ""
  });

  useEffect(() => {
    loadForecasts();
  }, []);

  const loadForecasts = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          forecast_name: "Q1 2025 Forecast",
          forecast_period: "Q1 2025",
          start_date: "2025-01-01",
          end_date: "2025-03-31",
          quota: 500000,
          committed_amount: 350000,
          best_case_amount: 425000,
          pipeline_amount: 550000,
          closed_amount: 280000,
          status: "Submitted",
          submitted_date: "2025-01-20"
        },
        {
          id: "2",
          forecast_name: "Q2 2025 Forecast",
          forecast_period: "Q2 2025",
          start_date: "2025-04-01",
          end_date: "2025-06-30",
          quota: 550000,
          committed_amount: 0,
          best_case_amount: 0,
          pipeline_amount: 0,
          closed_amount: 0,
          status: "Draft",
          submitted_date: null
        }
      ];
      setForecasts(mockData);
    } catch (err) {
      console.error("Failed to load forecasts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedForecast) {
        console.log("Updating forecast:", formData);
      } else {
        console.log("Creating forecast:", formData);
      }
      await loadForecasts();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving forecast:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this forecast?")) {
      try {
        console.log("Deleting forecast:", id);
        await loadForecasts();
      } catch (error) {
        console.error("Error deleting forecast:", error);
      }
    }
  };

  const handleEdit = (forecast) => {
    setSelectedForecast(forecast);
    setFormData(forecast);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedForecast(null);
    setFormData({
      forecast_name: "",
      forecast_period: "",
      start_date: "",
      end_date: "",
      quota: 0,
      committed_amount: 0,
      best_case_amount: 0,
      pipeline_amount: 0,
      closed_amount: 0,
      status: "Draft",
      notes: ""
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Draft: "bg-gray-100 text-gray-800",
      Submitted: "bg-blue-100 text-blue-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const calculateAttainment = (closed, quota) => {
    return quota > 0 ? Math.round((closed / quota) * 100) : 0;
  };

  const filteredForecasts = forecasts.filter(forecast =>
    forecast.forecast_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forecast.forecast_period?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuota = forecasts.reduce((sum, f) => sum + f.quota, 0);
  const totalClosed = forecasts.reduce((sum, f) => sum + f.closed_amount, 0);
  const totalCommitted = forecasts.reduce((sum, f) => sum + f.committed_amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forecasts</h1>
          <p className="text-gray-500 mt-1">Sales forecasting and quota management</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Forecast
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Quota</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalQuota.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Closed Amount</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalClosed.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Committed</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommitted.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attainment</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAttainment(totalClosed, totalQuota)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search forecasts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Forecast Name</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Quota</TableHead>
                <TableHead>Closed</TableHead>
                <TableHead>Attainment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredForecasts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No forecasts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredForecasts.map((forecast) => {
                  const attainment = calculateAttainment(forecast.closed_amount, forecast.quota);
                  return (
                    <motion.tr
                      key={forecast.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">{forecast.forecast_name}</TableCell>
                      <TableCell>{forecast.forecast_period}</TableCell>
                      <TableCell>${forecast.quota.toLocaleString()}</TableCell>
                      <TableCell>${forecast.closed_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{attainment}%</span>
                          </div>
                          <Progress value={attainment} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(forecast.status)}>
                          {forecast.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {forecast.submitted_date ? new Date(forecast.submitted_date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(forecast)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="w-4 h-4 mr-2" />
                              Submit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(forecast.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedForecast ? "Edit Forecast" : "New Forecast"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Forecast Name *</Label>
                <Input
                  value={formData.forecast_name}
                  onChange={(e) => setFormData({ ...formData, forecast_name: e.target.value })}
                  placeholder="Q1 2025 Forecast"
                />
              </div>
              <div>
                <Label>Period *</Label>
                <Input
                  value={formData.forecast_period}
                  onChange={(e) => setFormData({ ...formData, forecast_period: e.target.value })}
                  placeholder="Q1 2025"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quota</Label>
                <Input
                  type="number"
                  value={formData.quota}
                  onChange={(e) => setFormData({ ...formData, quota: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Committed Amount</Label>
                <Input
                  type="number"
                  value={formData.committed_amount}
                  onChange={(e) => setFormData({ ...formData, committed_amount: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedForecast ? "Update" : "Create"} Forecast
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
