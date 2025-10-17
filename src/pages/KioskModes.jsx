import React, { useState, useEffect } from "react";
import { Plus, Search, Tablet, MoreVertical, Edit, Trash2, QrCode, Camera } from "lucide-react";
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

export default function KioskModes() {
  const [kiosks, setKiosks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedKiosk, setSelectedKiosk] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTarget, setFilterTarget] = useState("all");

  const [formData, setFormData] = useState({
    kiosk_name: "",
    description: "",
    target_module: "leads",
    is_active: true,
    enable_photo_capture: false,
    enable_qr_scan: false,
    offline_mode: true
  });

  useEffect(() => {
    loadKiosks();
  }, []);

  const loadKiosks = async () => {
    setIsLoading(true);
    try {
      const mockData = [
        {
          id: "1",
          kiosk_name: "Trade Show Booth 1",
          description: "Lead capture at Tech Expo 2025",
          target_module: "leads",
          is_active: true,
          capture_count: 234,
          event_name: "Tech Expo 2025",
          booth_number: "B-42",
          last_capture_at: "2025-01-20T14:30:00"
        },
        {
          id: "2",
          kiosk_name: "Conference Check-in",
          description: "Visitor registration kiosk",
          target_module: "visitors",
          is_active: true,
          capture_count: 567,
          event_name: "Sales Summit 2025",
          booth_number: "Main Entrance",
          last_capture_at: "2025-01-20T16:45:00"
        },
        {
          id: "3",
          kiosk_name: "Product Demo Station",
          description: "Demo interest capture",
          target_module: "leads",
          is_active: false,
          capture_count: 89,
          event_name: "CRM World",
          booth_number: "A-15",
          last_capture_at: "2025-01-10T11:22:00"
        }
      ];
      setKiosks(mockData);
    } catch (err) {
      console.error("Failed to load kiosks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedKiosk) {
        console.log("Updating kiosk:", formData);
      } else {
        console.log("Creating kiosk:", formData);
      }
      await loadKiosks();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving kiosk:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this kiosk?")) {
      try {
        console.log("Deleting kiosk:", id);
        await loadKiosks();
      } catch (error) {
        console.error("Error deleting kiosk:", error);
      }
    }
  };

  const handleEdit = (kiosk) => {
    setSelectedKiosk(kiosk);
    setFormData(kiosk);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedKiosk(null);
    setFormData({
      kiosk_name: "",
      description: "",
      target_module: "leads",
      is_active: true,
      enable_photo_capture: false,
      enable_qr_scan: false,
      offline_mode: true
    });
  };

  const filteredKiosks = kiosks.filter(kiosk => {
    const matchesSearch = kiosk.kiosk_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kiosk.event_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTarget = filterTarget === "all" || kiosk.target_module === filterTarget;
    return matchesSearch && matchesTarget;
  });

  const totalCaptures = kiosks.reduce((sum, k) => sum + k.capture_count, 0);
  const activeKiosks = kiosks.filter(k => k.is_active).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kiosk Mode</h1>
          <p className="text-gray-500 mt-1">Event and trade show data capture</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Kiosk
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Kiosks</CardTitle>
            <Tablet className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kiosks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Kiosks</CardTitle>
            <Tablet className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeKiosks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Captures</CardTitle>
            <Camera className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCaptures}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg per Kiosk</CardTitle>
            <Camera className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kiosks.length > 0 ? Math.round(totalCaptures / kiosks.length) : 0}
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
                  placeholder="Search kiosks..."
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
                <SelectItem value="visitors">Visitors</SelectItem>
                <SelectItem value="registrations">Registrations</SelectItem>
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
                <TableHead>Kiosk Name</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Booth</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Captures</TableHead>
                <TableHead>Last Capture</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredKiosks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No kiosks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredKiosks.map((kiosk) => (
                  <motion.tr
                    key={kiosk.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{kiosk.kiosk_name}</div>
                        <div className="text-sm text-gray-500">{kiosk.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{kiosk.event_name}</TableCell>
                    <TableCell>{kiosk.booth_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{kiosk.target_module}</Badge>
                    </TableCell>
                    <TableCell>{kiosk.capture_count}</TableCell>
                    <TableCell className="text-sm">
                      {kiosk.last_capture_at ? new Date(kiosk.last_capture_at).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={kiosk.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {kiosk.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => handleEdit(kiosk)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <QrCode className="w-4 h-4 mr-2" />
                            View QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(kiosk.id)}
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
            <DialogTitle>{selectedKiosk ? "Edit Kiosk" : "New Kiosk Mode"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Kiosk Name *</Label>
              <Input
                value={formData.kiosk_name}
                onChange={(e) => setFormData({ ...formData, kiosk_name: e.target.value })}
                placeholder="e.g. Trade Show Booth 1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this kiosk"
                rows={2}
              />
            </div>

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
                  <SelectItem value="visitors">Visitors</SelectItem>
                  <SelectItem value="registrations">Registrations</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-sm text-gray-500">Enable this kiosk</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Photo Capture</Label>
                  <p className="text-sm text-gray-500">Enable camera for photos</p>
                </div>
                <Switch
                  checked={formData.enable_photo_capture}
                  onCheckedChange={(checked) => setFormData({ ...formData, enable_photo_capture: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>QR Code Scanning</Label>
                  <p className="text-sm text-gray-500">Enable QR code scanner</p>
                </div>
                <Switch
                  checked={formData.enable_qr_scan}
                  onCheckedChange={(checked) => setFormData({ ...formData, enable_qr_scan: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Offline Mode</Label>
                  <p className="text-sm text-gray-500">Allow offline data capture</p>
                </div>
                <Switch
                  checked={formData.offline_mode}
                  onCheckedChange={(checked) => setFormData({ ...formData, offline_mode: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedKiosk ? "Update" : "Create"} Kiosk
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
