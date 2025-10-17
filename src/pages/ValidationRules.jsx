import React, { useState, useEffect } from "react";
import { Plus, Search, Shield, MoreVertical, Edit, Trash2, CheckCircle } from "lucide-react";
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

export default function ValidationRules() {
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
    trigger_on: "both",
    field_name: "",
    validation_type: "required",
    error_message: "Validation failed"
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
          rule_name: "Email Required",
          description: "Email must be provided for all leads",
          module_name: "leads",
          field_name: "email",
          validation_type: "required",
          trigger_on: "both",
          is_active: true,
          execution_count: 2456,
          failure_count: 142
        },
        {
          id: "2",
          rule_name: "Valid Phone Format",
          description: "Phone number must be valid format",
          module_name: "contacts",
          field_name: "phone",
          validation_type: "phone",
          trigger_on: "both",
          is_active: true,
          execution_count: 1823,
          failure_count: 89
        },
        {
          id: "3",
          rule_name: "Deal Amount Minimum",
          description: "Deal amount must be at least $1000",
          module_name: "deals",
          field_name: "amount",
          validation_type: "range",
          trigger_on: "both",
          is_active: false,
          execution_count: 567,
          failure_count: 23
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
      trigger_on: "both",
      field_name: "",
      validation_type: "required",
      error_message: "Validation failed"
    });
  };

  const getValidationTypeColor = (type) => {
    const colors = {
      required: "bg-red-100 text-red-800",
      unique: "bg-purple-100 text-purple-800",
      email: "bg-blue-100 text-blue-800",
      phone: "bg-green-100 text-green-800",
      url: "bg-teal-100 text-teal-800",
      number: "bg-orange-100 text-orange-800",
      date: "bg-pink-100 text-pink-800",
      regex: "bg-indigo-100 text-indigo-800",
      custom: "bg-yellow-100 text-yellow-800",
      range: "bg-cyan-100 text-cyan-800",
      length: "bg-lime-100 text-lime-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.rule_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.field_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === "all" || rule.module_name === filterModule;
    return matchesSearch && matchesModule;
  });

  const activeRules = rules.filter(r => r.is_active).length;
  const totalExecutions = rules.reduce((sum, r) => sum + r.execution_count, 0);
  const totalFailures = rules.reduce((sum, r) => sum + r.failure_count, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Validation Rules</h1>
          <p className="text-gray-500 mt-1">Enforce data quality standards</p>
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
            <Shield className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
            <Shield className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failures</CardTitle>
            <Shield className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFailures}</div>
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
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
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
                <TableHead>Field</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Checked</TableHead>
                <TableHead>Failures</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
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
                    <TableCell className="font-mono text-sm">{rule.field_name}</TableCell>
                    <TableCell>
                      <Badge className={getValidationTypeColor(rule.validation_type)}>
                        {rule.validation_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.trigger_on}</TableCell>
                    <TableCell>
                      <Badge className={rule.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {rule.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.execution_count}</TableCell>
                    <TableCell>{rule.failure_count}</TableCell>
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
                placeholder="What does this rule validate?"
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
                    <SelectItem value="leads">Leads</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                    <SelectItem value="deals">Deals</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="quotes">Quotes</SelectItem>
                    <SelectItem value="tasks">Tasks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Field Name *</Label>
                <Input
                  value={formData.field_name}
                  onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                  placeholder="e.g. email, phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Validation Type</Label>
                <Select
                  value={formData.validation_type}
                  onValueChange={(value) => setFormData({ ...formData, validation_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="required">Required</SelectItem>
                    <SelectItem value="unique">Unique</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="regex">Regex</SelectItem>
                    <SelectItem value="range">Range</SelectItem>
                    <SelectItem value="length">Length</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Trigger On</Label>
                <Select
                  value={formData.trigger_on}
                  onValueChange={(value) => setFormData({ ...formData, trigger_on: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">Create Only</SelectItem>
                    <SelectItem value="update">Update Only</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Error Message</Label>
              <Input
                value={formData.error_message}
                onChange={(e) => setFormData({ ...formData, error_message: e.target.value })}
                placeholder="Message shown when validation fails"
              />
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
