import React, { useState, useEffect } from "react";
import { Plus, Search, Globe, MoreVertical, Edit, Trash2, ExternalLink, Users } from "lucide-react";
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

export default function ClientPortals() {
  const [portals, setPortals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    portal_name: "",
    subdomain: "",
    is_active: true,
    enable_file_upload: true,
    enable_messaging: true,
    enable_ticket_creation: true
  });

  useEffect(() => {
    loadPortals();
  }, []);

  const loadPortals = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          portal_name: "Acme Corp Portal",
          subdomain: "acmecorp",
          is_active: true,
          active_users: 23,
          total_logins: 1247,
          last_accessed_at: "2025-01-20T14:30:00"
        },
        {
          id: "2",
          portal_name: "Tech Solutions Access",
          subdomain: "techsolutions",
          is_active: true,
          active_users: 45,
          total_logins: 3421,
          last_accessed_at: "2025-01-20T16:15:00"
        },
        {
          id: "3",
          portal_name: "Beta Partners",
          subdomain: "betapartners",
          is_active: false,
          active_users: 8,
          total_logins: 234,
          last_accessed_at: "2025-01-10T09:22:00"
        }
      ];
      setPortals(mockData);
    } catch (err) {
      console.error("Failed to load portals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedPortal) {
        console.log("Updating portal:", formData);
      } else {
        console.log("Creating portal:", formData);
      }
      await loadPortals();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving portal:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this portal?")) {
      try {
        console.log("Deleting portal:", id);
        await loadPortals();
      } catch (error) {
        console.error("Error deleting portal:", error);
      }
    }
  };

  const handleEdit = (portal) => {
    setSelectedPortal(portal);
    setFormData(portal);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedPortal(null);
    setFormData({
      portal_name: "",
      subdomain: "",
      is_active: true,
      enable_file_upload: true,
      enable_messaging: true,
      enable_ticket_creation: true
    });
  };

  const filteredPortals = portals.filter(portal => {
    const matchesSearch = portal.portal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         portal.subdomain?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalUsers = portals.reduce((sum, p) => sum + p.active_users, 0);
  const totalLogins = portals.reduce((sum, p) => sum + p.total_logins, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Portals</h1>
          <p className="text-gray-500 mt-1">Customer self-service portals</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Portal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Portals</CardTitle>
            <Globe className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Globe className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Portals</CardTitle>
            <Globe className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portals.filter(p => p.is_active).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search portals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Portal Name</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Active Users</TableHead>
                <TableHead>Total Logins</TableHead>
                <TableHead>Last Accessed</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredPortals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No portals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPortals.map((portal) => (
                  <motion.tr
                    key={portal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{portal.portal_name}</TableCell>
                    <TableCell className="font-mono text-sm">{portal.subdomain}.portal.yourcrm.com</TableCell>
                    <TableCell>{portal.active_users}</TableCell>
                    <TableCell>{portal.total_logins}</TableCell>
                    <TableCell className="text-sm">
                      {portal.last_accessed_at ? new Date(portal.last_accessed_at).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={portal.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {portal.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(portal)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Portal
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(portal.id)}
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
            <DialogTitle>{selectedPortal ? "Edit Portal" : "New Client Portal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Portal Name *</Label>
              <Input
                value={formData.portal_name}
                onChange={(e) => setFormData({ ...formData, portal_name: e.target.value })}
                placeholder="e.g. Acme Corp Portal"
              />
            </div>

            <div>
              <Label>Subdomain *</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  placeholder="acmecorp"
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">.portal.yourcrm.com</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-sm text-gray-500">Enable this portal</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>File Upload</Label>
                  <p className="text-sm text-gray-500">Allow clients to upload files</p>
                </div>
                <Switch
                  checked={formData.enable_file_upload}
                  onCheckedChange={(checked) => setFormData({ ...formData, enable_file_upload: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Messaging</Label>
                  <p className="text-sm text-gray-500">Enable client messaging</p>
                </div>
                <Switch
                  checked={formData.enable_messaging}
                  onCheckedChange={(checked) => setFormData({ ...formData, enable_messaging: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Ticket Creation</Label>
                  <p className="text-sm text-gray-500">Allow clients to create tickets</p>
                </div>
                <Switch
                  checked={formData.enable_ticket_creation}
                  onCheckedChange={(checked) => setFormData({ ...formData, enable_ticket_creation: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedPortal ? "Update" : "Create"} Portal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
