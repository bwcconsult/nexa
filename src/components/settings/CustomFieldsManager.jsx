import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Type, Hash, Calendar, ToggleLeft, List, FileText } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function CustomFieldsManager() {
  const [customFields, setCustomFields] = useState([
    { id: 1, name: 'Industry Vertical', entity: 'Lead', type: 'dropdown', options: ['Technology', 'Healthcare', 'Finance', 'Retail'], required: false, active: true },
    { id: 2, name: 'Deal Source', entity: 'Deal', type: 'text', required: true, active: true },
    { id: 3, name: 'Customer Tier', entity: 'Account', type: 'dropdown', options: ['Enterprise', 'Mid-Market', 'SMB'], required: false, active: true },
    { id: 4, name: 'Contract End Date', entity: 'Account', type: 'date', required: false, active: true },
    { id: 5, name: 'LTV (Lifetime Value)', entity: 'Customer', type: 'number', required: false, active: true },
  ]);
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    entity: 'Lead',
    type: 'text',
    options: '',
    required: false,
    defaultValue: '',
    helpText: '',
  });

  const fieldTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'checkbox', label: 'Checkbox', icon: ToggleLeft },
    { value: 'dropdown', label: 'Dropdown', icon: List },
    { value: 'textarea', label: 'Long Text', icon: FileText },
  ];

  const entities = ['Lead', 'Contact', 'Account', 'Deal', 'Task', 'Customer', 'Product', 'Order'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingField) {
      // Update existing field
      setCustomFields(prev => prev.map(field => 
        field.id === editingField.id 
          ? { 
              ...field, 
              ...formData, 
              options: formData.type === 'dropdown' ? formData.options.split(',').map(o => o.trim()) : null 
            }
          : field
      ));
    } else {
      // Create new field
      const newField = {
        id: Date.now(),
        ...formData,
        options: formData.type === 'dropdown' ? formData.options.split(',').map(o => o.trim()) : null,
        active: true,
      };
      setCustomFields(prev => [...prev, newField]);
    }
    
    // Reset form
    setFormData({
      name: '',
      entity: 'Lead',
      type: 'text',
      options: '',
      required: false,
      defaultValue: '',
      helpText: '',
    });
    setEditingField(null);
    setShowDialog(false);
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      entity: field.entity,
      type: field.type,
      options: field.options ? field.options.join(', ') : '',
      required: field.required || false,
      defaultValue: field.defaultValue || '',
      helpText: field.helpText || '',
    });
    setShowDialog(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this custom field?')) {
      setCustomFields(prev => prev.filter(field => field.id !== id));
    }
  };

  const toggleActive = (id) => {
    setCustomFields(prev => prev.map(field => 
      field.id === id ? { ...field, active: !field.active } : field
    ));
  };

  const getFieldIcon = (type) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    return fieldType ? fieldType.icon : Type;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custom Fields</CardTitle>
              <CardDescription>
                Create custom fields to capture unique data for your business
              </CardDescription>
            </div>
            <Button onClick={() => {
              setEditingField(null);
              setFormData({
                name: '',
                entity: 'Lead',
                type: 'text',
                options: '',
                required: false,
                defaultValue: '',
                helpText: '',
              });
              setShowDialog(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Field
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {customFields.map((field) => {
                    const Icon = getFieldIcon(field.type);
                    return (
                      <motion.tr
                        key={field.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="group"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-400" />
                            {field.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{field.entity}</Badge>
                        </TableCell>
                        <TableCell className="capitalize">{field.type}</TableCell>
                        <TableCell>
                          {field.required ? (
                            <Badge variant="destructive">Required</Badge>
                          ) : (
                            <Badge variant="secondary">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(field.id)}
                          >
                            {field.active ? (
                              <Badge variant="success" className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(field)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(field.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {customFields.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No custom fields yet. Create your first custom field to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit' : 'Create'} Custom Field</DialogTitle>
            <DialogDescription>
              Add custom fields to capture data specific to your business needs
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Field Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Industry Vertical"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entity">Apply To *</Label>
                <Select
                  value={formData.entity}
                  onValueChange={(value) => setFormData({ ...formData, entity: value })}
                >
                  <SelectTrigger id="entity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map(entity => (
                      <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Field Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'dropdown' && (
              <div className="space-y-2">
                <Label htmlFor="options">Dropdown Options *</Label>
                <Input
                  id="options"
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder="Option 1, Option 2, Option 3"
                  required
                />
                <p className="text-sm text-slate-500">Separate options with commas</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                value={formData.defaultValue}
                onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                placeholder="Optional default value"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="helpText">Help Text</Label>
              <Input
                id="helpText"
                value={formData.helpText}
                onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
                placeholder="Help text to guide users"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
              />
              <Label htmlFor="required" className="font-normal">
                Make this field required
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingField ? 'Update' : 'Create'} Field
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{customFields.length}</div>
            <p className="text-sm text-slate-500">Total Fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {customFields.filter(f => f.active).length}
            </div>
            <p className="text-sm text-slate-500">Active Fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {customFields.filter(f => f.required).length}
            </div>
            <p className="text-sm text-slate-500">Required Fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {entities.length}
            </div>
            <p className="text-sm text-slate-500">Entities</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
