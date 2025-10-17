import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

export default function ImportExport() {
  const [importJobs, setImportJobs] = useState([]);
  const [exportJobs, setExportJobs] = useState([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Import form state
  const [importForm, setImportForm] = useState({
    entity_type: 'contacts',
    skip_duplicates: true,
    update_existing: false
  });
  
  // Export form state
  const [exportForm, setExportForm] = useState({
    entity_type: 'contacts',
    export_format: 'csv',
    filters: {}
  });

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const [importsRes, exportsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/import`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/export`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      const imports = await importsRes.json();
      const exports = await exportsRes.json();
      
      setImportJobs(Array.isArray(imports) ? imports : []);
      setExportJobs(Array.isArray(exports) ? exports : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Please drop a CSV file');
    }
  };

  const startImport = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('entity_type', importForm.entity_type);
    formData.append('import_options', JSON.stringify({
      skip_duplicates: importForm.skip_duplicates,
      update_existing: importForm.update_existing
    }));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (response.ok) {
        setIsImportDialogOpen(false);
        setSelectedFile(null);
        fetchJobs();
      }
    } catch (error) {
      console.error('Error starting import:', error);
    }
  };

  const startExport = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(exportForm)
      });
      
      if (response.ok) {
        setIsExportDialogOpen(false);
        fetchJobs();
      }
    } catch (error) {
      console.error('Error starting export:', error);
    }
  };

  const downloadExport = async (jobId, fileName) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/export/${jobId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading export:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Import & Export</h1>
          <p className="text-muted-foreground mt-1">
            Bulk upload and download your CRM data
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to import data into Nexa CRM
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Data Type</Label>
                  <Select 
                    value={importForm.entity_type}
                    onValueChange={(value) => setImportForm({...importForm, entity_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leads">Leads</SelectItem>
                      <SelectItem value="contacts">Contacts</SelectItem>
                      <SelectItem value="accounts">Accounts</SelectItem>
                      <SelectItem value="deals">Deals</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div 
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 mx-auto text-primary" />
                      <div className="font-medium">{selectedFile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div className="font-medium">
                        Drag & drop your CSV file here
                      </div>
                      <div className="text-sm text-muted-foreground">
                        or click to browse
                      </div>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-input"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="skip-duplicates"
                      checked={importForm.skip_duplicates}
                      onChange={(e) => setImportForm({...importForm, skip_duplicates: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="skip-duplicates" className="cursor-pointer">
                      Skip duplicate records
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="update-existing"
                      checked={importForm.update_existing}
                      onChange={(e) => setImportForm({...importForm, update_existing: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="update-existing" className="cursor-pointer">
                      Update existing records
                    </Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={startImport} disabled={!selectedFile}>
                  Start Import
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Export Data</DialogTitle>
                <DialogDescription>
                  Download your CRM data in various formats
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Data Type</Label>
                  <Select 
                    value={exportForm.entity_type}
                    onValueChange={(value) => setExportForm({...exportForm, entity_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leads">Leads</SelectItem>
                      <SelectItem value="contacts">Contacts</SelectItem>
                      <SelectItem value="accounts">Accounts</SelectItem>
                      <SelectItem value="deals">Deals</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                      <SelectItem value="all">All Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select 
                    value={exportForm.export_format}
                    onValueChange={(value) => setExportForm({...exportForm, export_format: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={startExport}>
                  Start Export
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="imports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="imports">
            Import Jobs ({importJobs.length})
          </TabsTrigger>
          <TabsTrigger value="exports">
            Export Jobs ({exportJobs.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="imports" className="space-y-4">
          {importJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No imports yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first import to bulk upload data
                </p>
                <Button onClick={() => setIsImportDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {importJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(job.status)}
                            <CardTitle className="text-base">{job.file_name}</CardTitle>
                          </div>
                          <CardDescription>
                            {job.entity_type.charAt(0).toUpperCase() + job.entity_type.slice(1)} • 
                            {new Date(job.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    {job.status === 'processing' && (
                      <CardContent>
                        <Progress value={(job.processed_rows / job.total_rows) * 100} />
                        <div className="text-sm text-muted-foreground mt-2">
                          {job.processed_rows} of {job.total_rows} rows processed
                        </div>
                      </CardContent>
                    )}
                    
                    {job.status === 'completed' && (
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Total</div>
                            <div className="font-medium">{job.total_rows}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Success</div>
                            <div className="font-medium text-green-600">{job.successful_rows}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Failed</div>
                            <div className="font-medium text-red-600">{job.failed_rows}</div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                    
                    {job.status === 'failed' && (
                      <CardContent>
                        <div className="flex items-start gap-2 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mt-0.5" />
                          <div>Import failed. Please check your file and try again.</div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="exports" className="space-y-4">
          {exportJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Download className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No exports yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first export to download data
                </p>
                <Button onClick={() => setIsExportDialogOpen(true)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {exportJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(job.status)}
                            <CardTitle className="text-base">{job.file_name}</CardTitle>
                          </div>
                          <CardDescription>
                            {job.entity_type.charAt(0).toUpperCase() + job.entity_type.slice(1)} • 
                            {job.export_format.toUpperCase()} •
                            {new Date(job.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    {job.status === 'completed' && (
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {job.total_records} records • {(job.file_size / 1024).toFixed(2)} KB
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => downloadExport(job.id, job.file_name)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        {job.expires_at && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Expires: {new Date(job.expires_at).toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
