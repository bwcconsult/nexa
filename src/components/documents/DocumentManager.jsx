import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, File, FileText, Image as ImageIcon, Download, Trash2, MoreVertical, Eye } from 'lucide-react';
import { FileAPI } from "@/api/apiClient";
import { format } from 'date-fns';

export default function DocumentManager({ recordId, recordType }) {
  const [documents, setDocuments] = useState([
    // Example documents
    { id: 1, name: 'Contract.pdf', type: 'pdf', size: '245 KB', uploaded_by: 'John Doe', uploaded_at: new Date(), url: '#' },
    { id: 2, name: 'Proposal.docx', type: 'docx', size: '180 KB', uploaded_by: 'Jane Smith', uploaded_at: new Date(), url: '#' },
  ]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload file using backend API
      const uploadedFile = await FileAPI.upload(file, 'documents');
      
      const newDoc = {
        id: Date.now(),
        name: file.name,
        type: file.name.split('.').pop(),
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploaded_by: 'Current User',
        uploaded_at: new Date(),
        url: uploadedFile.url || '#',
      };

      setDocuments(prev => [newDoc, ...prev]);
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (docId) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(d => d.id !== docId));
    }
  };

  const getFileIcon = (type) => {
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(type.toLowerCase())) {
      return ImageIcon;
    }
    if (['pdf'].includes(type.toLowerCase())) {
      return FileText;
    }
    return File;
  };

  const getFileTypeBadge = (type) => {
    const colors = {
      pdf: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      docx: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      xlsx: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      png: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      jpg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    };
    return (
      <Badge className={`${colors[type.toLowerCase()] || 'bg-slate-100 text-slate-800'} uppercase`}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Documents ({documents.length})</CardTitle>
            <div>
              <Input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button asChild className="gap-2" disabled={uploading}>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </label>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <File className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No documents uploaded yet</p>
              <p className="text-sm mt-1">Upload your first document to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => {
                  const FileIcon = getFileIcon(doc.type);
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-4 h-4 text-slate-400" />
                          <span className="hover:text-blue-600 cursor-pointer">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getFileTypeBadge(doc.type)}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.uploaded_by}</TableCell>
                      <TableCell>{format(doc.uploaded_at, 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(doc.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
