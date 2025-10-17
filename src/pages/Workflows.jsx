import React, { useState, useEffect } from "react";
import { Plus, Search, Zap, MoreVertical, Edit, Trash2, Play, Pause, Copy } from "lucide-react";
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

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger_type: "manual",
    trigger_config: {},
    actions: [],
    conditions: [],
    status: "draft"
  });

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          name: "Lead Assignment",
          description: "Auto-assign new leads to sales reps",
          trigger_type: "event",
          status: "active",
          execution_count: 245,
          last_executed_at: "2025-01-20T10:30:00"
        },
        {
          id: "2",
          name: "Follow-up Reminder",
          description: "Send reminder for follow-up tasks",
          trigger_type: "scheduled",
          status: "active",
          execution_count: 1024,
          last_executed_at: "2025-01-20T09:00:00"
        },
        {
          id: "3",
          name: "Deal Won Notification",
          description: "Notify team when deal is won",
          trigger_type: "event",
          status: "inactive",
          execution_count: 87,
          last_executed_at: "2025-01-15T14:22:00"
        }
      ];
      setWorkflows(mockData);
    } catch (err) {
      console.error("Failed to load workflows:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedWorkflow) {
        console.log("Updating workflow:", formData);
      } else {
        console.log("Creating workflow:", formData);
      }
      await loadWorkflows();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      try {
        console.log("Deleting workflow:", id);
        await loadWorkflows();
      } catch (error) {
        console.error("Error deleting workflow:", error);
      }
    }
  };

  const handleEdit = (workflow) => {
    setSelectedWorkflow(workflow);
    setFormData(workflow);
    setShowForm(true);
  };

  const handleToggleStatus = async (workflow) => {
    try {
      const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
      console.log(`Toggling workflow ${workflow.id} to ${newStatus}`);
      await loadWorkflows();
    } catch (error) {
      console.error("Error toggling workflow:", error);
    }
  };

  const resetForm = () => {
    setSelectedWorkflow(null);
    setFormData({
      name: "",
      description: "",
      trigger_type: "manual",
      trigger_config: {},
      actions: [],
      conditions: [],
      status: "draft"
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTriggerTypeColor = (type) => {
    const colors = {
      manual: "bg-blue-100 text-blue-800",
      scheduled: "bg-purple-100 text-purple-800",
      event: "bg-orange-100 text-orange-800",
      webhook: "bg-teal-100 text-teal-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || workflow.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalExecutions = workflows.reduce((sum, w) => sum + w.execution_count, 0);
  const activeCount = workflows.filter(w => w.status === 'active').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-500 mt-1">Automate your business processes</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Zap className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Zap className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Executions</CardTitle>
            <Zap className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.length > 0 ? Math.round(totalExecutions / workflows.length) : 0}
            </div>
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
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Trigger Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Last Executed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredWorkflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No workflows found
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkflows.map((workflow) => (
                  <motion.tr
                    key={workflow.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{workflow.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{workflow.description}</TableCell>
                    <TableCell>
                      <Badge className={getTriggerTypeColor(workflow.trigger_type)}>
                        {workflow.trigger_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{workflow.execution_count}</TableCell>
                    <TableCell className="text-sm">
                      {workflow.last_executed_at ? new Date(workflow.last_executed_at).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(workflow)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(workflow)}>
                            {workflow.status === 'active' ? (
                              <><Pause className="w-4 h-4 mr-2" />Deactivate</>
                            ) : (
                              <><Play className="w-4 h-4 mr-2" />Activate</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(workflow.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedWorkflow ? "Edit Workflow" : "New Workflow"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Workflow name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this workflow do?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  </SelectContent>
                </Select>
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedWorkflow ? "Update" : "Create"} Workflow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
