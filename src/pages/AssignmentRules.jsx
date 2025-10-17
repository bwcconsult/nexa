import React, { useState, useEffect } from "react";
import { Plus, Search, Users, MoreVertical, Edit, Trash2, Target } from "lucide-react";
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

export default function AssignmentRules() {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("all");

  const [formData, setFormData] = useState({
    rule_name: "",
    description: "",
    module_name: "leads",
    is_active: true,
    priority: 1,
    assignment_type: "specific_user",
    conditions: []
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          rule_name: "Enterprise Leads Assignment",
          description: "Assign leads with revenue > $100K to senior reps",
          module_name: "leads",
          assignment_type: "specific_user",
          is_active: true,
          priority: 1,
          execution_count: 352
        },
        {
          id: "2",
          rule_name: "Round Robin Leads",
          description: "Distribute leads evenly among sales team",
          module_name: "leads",
          assignment_type: "round_robin",
          is_active: true,
          priority: 2,
          execution_count: 1248
        },
        {
          id: "3",
          rule_name: "Territory-Based Assignment",
          description: "Assign based on geographic territory",
          module_name: "accounts",
          assignment_type: "territory",
          is_active: false,
          priority: 1,
          execution_count: 87
        }
      ];
      setRules(mockData);
    } catch (err) {
      console.error("Failed to load rules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedRule) {
        console.log("Updating rule:", formData);
      } else {
        console.log("Creating rule:", formData);
      }
      await loadRules();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving rule:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        console.log("Deleting rule:", id);
        await loadRules();
      } catch (error) {
        console.error("Error deleting rule:", error);
      }
    }
  };

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setFormData(rule);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedRule(null);
    setFormData({
      rule_name: "",
      description: "",
      module_name: "leads",
      is_active: true,
      priority: 1,
      assignment_type: "specific_user",
      conditions: []
    });
  };

  const getAssignmentTypeColor = (type) => {
    const colors = {
      round_robin: "bg-blue-100 text-blue-800",
      load_balancing: "bg-purple-100 text-purple-800",
      territory: "bg-green-100 text-green-800",
      specific_user: "bg-orange-100 text-orange-800",
      team: "bg-teal-100 text-teal-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.rule_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === "all" || rule.module_name === filterModule;
    return matchesSearch && matchesModule;
  });

  const activeRules = rules.filter(r => r.is_active).length;
  const totalExecutions = rules.reduce((sum, r) => sum + r.execution_count, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignment Rules</h1>
          <p className="text-gray-500 mt-1">Automate record assignment to users</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Target className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Users className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Target className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Executions</CardTitle>
            <Target className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.length > 0 ? Math.round(totalExecutions / rules.length) : 0}
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
                  placeholder="Search rules..."
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
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
                <SelectItem value="deals">Deals</SelectItem>
                <SelectItem value="accounts">Accounts</SelectItem>
                <SelectItem value="tasks">Tasks</SelectItem>
                <SelectItem value="tickets">Tickets</SelectItem>
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
                <TableHead>Rule Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Assignment Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No rules found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRules.map((rule) => (
                  <motion.tr
                    key={rule.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.rule_name}</div>
                        <div className="text-sm text-gray-500">{rule.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.module_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAssignmentTypeColor(rule.assignment_type)}>
                        {rule.assignment_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell>
                      <Badge className={rule.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {rule.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.execution_count}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(rule)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(rule.id)}
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
            <DialogTitle>{selectedRule ? "Edit Rule" : "New Rule"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rule Name *</Label>
              <Input
                value={formData.rule_name}
                onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                placeholder="Rule name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this rule do?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                    <SelectItem value="leads">Leads</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                    <SelectItem value="deals">Deals</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                    <SelectItem value="tasks">Tasks</SelectItem>
                    <SelectItem value="tickets">Tickets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assignment Type</Label>
                <Select
                  value={formData.assignment_type}
                  onValueChange={(value) => setFormData({ ...formData, assignment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="specific_user">Specific User</SelectItem>
                    <SelectItem value="round_robin">Round Robin</SelectItem>
                    <SelectItem value="load_balancing">Load Balancing</SelectItem>
                    <SelectItem value="territory">Territory</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Active</Label>
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
                {selectedRule ? "Update" : "Create"} Rule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
