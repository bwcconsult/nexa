import React, { useState, useEffect } from "react";
import { Plus, Search, CheckCircle, MoreVertical, Edit, Trash2, GitBranch, TrendingUp } from "lucide-react";
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

export default function ApprovalProcesses() {
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("all");

  const [formData, setFormData] = useState({
    process_name: "",
    description: "",
    module_name: "deals",
    is_active: true,
    approval_type: "sequential",
    email_notifications: true
  });

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          process_name: "Deal Discount Approval",
          description: "Approve discounts over 20%",
          module_name: "deals",
          approval_type: "sequential",
          is_active: true,
          execution_count: 287,
          approval_rate: 85.5,
          avg_approval_time_hours: 4.2
        },
        {
          id: "2",
          process_name: "Large Quote Approval",
          description: "Quotes above $50K need approval",
          module_name: "quotes",
          approval_type: "parallel",
          is_active: true,
          execution_count: 156,
          approval_rate: 92.3,
          avg_approval_time_hours: 2.8
        },
        {
          id: "3",
          process_name: "Expense Approval",
          description: "Expense claims over $1000",
          module_name: "expenses",
          approval_type: "sequential",
          is_active: false,
          execution_count: 423,
          approval_rate: 78.1,
          avg_approval_time_hours: 6.5
        }
      ];
      setProcesses(mockData);
    } catch (err) {
      console.error("Failed to load processes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedProcess) {
        console.log("Updating process:", formData);
      } else {
        console.log("Creating process:", formData);
      }
      await loadProcesses();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving process:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this approval process?")) {
      try {
        console.log("Deleting process:", id);
        await loadProcesses();
      } catch (error) {
        console.error("Error deleting process:", error);
      }
    }
  };

  const handleEdit = (process) => {
    setSelectedProcess(process);
    setFormData(process);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedProcess(null);
    setFormData({
      process_name: "",
      description: "",
      module_name: "deals",
      is_active: true,
      approval_type: "sequential",
      email_notifications: true
    });
  };

  const getApprovalTypeColor = (type) => {
    const colors = {
      sequential: "bg-blue-100 text-blue-800",
      parallel: "bg-purple-100 text-purple-800",
      any_one: "bg-green-100 text-green-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.process_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === "all" || process.module_name === filterModule;
    return matchesSearch && matchesModule;
  });

  const avgApprovalRate = processes.reduce((sum, p) => sum + p.approval_rate, 0) / processes.length || 0;
  const totalExecutions = processes.reduce((sum, p) => sum + p.execution_count, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Processes</h1>
          <p className="text-gray-500 mt-1">Multi-level approval workflows</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Process
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Processes</CardTitle>
            <GitBranch className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Approval Rate</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgApprovalRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Approvals</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Processes</CardTitle>
            <CheckCircle className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processes.filter(p => p.is_active).length}</div>
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
                  placeholder="Search processes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="deals">Deals</SelectItem>
                <SelectItem value="quotes">Quotes</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="invoices">Invoices</SelectItem>
                <SelectItem value="expenses">Expenses</SelectItem>
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
                <TableHead>Process Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Approval Rate</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredProcesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No approval processes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProcesses.map((process) => (
                  <motion.tr
                    key={process.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{process.process_name}</div>
                        <div className="text-sm text-gray-500">{process.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{process.module_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getApprovalTypeColor(process.approval_type)}>
                        {process.approval_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{process.execution_count}</TableCell>
                    <TableCell>{process.approval_rate.toFixed(1)}%</TableCell>
                    <TableCell>{process.avg_approval_time_hours.toFixed(1)}h</TableCell>
                    <TableCell>
                      <Badge className={process.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {process.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(process)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(process.id)}
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
            <DialogTitle>{selectedProcess ? "Edit Process" : "New Approval Process"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Process Name *</Label>
              <Input
                value={formData.process_name}
                onChange={(e) => setFormData({ ...formData, process_name: e.target.value })}
                placeholder="e.g. Deal Discount Approval"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What requires approval?"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Module</Label>
                <Select
                  value={formData.module_name}
                  onValueChange={(value) => setFormData({ ...formData, module_name: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deals">Deals</SelectItem>
                    <SelectItem value="quotes">Quotes</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="invoices">Invoices</SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                    <SelectItem value="discounts">Discounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Approval Type</Label>
                <Select
                  value={formData.approval_type}
                  onValueChange={(value) => setFormData({ ...formData, approval_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                    <SelectItem value="any_one">Any One</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-gray-500">Enable this approval process</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Notify approvers via email</p>
              </div>
              <Switch
                checked={formData.email_notifications}
                onCheckedChange={(checked) => setFormData({ ...formData, email_notifications: checked })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedProcess ? "Update" : "Create"} Process
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
