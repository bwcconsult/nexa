import React, { useState, useEffect } from "react";
import { Plus, Search, Code, MoreVertical, Edit, Trash2, Play, Zap } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CustomFunctions() {
  const [functions, setFunctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [formData, setFormData] = useState({
    function_name: "",
    display_name: "",
    description: "",
    category: "custom",
    trigger_type: "manual",
    is_active: true,
    function_code: ""
  });

  useEffect(() => {
    loadFunctions();
  }, []);

  const loadFunctions = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          function_name: "send_slack_notification",
          display_name: "Send Slack Notification",
          description: "Send message to Slack channel",
          category: "notification",
          trigger_type: "event",
          is_active: true,
          execution_count: 1245,
          success_count: 1230,
          avg_execution_time_ms: 145
        },
        {
          id: "2",
          function_name: "calculate_commission",
          display_name: "Calculate Commission",
          description: "Calculate sales commission based on deal",
          category: "automation",
          trigger_type: "manual",
          is_active: true,
          execution_count: 567,
          success_count: 567,
          avg_execution_time_ms: 23
        },
        {
          id: "3",
          function_name: "sync_to_external_api",
          display_name: "Sync to External API",
          description: "Sync data to external system",
          category: "integration",
          trigger_type: "scheduled",
          is_active: false,
          execution_count: 89,
          success_count: 82,
          avg_execution_time_ms: 892
        }
      ];
      setFunctions(mockData);
    } catch (err) {
      console.error("Failed to load functions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedFunction) {
        console.log("Updating function:", formData);
      } else {
        console.log("Creating function:", formData);
      }
      await loadFunctions();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving function:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this function?")) {
      try {
        console.log("Deleting function:", id);
        await loadFunctions();
      } catch (error) {
        console.error("Error deleting function:", error);
      }
    }
  };

  const handleEdit = (func) => {
    setSelectedFunction(func);
    setFormData(func);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedFunction(null);
    setFormData({
      function_name: "",
      display_name: "",
      description: "",
      category: "custom",
      trigger_type: "manual",
      is_active: true,
      function_code: ""
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      automation: "bg-blue-100 text-blue-800",
      integration: "bg-purple-100 text-purple-800",
      data_transformation: "bg-green-100 text-green-800",
      validation: "bg-orange-100 text-orange-800",
      notification: "bg-teal-100 text-teal-800",
      custom: "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getSuccessRate = (func) => {
    if (func.execution_count === 0) return "0";
    return ((func.success_count / func.execution_count) * 100).toFixed(1);
  };

  const filteredFunctions = functions.filter(func => {
    const matchesSearch = func.function_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         func.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || func.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExecutions = functions.reduce((sum, f) => sum + f.execution_count, 0);
  const totalSuccess = functions.reduce((sum, f) => sum + f.success_count, 0);
  const avgSuccessRate = totalExecutions > 0 ? ((totalSuccess / totalExecutions) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Functions</h1>
          <p className="text-gray-500 mt-1">Write custom JavaScript business logic</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Function
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Functions</CardTitle>
            <Code className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{functions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Zap className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Zap className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Functions</CardTitle>
            <Code className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{functions.filter(f => f.is_active).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search functions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
                <SelectItem value="data_transformation">Data Transformation</SelectItem>
                <SelectItem value="validation">Validation</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Function Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Avg Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredFunctions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No functions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFunctions.map((func) => (
                  <motion.tr
                    key={func.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{func.display_name}</div>
                        <div className="text-sm text-gray-500 font-mono">{func.function_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(func.category)}>
                        {func.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{func.trigger_type}</Badge>
                    </TableCell>
                    <TableCell>{func.execution_count}</TableCell>
                    <TableCell>{getSuccessRate(func)}%</TableCell>
                    <TableCell>{func.avg_execution_time_ms}ms</TableCell>
                    <TableCell>
                      <Badge className={func.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {func.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(func)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Test Run
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(func.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFunction ? "Edit Function" : "New Custom Function"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Function Name * (snake_case)</Label>
                <Input
                  value={formData.function_name}
                  onChange={(e) => setFormData({ ...formData, function_name: e.target.value })}
                  placeholder="e.g. send_notification"
                  className="font-mono"
                />
              </div>
              <div>
                <Label>Display Name *</Label>
                <Input
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="e.g. Send Notification"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this function do?"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="data_transformation">Data Transformation</SelectItem>
                    <SelectItem value="validation">Validation</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Trigger Type</Label>
                <Select
                  value={formData.trigger_type}
                  onValueChange={(value) => setFormData({ ...formData, trigger_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="button">Button</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Function Code</Label>
              <Textarea
                value={formData.function_code}
                onChange={(e) => setFormData({ ...formData, function_code: e.target.value })}
                placeholder="// Write your JavaScript code here..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-gray-500">Enable this function</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedFunction ? "Update" : "Create"} Function
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
