import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Code, Eye, Trash2, GripVertical, Type, Mail, Phone, Calendar, CheckSquare } from 'lucide-react';

export default function WebFormBuilder() {
  const [forms, setForms] = useState([
    { id: 1, name: 'Contact Us', submissions: 234, fields: 4, status: 'active' },
    { id: 2, name: 'Newsletter Signup', submissions: 1829, fields: 2, status: 'active' },
    { id: 3, name: 'Demo Request', submissions: 67, fields: 6, status: 'active' },
  ]);

  const [formFields, setFormFields] = useState([
    { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe' },
    { id: 2, type: 'email', label: 'Email', required: true, placeholder: 'john@example.com' },
    { id: 3, type: 'phone', label: 'Phone', required: false, placeholder: '+1 (555) 000-0000' },
    { id: 4, type: 'textarea', label: 'Message', required: true, placeholder: 'Your message...' },
  ]);

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: Type },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'textarea', label: 'Text Area', icon: Type },
    { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { value: 'select', label: 'Dropdown', icon: Type },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Web Form Builder</h2>
          <p className="text-slate-600 dark:text-slate-400">Create embeddable forms for lead capture</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />Create Form
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Form List */}
        <div className="col-span-4">
          <Card>
            <CardHeader><CardTitle>Your Forms</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {forms.map(form => (
                <div key={form.id} className="p-3 border rounded-lg hover:border-blue-300 cursor-pointer">
                  <h4 className="font-medium">{form.name}</h4>
                  <p className="text-sm text-slate-500">{form.submissions} submissions • {form.fields} fields</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Form Builder */}
        <div className="col-span-8">
          <Card>
            <CardHeader><CardTitle>Form Editor</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formFields.map(field => (
                  <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <GripVertical className="w-5 h-5 text-slate-400 mt-2 cursor-move" />
                    <div className="flex-1">
                      <div className="flex gap-3 mb-2">
                        <Input value={field.label} className="flex-1" />
                        <Select value={field.type}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch checked={field.required} />
                          <span className="text-sm">Required</span>
                        </div>
                        <Input placeholder="Placeholder" value={field.placeholder} className="w-64" />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" />Add Field
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Embed Code</h4>
                <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-xs">
                  {`<script src="https://yoursite.com/form.js"></script>\n<div id="nexacrm-form-1"></div>`}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Code className="w-4 h-4" />Copy Code
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
