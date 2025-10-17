import React, { useState, useEffect } from "react";
import { Plus, Search, Map, MoreVertical, Edit, Trash2, Users, TrendingUp, DollarSign } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Territories() {
  const [territories, setTerritories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    territory_name: "",
    territory_code: "",
    description: "",
    territory_type: "geographic",
    is_active: true,
    priority: "Medium",
    revenue_target: 0,
    color_code: "#3B82F6"
  });

  useEffect(() => {
    loadTerritories();
  }, []);

  const loadTerritories = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          territory_code: "NA-WEST",
          territory_name: "North America West",
          territory_type: "geographic",
          is_active: true,
          priority: "High",
          revenue_target: 5000000,
          revenue_achieved: 3750000,
          accounts_count: 145,
          leads_count: 523,
          deals_count: 89,
          color_code: "#3B82F6"
        },
        {
          id: "2",
          territory_code: "NA-EAST",
          territory_name: "North America East",
          territory_type: "geographic",
          is_active: true,
          priority: "High",
          revenue_target: 4500000,
          revenue_achieved: 4200000,
          accounts_count: 198,
          leads_count: 687,
          deals_count: 112,
          color_code: "#10B981"
        },
        {
          id: "3",
          territory_code: "TECH-ENT",
          territory_name: "Technology Enterprise",
          territory_type: "industry",
          is_active: true,
          priority: "Critical",
          revenue_target: 8000000,
          revenue_achieved: 5600000,
          accounts_count: 67,
          leads_count: 234,
          deals_count: 45,
          color_code: "#8B5CF6"
        },
        {
          id: "4",
          territory_code: "SMB-ALL",
          territory_name: "Small Business",
          territory_type: "account_size",
          is_active: false,
          priority: "Medium",
          revenue_target: 2000000,
          revenue_achieved: 1250000,
          accounts_count: 342,
          leads_count: 1245,
          deals_count: 156,
          color_code: "#F59E0B"
        }
      ];
      setTerritories(mockData);
    } catch (err) {
      console.error("Failed to load territories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedTerritory) {
        console.log("Updating territory:", formData);
      } else {
        console.log("Creating territory:", formData);
      }
      await loadTerritories();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving territory:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this territory?")) {
      try {
        console.log("Deleting territory:", id);
        await loadTerritories();
      } catch (error) {
        console.error("Error deleting territory:", error);
      }
    }
  };

  const handleEdit = (territory) => {
    setSelectedTerritory(territory);
    setFormData(territory);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedTerritory(null);
    setFormData({
      territory_name: "",
      territory_code: "",
      description: "",
      territory_type: "geographic",
      is_active: true,
      priority: "Medium",
      revenue_target: 0,
      color_code: "#3B82F6"
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      geographic: "bg-blue-100 text-blue-800",
      industry: "bg-purple-100 text-purple-800",
      account_size: "bg-green-100 text-green-800",
      product: "bg-orange-100 text-orange-800",
      custom: "bg-gray-100 text-gray-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "bg-gray-100 text-gray-800",
      Medium: "bg-blue-100 text-blue-800",
      High: "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const calculateProgress = (territory) => {
    if (territory.revenue_target === 0) return 0;
    return Math.min(100, (territory.revenue_achieved / territory.revenue_target) * 100);
  };

  const filteredTerritories = territories.filter(territory => {
    const matchesSearch = territory.territory_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         territory.territory_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || territory.territory_type === filterType;
    return matchesSearch && matchesType;
  });

  const totalRevenue = territories.reduce((sum, t) => sum + t.revenue_achieved, 0);
  const totalTarget = territories.reduce((sum, t) => sum + t.revenue_target, 0);
  const totalAccounts = territories.reduce((sum, t) => sum + t.accounts_count, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Territory Management</h1>
          <p className="text-gray-500 mt-1">Organize sales territories and assignments</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Territory
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Territories</CardTitle>
            <Map className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{territories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(1)}M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Target</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalTarget / 1000000).toFixed(1)}M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
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
                  placeholder="Search territories..."
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
                <SelectItem value="geographic">Geographic</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
                <SelectItem value="account_size">Account Size</SelectItem>
                <SelectItem value="product">Product</SelectItem>
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
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Revenue Progress</TableHead>
                <TableHead>Accounts</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTerritories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No territories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTerritories.map((territory) => (
                  <motion.tr
                    key={territory.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: territory.color_code }}
                        />
                        <span className="font-mono font-medium">{territory.territory_code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{territory.territory_name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(territory.territory_type)}>
                        {territory.territory_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(territory.priority)}>
                        {territory.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[200px]">
                        <div className="flex items-center justify-between text-sm">
                          <span>${(territory.revenue_achieved / 1000000).toFixed(2)}M</span>
                          <span className="text-gray-500">/ ${(territory.revenue_target / 1000000).toFixed(1)}M</span>
                        </div>
                        <Progress value={calculateProgress(territory)} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{territory.accounts_count}</TableCell>
                    <TableCell>{territory.leads_count}</TableCell>
                    <TableCell>
                      <Badge className={territory.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {territory.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(territory)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            Assign Users
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Map className="w-4 h-4 mr-2" />
                            View Map
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(territory.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTerritory ? "Edit Territory" : "New Territory"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Territory Name *</Label>
                <Input
                  value={formData.territory_name}
                  onChange={(e) => setFormData({ ...formData, territory_name: e.target.value })}
                  placeholder="Territory name"
                />
              </div>
              <div>
                <Label>Territory Code *</Label>
                <Input
                  value={formData.territory_code}
                  onChange={(e) => setFormData({ ...formData, territory_code: e.target.value })}
                  placeholder="e.g. NA-WEST"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Territory description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Territory Type</Label>
                <Select
                  value={formData.territory_type}
                  onValueChange={(value) => setFormData({ ...formData, territory_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geographic">Geographic</SelectItem>
                    <SelectItem value="industry">Industry</SelectItem>
                    <SelectItem value="account_size">Account Size</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Revenue Target</Label>
                <Input
                  type="number"
                  value={formData.revenue_target}
                  onChange={(e) => setFormData({ ...formData, revenue_target: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Color Code</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color_code}
                    onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={formData.color_code}
                    onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
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
                {selectedTerritory ? "Update" : "Create"} Territory
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
