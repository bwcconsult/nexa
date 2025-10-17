import React, { useState, useEffect } from "react";
import { Plus, Search, Workflow, MoreVertical, Edit, Trash2, GitBranch, CheckCircle } from "lucide-react";
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

export default function Blueprints() {
  const [blueprints, setBlueprints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("all");

  const [formData, setFormData] = useState({
    blueprint_name: "",
    description: "",
    module_name: "deals",
    is_active: true
  });

  useEffect(() => {
    loadBlueprints();
  }, []);

  const loadBlueprints = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          blueprint_name: "Deal Closure Process",
          description: "Standard deal closure workflow",
          module_name: "deals",
          is_active: true,
          execution_count: 543,
          success_rate: 87.3,
          avg_completion_days: 12.5,
          stages: ["Qualification", "Proposal", "Negotiation", "Closed Won"]
        },
        {
          id: "2",
          blueprint_name: "Lead Nurturing",
          description: "Lead qualification and nurturing process",
          module_name: "leads",
          is_active: true,
          execution_count: 1245,
          success_rate: 45.2,
          avg_completion_days: 8.3,
          stages: ["New", "Contacted", "Qualified", "Converted"]
        },
        {
          id: "3",
          blueprint_name: "Support Ticket Resolution",
          description: "Ticket handling and resolution workflow",
          module_name: "tickets",
          is_active: false,
          execution_count: 2341,
          success_rate: 92.1,
          avg_completion_days: 2.1,
          stages: ["Open", "In Progress", "Pending Customer", "Resolved"]
        }
      ];
      setBlueprints(mockData);
    } catch (err) {
      console.error("Failed to load blueprints:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedBlueprint) {
        console.log("Updating blueprint:", formData);
      } else {
        console.log("Creating blueprint:", formData);
      }
      await loadBlueprints();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving blueprint:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blueprint?")) {
      try {
        console.log("Deleting blueprint:", id);
        await loadBlueprints();
      } catch (error) {
        console.error("Error deleting blueprint:", error);
      }
    }
  };

  const handleEdit = (blueprint) => {
    setSelectedBlueprint(blueprint);
    setFormData(blueprint);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedBlueprint(null);
    setFormData({
      blueprint_name: "",
      description: "",
      module_name: "deals",
      is_active: true
    });
  };

  const filteredBlueprints = blueprints.filter(blueprint => {
    const matchesSearch = blueprint.blueprint_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blueprint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === "all" || blueprint.module_name === filterModule;
    return matchesSearch && matchesModule;
  });

  const avgSuccessRate = blueprints.reduce((sum, b) => sum + b.success_rate, 0) / blueprints.length || 0;
  const totalExecutions = blueprints.reduce((sum, b) => sum + b.execution_count, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blueprints</h1>
          <p className="text-gray-500 mt-1">Visual process builders</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Blueprint
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Blueprints</CardTitle>
            <Workflow className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blueprints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <GitBranch className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Blueprints</CardTitle>
            <Workflow className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blueprints.filter(b => b.is_active).length}</div>
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
                  placeholder="Search blueprints..."
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
                <SelectItem value="deals">Deals</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
                <SelectItem value="accounts">Accounts</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
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
                <TableHead>Blueprint Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Stages</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredBlueprints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No blueprints found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlueprints.map((blueprint) => (
                  <motion.tr
                    key={blueprint.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{blueprint.blueprint_name}</div>
                        <div className="text-sm text-gray-500">{blueprint.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{blueprint.module_name}</Badge>
                    </TableCell>
                    <TableCell>{blueprint.stages?.length || 0}</TableCell>
                    <TableCell>{blueprint.execution_count}</TableCell>
                    <TableCell>{blueprint.success_rate.toFixed(1)}%</TableCell>
                    <TableCell>{blueprint.avg_completion_days.toFixed(1)} days</TableCell>
                    <TableCell>
                      <Badge className={blueprint.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {blueprint.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(blueprint)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Workflow className="w-4 h-4 mr-2" />
                            Design
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(blueprint.id)}
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
            <DialogTitle>{selectedBlueprint ? "Edit Blueprint" : "New Blueprint"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Blueprint Name *</Label>
              <Input
                value={formData.blueprint_name}
                onChange={(e) => setFormData({ ...formData, blueprint_name: e.target.value })}
                placeholder="e.g. Deal Closure Process"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this blueprint"
                rows={2}
              />
            </div>

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
                  <SelectItem value="deals">Deals</SelectItem>
                  <SelectItem value="contacts">Contacts</SelectItem>
                  <SelectItem value="accounts">Accounts</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="tickets">Tickets</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-gray-500">Enable this blueprint</p>
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
                {selectedBlueprint ? "Update" : "Create"} Blueprint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
