import React, { useState, useEffect } from "react";
import { Plus, Search, Webhook, MoreVertical, Edit, Trash2, CheckCircle, XCircle, Play } from "lucide-react";
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

export default function WebhookConfigs() {
  const [webhooks, setWebhooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("all");

  const [formData, setFormData] = useState({
    webhook_name: "",
    description: "",
    webhook_url: "",
    method: "POST",
    module_name: "leads",
    trigger_events: [],
    is_active: true,
    retry_enabled: true,
    max_retries: 3
  });

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          webhook_name: "CRM to Slack Notification",
          webhook_url: "https://hooks.slack.com/services/XXX",
          method: "POST",
          module_name: "leads",
          trigger_events: ["create", "update"],
          is_active: true,
          execution_count: 1245,
          success_count: 1220,
          failure_count: 25,
          last_executed_at: "2025-01-20T14:30:00",
          last_status: "200 OK"
        },
        {
          id: "2",
          webhook_name: "Deal Won to Analytics",
          webhook_url: "https://api.analytics.com/webhook",
          method: "POST",
          module_name: "deals",
          trigger_events: ["status_change"],
          is_active: true,
          execution_count: 342,
          success_count: 340,
          failure_count: 2,
          last_executed_at: "2025-01-20T12:15:00",
          last_status: "200 OK"
        },
        {
          id: "3",
          webhook_name: "Test Integration",
          webhook_url: "https://test.example.com/webhook",
          method: "POST",
          module_name: "contacts",
          trigger_events: ["create"],
          is_active: false,
          execution_count: 15,
          success_count: 10,
          failure_count: 5,
          last_executed_at: "2025-01-10T09:00:00",
          last_status: "500 Error"
        }
      ];
      setWebhooks(mockData);
    } catch (err) {
      console.error("Failed to load webhooks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedWebhook) {
        console.log("Updating webhook:", formData);
      } else {
        console.log("Creating webhook:", formData);
      }
      await loadWebhooks();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving webhook:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this webhook?")) {
      try {
        console.log("Deleting webhook:", id);
        await loadWebhooks();
      } catch (error) {
        console.error("Error deleting webhook:", error);
      }
    }
  };

  const handleEdit = (webhook) => {
    setSelectedWebhook(webhook);
    setFormData(webhook);
    setShowForm(true);
  };

  const handleTest = (webhook) => {
    console.log("Testing webhook:", webhook.id);
    alert("Sending test webhook...");
  };

  const resetForm = () => {
    setSelectedWebhook(null);
    setFormData({
      webhook_name: "",
      description: "",
      webhook_url: "",
      method: "POST",
      module_name: "leads",
      trigger_events: [],
      is_active: true,
      retry_enabled: true,
      max_retries: 3
    });
  };

  const getMethodColor = (method) => {
    const colors = {
      POST: "bg-green-100 text-green-800",
      PUT: "bg-blue-100 text-blue-800",
      PATCH: "bg-yellow-100 text-yellow-800",
      GET: "bg-purple-100 text-purple-800"
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  const getSuccessRate = (webhook) => {
    if (webhook.execution_count === 0) return "0";
    return ((webhook.success_count / webhook.execution_count) * 100).toFixed(1);
  };

  const filteredWebhooks = webhooks.filter(webhook => {
    const matchesSearch = webhook.webhook_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webhook.webhook_url?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === "all" || webhook.module_name === filterModule;
    return matchesSearch && matchesModule;
  });

  const activeWebhooks = webhooks.filter(w => w.is_active).length;
  const totalExecutions = webhooks.reduce((sum, w) => sum + w.execution_count, 0);
  const totalSuccess = webhooks.reduce((sum, w) => sum + w.success_count, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-gray-500 mt-1">Configure webhook integrations</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Webhook
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Webhooks</CardTitle>
            <Webhook className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWebhooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Webhook className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExecutions > 0 ? ((totalSuccess / totalExecutions) * 100).toFixed(1) : 0}%
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
                  placeholder="Search webhooks..."
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
                <SelectItem value="orders">Orders</SelectItem>
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
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredWebhooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No webhooks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredWebhooks.map((webhook) => (
                  <motion.tr
                    key={webhook.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{webhook.webhook_name}</TableCell>
                    <TableCell className="text-sm font-mono text-gray-600 max-w-xs truncate">
                      {webhook.webhook_url}
                    </TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(webhook.method)}>
                        {webhook.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{webhook.module_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={webhook.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {webhook.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getSuccessRate(webhook)}%</span>
                        {getSuccessRate(webhook) >= 95 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant={webhook.last_status?.includes("200") ? "default" : "destructive"}>
                        {webhook.last_status || "-"}
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
                          <DropdownMenuItem onClick={() => handleEdit(webhook)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTest(webhook)}>
                            <Play className="w-4 h-4 mr-2" />
                            Test
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(webhook.id)}
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
            <DialogTitle>{selectedWebhook ? "Edit Webhook" : "New Webhook"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Webhook Name *</Label>
              <Input
                value={formData.webhook_name}
                onChange={(e) => setFormData({ ...formData, webhook_name: e.target.value })}
                placeholder="Webhook name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this webhook do?"
                rows={2}
              />
            </div>

            <div>
              <Label>Webhook URL *</Label>
              <Input
                value={formData.webhook_url}
                onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                placeholder="https://example.com/webhook"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>HTTP Method</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => setFormData({ ...formData, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="leads">Leads</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                    <SelectItem value="deals">Deals</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                    <SelectItem value="tasks">Tasks</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="tickets">Tickets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Retry Enabled</Label>
                <Switch
                  checked={formData.retry_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, retry_enabled: checked })}
                />
              </div>
            </div>

            {formData.retry_enabled && (
              <div>
                <Label>Max Retries</Label>
                <Input
                  type="number"
                  value={formData.max_retries}
                  onChange={(e) => setFormData({ ...formData, max_retries: parseInt(e.target.value) })}
                  min="1"
                  max="10"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedWebhook ? "Update" : "Create"} Webhook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
