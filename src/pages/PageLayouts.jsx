import React, { useState, useEffect } from "react";
import { Plus, Search, Layout, MoreVertical, Edit, Trash2, Copy, Star } from "lucide-react";
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

export default function PageLayouts() {
  const [layouts, setLayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("all");

  const [formData, setFormData] = useState({
    layout_name: "",
    description: "",
    module_name: "leads",
    is_default: false,
    is_active: true,
    layout_type: "standard",
    column_count: 2
  });

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          layout_name: "Sales Rep Lead Layout",
          description: "Simplified layout for sales reps",
          module_name: "leads",
          is_default: true,
          is_active: true,
          layout_type: "standard",
          usage_count: 234,
          assigned_roles: ["Sales Rep", "Sales Manager"]
        },
        {
          id: "2",
          layout_name: "Deal Manager Layout",
          description: "Detailed layout for deal management",
          module_name: "deals",
          is_default: false,
          is_active: true,
          layout_type: "detailed",
          usage_count: 156,
          assigned_roles: ["Sales Manager"]
        },
        {
          id: "3",
          layout_name: "Support Agent Ticket View",
          description: "Compact layout for support tickets",
          module_name: "tickets",
          is_default: true,
          is_active: false,
          layout_type: "compact",
          usage_count: 89,
          assigned_roles: ["Support Agent"]
        }
      ];
      setLayouts(mockData);
    } catch (err) {
      console.error("Failed to load layouts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedLayout) {
        console.log("Updating layout:", formData);
      } else {
        console.log("Creating layout:", formData);
      }
      await loadLayouts();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this layout?")) {
      try {
        console.log("Deleting layout:", id);
        await loadLayouts();
      } catch (error) {
        console.error("Error deleting layout:", error);
      }
    }
  };

  const handleEdit = (layout) => {
    setSelectedLayout(layout);
    setFormData(layout);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedLayout(null);
    setFormData({
      layout_name: "",
      description: "",
      module_name: "leads",
      is_default: false,
      is_active: true,
      layout_type: "standard",
      column_count: 2
    });
  };

  const getLayoutTypeColor = (type) => {
    const colors = {
      standard: "bg-blue-100 text-blue-800",
      compact: "bg-green-100 text-green-800",
      detailed: "bg-purple-100 text-purple-800",
      custom: "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const filteredLayouts = layouts.filter(layout => {
    const matchesSearch = layout.layout_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         layout.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === "all" || layout.module_name === filterModule;
    return matchesSearch && matchesModule;
  });

  const totalUsage = layouts.reduce((sum, l) => sum + l.usage_count, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Page Layouts</h1>
          <p className="text-gray-500 mt-1">Customize forms per user role</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Layout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Layouts</CardTitle>
            <Layout className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{layouts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Layout className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Default Layouts</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{layouts.filter(l => l.is_default).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Layouts</CardTitle>
            <Layout className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{layouts.filter(l => l.is_active).length}</div>
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
                  placeholder="Search layouts..."
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
                <SelectItem value="products">Products</SelectItem>
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
                <TableHead>Layout Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned Roles</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredLayouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No layouts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLayouts.map((layout) => (
                  <motion.tr
                    key={layout.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{layout.layout_name}</div>
                        <div className="text-sm text-gray-500">{layout.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{layout.module_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLayoutTypeColor(layout.layout_type)}>
                        {layout.layout_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {layout.assigned_roles?.slice(0, 2).map((role, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                        {layout.assigned_roles?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{layout.assigned_roles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{layout.usage_count}</TableCell>
                    <TableCell>
                      {layout.is_default && <Star className="w-4 h-4 text-yellow-500" />}
                    </TableCell>
                    <TableCell>
                      <Badge className={layout.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {layout.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(layout)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(layout.id)}
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
            <DialogTitle>{selectedLayout ? "Edit Layout" : "New Page Layout"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Layout Name *</Label>
              <Input
                value={formData.layout_name}
                onChange={(e) => setFormData({ ...formData, layout_name: e.target.value })}
                placeholder="e.g. Sales Rep Lead Layout"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this layout"
                rows={2}
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
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="tickets">Tickets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Layout Type</Label>
                <Select
                  value={formData.layout_type}
                  onValueChange={(value) => setFormData({ ...formData, layout_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Columns</Label>
                <Input
                  type="number"
                  value={formData.column_count}
                  onChange={(e) => setFormData({ ...formData, column_count: parseInt(e.target.value) })}
                  min="1"
                  max="4"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Default Layout</Label>
                <p className="text-sm text-gray-500">Use as default for this module</p>
              </div>
              <Switch
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-gray-500">Enable this layout</p>
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
                {selectedLayout ? "Update" : "Create"} Layout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
