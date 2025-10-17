import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Play, Pause, Zap, Mail, Users, DollarSign, Check, X, ChevronRight, Settings } from 'lucide-react';

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Lead Nurture Campaign',
      trigger: 'Lead Created',
      status: 'active',
      runs: 247,
      success_rate: 94,
      actions: 5,
    },
    {
      id: 2,
      name: 'Deal Won Notification',
      trigger: 'Deal Stage Changed',
      status: 'active',
      runs: 89,
      success_rate: 100,
      actions: 3,
    },
    {
      id: 3,
      name: 'Inactive Contact Cleanup',
      trigger: 'Scheduled Daily',
      status: 'paused',
      runs: 30,
      success_rate: 88,
      actions: 4,
    },
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const [workflowSteps, setWorkflowSteps] = useState([
    { type: 'trigger', name: 'When Lead is Created', icon: Zap },
    { type: 'condition', name: 'If Lead Score > 70', icon: Check },
    { type: 'action', name: 'Send Email: Welcome', icon: Mail },
    { type: 'delay', name: 'Wait 2 Days', icon: ChevronRight },
    { type: 'action', name: 'Assign to Sales Rep', icon: Users },
    { type: 'action', name: 'Create Task: Follow-up', icon: Check },
  ]);

  const triggers = [
    { id: 'lead_created', name: 'Lead Created', category: 'Lead' },
    { id: 'contact_updated', name: 'Contact Updated', category: 'Contact' },
    { id: 'deal_stage_changed', name: 'Deal Stage Changed', category: 'Deal' },
    { id: 'form_submitted', name: 'Form Submitted', category: 'Marketing' },
    { id: 'email_opened', name: 'Email Opened', category: 'Email' },
    { id: 'scheduled', name: 'Scheduled (Daily/Weekly)', category: 'Time' },
  ];

  const actions = [
    { id: 'send_email', name: 'Send Email', icon: Mail, category: 'Communication' },
    { id: 'create_task', name: 'Create Task', icon: Check, category: 'Task' },
    { id: 'update_field', name: 'Update Field', icon: Settings, category: 'Data' },
    { id: 'assign_user', name: 'Assign to User', icon: Users, category: 'Assignment' },
    { id: 'change_stage', name: 'Change Stage', icon: ChevronRight, category: 'Pipeline' },
    { id: 'add_tag', name: 'Add Tag', icon: Plus, category: 'Organization' },
  ];

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
        <Play className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
        <Pause className="w-3 h-3 mr-1" />
        Paused
      </Badge>
    );
  };

  const handleToggleStatus = (id) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Workflow Automation</h2>
          <p className="text-slate-600 dark:text-slate-400">Automate repetitive tasks and processes</p>
        </div>
        <Button onClick={() => setShowBuilder(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workflows.filter(w => w.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.reduce((sum, w) => sum + w.runs, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="grid grid-cols-1 gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{workflow.name}</h3>
                    {getStatusBadge(workflow.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>Trigger: {workflow.trigger}</span>
                    </div>
                    <div>•</div>
                    <div>{workflow.actions} actions</div>
                    <div>•</div>
                    <div>{workflow.runs} runs</div>
                    <div>•</div>
                    <div className="text-green-600">{workflow.success_rate}% success</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(workflow.id)}
                  >
                    {workflow.status === 'active' ? (
                      <><Pause className="w-4 h-4 mr-2" />Pause</>
                    ) : (
                      <><Play className="w-4 h-4 mr-2" />Activate</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedWorkflow(workflow);
                      setShowBuilder(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Builder Dialog */}
      {showBuilder && (
        <Dialog open={true} onOpenChange={() => setShowBuilder(false)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedWorkflow ? `Edit: ${selectedWorkflow.name}` : 'Create New Workflow'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Workflow Name */}
              <div>
                <Label>Workflow Name</Label>
                <Input placeholder="e.g., Lead Nurture Campaign" />
              </div>

              {/* Visual Workflow Builder */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 min-h-[400px]">
                <div className="space-y-4">
                  {workflowSteps.map((step, index) => {
                    const Icon = step.icon;
                    const bgColors = {
                      trigger: 'bg-purple-100 dark:bg-purple-900/50',
                      condition: 'bg-blue-100 dark:bg-blue-900/50',
                      action: 'bg-green-100 dark:bg-green-900/50',
                      delay: 'bg-orange-100 dark:bg-orange-900/50',
                    };

                    return (
                      <div key={index}>
                        <div className={`${bgColors[step.type]} border-2 border-${step.type === 'trigger' ? 'purple' : step.type === 'condition' ? 'blue' : step.type === 'action' ? 'green' : 'orange'}-300 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow`}>
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <div>
                              <p className="font-medium">{step.name}</p>
                              <p className="text-xs text-slate-500 capitalize">{step.type}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        {index < workflowSteps.length - 1 && (
                          <div className="flex justify-center py-2">
                            <ChevronRight className="w-6 h-6 rotate-90 text-slate-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Step Button */}
                  <Button variant="outline" className="w-full border-dashed">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>

              {/* Available Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Available Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Button key={action.id} variant="outline" size="sm" className="justify-start gap-2">
                          <Icon className="w-4 h-4" />
                          {action.name}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowBuilder(false)}>Cancel</Button>
                <Button className="gap-2">
                  <Check className="w-4 h-4" />
                  Save Workflow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
