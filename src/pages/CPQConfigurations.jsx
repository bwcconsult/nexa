import React, { useState, useEffect } from "react";
import { Plus, Search, Package, MoreVertical, Edit, Trash2, DollarSign, Layers } from "lucide-react";
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

export default function CPQConfigurations() {
  const [configurations, setConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    configuration_name: "",
    description: "",
    configuration_type: "bundle",
    base_price: 0,
    is_active: true,
    requires_approval: false
  });

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          configuration_name: "Enterprise Bundle",
          description: "Complete enterprise solution package",
          configuration_type: "bundle",
          base_price: 25000,
          is_active: true,
          usage_count: 45,
          avg_deal_size: 32500
        },
        {
          id: "2",
          configuration_name: "Tiered Pricing - Pro",
          description: "Volume-based pricing for Pro plan",
          configuration_type: "tiered_pricing",
          base_price: 99,
          is_active: true,
          usage_count: 234,
          avg_deal_size: 1485
        },
        {
          id: "3",
          configuration_name: "Custom Integration",
          description: "Configurable integration package",
          configuration_type: "configurable",
          base_price: 5000,
          is_active: false,
          usage_count: 12,
          avg_deal_size: 7800
        }
      ];
      setConfigurations(mockData);
    } catch (err) {
      console.error("Failed to load configurations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedConfig) {
        console.log("Updating configuration:", formData);
      } else {
        console.log("Creating configuration:", formData);
      }
      await loadConfigurations();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving configuration:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this configuration?")) {
      try {
        console.log("Deleting configuration:", id);
        await loadConfigurations();
      } catch (error) {
        console.error("Error deleting configuration:", error);
      }
    }
  };

  const handleEdit = (config) => {
    setSelectedConfig(config);
    setFormData(config);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedConfig(null);
    setFormData({
      configuration_name: "",
      description: "",
      configuration_type: "bundle",
      base_price: 0,
      is_active: true,
      requires_approval: false
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      bundle: "bg-purple-100 text-purple-800",
      configurable: "bg-blue-100 text-blue-800",
      tiered_pricing: "bg-green-100 text-green-800",
      volume_discount: "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const filteredConfigurations = configurations.filter(config => {
    const matchesSearch = config.configuration_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || config.configuration_type === filterType;
    return matchesSearch && matchesType;
  });

  const totalRevenue = configurations.reduce((sum, c) => sum + (c.avg_deal_size * c.usage_count), 0);
  const totalUsage = configurations.reduce((sum, c) => sum + c.usage_count, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CPQ Configurations</h1>
          <p className="text-gray-500 mt-1">Configure Price Quote management</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Configuration
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Configurations</CardTitle>
            <Package className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configurations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Layers className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Configs</CardTitle>
            <Package className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configurations.filter(c => c.is_active).length}</div>
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
                  placeholder="Search configurations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bundle">Bundle</SelectItem>
                <SelectItem value="configurable">Configurable</SelectItem>
                <SelectItem value="tiered_pricing">Tiered Pricing</SelectItem>
                <SelectItem value="volume_discount">Volume Discount</SelectItem>
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
                <TableHead>Configuration Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Avg Deal Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredConfigurations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No configurations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredConfigurations.map((config) => (
                  <motion.tr
                    key={config.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{config.configuration_name}</div>
                        <div className="text-sm text-gray-500">{config.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(config.configuration_type)}>
                        {config.configuration_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>${config.base_price.toLocaleString()}</TableCell>
                    <TableCell>{config.usage_count}</TableCell>
                    <TableCell>${config.avg_deal_size.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={config.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {config.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(config)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(config.id)}
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
            <DialogTitle>{selectedConfig ? "Edit Configuration" : "New CPQ Configuration"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Configuration Name *</Label>
              <Input
                value={formData.configuration_name}
                onChange={(e) => setFormData({ ...formData, configuration_name: e.target.value })}
                placeholder="e.g. Enterprise Bundle"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this configuration"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Configuration Type</Label>
                <Select
                  value={formData.configuration_type}
                  onValueChange={(value) => setFormData({ ...formData, configuration_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bundle">Bundle</SelectItem>
                    <SelectItem value="configurable">Configurable</SelectItem>
                    <SelectItem value="tiered_pricing">Tiered Pricing</SelectItem>
                    <SelectItem value="volume_discount">Volume Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Base Price</Label>
                <Input
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-gray-500">Enable this configuration</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Requires Approval</Label>
                <p className="text-sm text-gray-500">Needs approval before quoting</p>
              </div>
              <Switch
                checked={formData.requires_approval}
                onCheckedChange={(checked) => setFormData({ ...formData, requires_approval: checked })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedConfig ? "Update" : "Create"} Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
