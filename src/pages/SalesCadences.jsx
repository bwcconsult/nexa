import React, { useState, useEffect } from "react";
import { Plus, Search, Calendar, MoreVertical, Edit, Trash2, Play, Users, TrendingUp } from "lucide-react";
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

export default function SalesCadences() {
  const [cadences, setCadences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCadence, setSelectedCadence] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTarget, setFilterTarget] = useState("all");

  const [formData, setFormData] = useState({
    cadence_name: "",
    description: "",
    target_module: "leads",
    is_active: true,
    total_duration_days: 14,
    skip_weekends: true
  });

  useEffect(() => {
    loadCadences();
  }, []);

  const loadCadences = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          cadence_name: "New Lead Follow-up",
          description: "7-day follow-up sequence for new leads",
          target_module: "leads",
          is_active: true,
          total_duration_days: 7,
          enrolled_count: 342,
          completed_count: 287,
          success_count: 98,
          success_rate: 34.1
        },
        {
          id: "2",
          cadence_name: "Cold Outreach",
          description: "14-day cold outreach cadence",
          target_module: "leads",
          is_active: true,
          total_duration_days: 14,
          enrolled_count: 521,
          completed_count: 456,
          success_count: 67,
          success_rate: 14.7
        },
        {
          id: "3",
          cadence_name: "Warm Re-engagement",
          description: "Re-engage inactive contacts",
          target_module: "contacts",
          is_active: false,
          total_duration_days: 10,
          enrolled_count: 189,
          completed_count: 178,
          success_count: 42,
          success_rate: 23.6
        }
      ];
      setCadences(mockData);
    } catch (err) {
      console.error("Failed to load cadences:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedCadence) {
        console.log("Updating cadence:", formData);
      } else {
        console.log("Creating cadence:", formData);
      }
      await loadCadences();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving cadence:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cadence?")) {
      try {
        console.log("Deleting cadence:", id);
        await loadCadences();
      } catch (error) {
        console.error("Error deleting cadence:", error);
      }
    }
  };

  const handleEdit = (cadence) => {
    setSelectedCadence(cadence);
    setFormData(cadence);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedCadence(null);
    setFormData({
      cadence_name: "",
      description: "",
      target_module: "leads",
      is_active: true,
      total_duration_days: 14,
      skip_weekends: true
    });
  };

  const getCompletionRate = (cadence) => {
    if (cadence.enrolled_count === 0) return 0;
    return (cadence.completed_count / cadence.enrolled_count) * 100;
  };

  const filteredCadences = cadences.filter(cadence => {
    const matchesSearch = cadence.cadence_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cadence.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTarget = filterTarget === "all" || cadence.target_module === filterTarget;
    return matchesSearch && matchesTarget;
  });

  const totalEnrolled = cadences.reduce((sum, c) => sum + c.enrolled_count, 0);
  const totalSuccess = cadences.reduce((sum, c) => sum + c.success_count, 0);
  const avgSuccessRate = cadences.reduce((sum, c) => sum + c.success_rate, 0) / cadences.length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Cadences</h1>
          <p className="text-gray-500 mt-1">Automated follow-up sequences</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Cadence
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cadences</CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cadences.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrolled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuccess}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
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
                  placeholder="Search cadences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterTarget} onValueChange={setFilterTarget}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Targets</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
                <SelectItem value="deals">Deals</SelectItem>
                <SelectItem value="accounts">Accounts</SelectItem>
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
                <TableHead>Cadence Name</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Success Rate</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCadences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No cadences found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCadences.map((cadence) => (
                  <motion.tr
                    key={cadence.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{cadence.cadence_name}</div>
                        <div className="text-sm text-gray-500">{cadence.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cadence.target_module}</Badge>
                    </TableCell>
                    <TableCell>{cadence.total_duration_days} days</TableCell>
                    <TableCell>{cadence.enrolled_count}</TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex items-center justify-between text-sm">
                          <span>{getCompletionRate(cadence).toFixed(0)}%</span>
                        </div>
                        <Progress value={getCompletionRate(cadence)} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{cadence.success_rate.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge className={cadence.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {cadence.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(cadence)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            View Steps
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(cadence.id)}
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
            <DialogTitle>{selectedCadence ? "Edit Cadence" : "New Sales Cadence"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Cadence Name *</Label>
              <Input
                value={formData.cadence_name}
                onChange={(e) => setFormData({ ...formData, cadence_name: e.target.value })}
                placeholder="e.g. New Lead Follow-up"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this cadence"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Target Module</Label>
                <Select
                  value={formData.target_module}
                  onValueChange={(value) => setFormData({ ...formData, target_module: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leads">Leads</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                    <SelectItem value="deals">Deals</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (Days)</Label>
                <Input
                  type="number"
                  value={formData.total_duration_days}
                  onChange={(e) => setFormData({ ...formData, total_duration_days: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-gray-500">Enable this cadence</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Skip Weekends</Label>
                <p className="text-sm text-gray-500">Don't schedule tasks on weekends</p>
              </div>
              <Switch
                checked={formData.skip_weekends}
                onCheckedChange={(checked) => setFormData({ ...formData, skip_weekends: checked })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedCadence ? "Update" : "Create"} Cadence
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
