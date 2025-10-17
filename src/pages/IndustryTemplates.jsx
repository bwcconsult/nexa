import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import IndustrySelector from "@/components/industry/IndustrySelector";
import { Check, X, AlertCircle, Zap, Mail, FileText, LayoutDashboard, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function IndustryTemplates() {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleSelectIndustry = (industry) => {
    setSelectedIndustry(industry);
    setShowDetails(true);
  };

  const handleApplyTemplate = async () => {
    if (!selectedIndustry) return;

    setApplying(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/industry-templates/${selectedIndustry.id}/apply`,
        { method: 'POST' }
      );
      const data = await response.json();
      
      // Store configuration in local storage for now
      localStorage.setItem('industryConfig', JSON.stringify(data.configuration));
      localStorage.setItem('selectedIndustry', JSON.stringify(selectedIndustry));
      
      alert('Industry template applied successfully! Your CRM is now configured for ' + selectedIndustry.industry_name);
      setShowDetails(false);
    } catch (error) {
      console.error('Error applying template:', error);
      alert('Failed to apply template. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Industry Templates</h1>
        <p className="text-gray-600 mt-2">
          Select your industry to automatically configure Nexa CRM with best practices, terminology, and workflows
        </p>
      </div>

      {selectedIndustry && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Selected: {selectedIndustry.industry_name}</p>
                <p className="text-sm text-gray-600">{selectedIndustry.fit_score}% Feature Match</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDetails(true)}>
                View Details
              </Button>
              <Button onClick={handleApplyTemplate} disabled={applying}>
                {applying ? 'Applying...' : 'Apply Template'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <IndustrySelector
        onSelect={handleSelectIndustry}
        selectedIndustry={selectedIndustry}
      />

      {/* Industry Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedIndustry && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedIndustry.industry_name}</DialogTitle>
                <DialogDescription>{selectedIndustry.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Fit Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Feature Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-primary">
                        {selectedIndustry.fit_score}%
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${selectedIndustry.fit_score}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Ready to use with minimal configuration
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="terminology" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="terminology">Terminology</TabsTrigger>
                    <TabsTrigger value="fields">Custom Fields</TabsTrigger>
                    <TabsTrigger value="workflows">Workflows</TabsTrigger>
                    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="terminology" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Industry Terminology</CardTitle>
                        <CardDescription>
                          Custom labels that match your industry language
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedIndustry.terminology && Object.keys(selectedIndustry.terminology).length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(selectedIndustry.terminology).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 capitalize">{key}:</span>
                                <span className="font-semibold">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">Standard terminology will be used</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="fields" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Pre-configured Custom Fields</CardTitle>
                        <CardDescription>
                          {selectedIndustry.custom_fields?.length || 0} custom fields ready to use
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedIndustry.custom_fields?.length > 0 ? (
                          <div className="space-y-2">
                            {selectedIndustry.custom_fields.map((field, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <p className="font-medium">{field.name}</p>
                                  <p className="text-sm text-gray-500">Module: {field.module}</p>
                                </div>
                                <Badge variant="outline">{field.type}</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No custom fields configured</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="workflows" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          Automated Workflows
                        </CardTitle>
                        <CardDescription>
                          {selectedIndustry.workflow_templates?.length || 0} workflow templates included
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedIndustry.workflow_templates?.length > 0 ? (
                          <div className="space-y-3">
                            {selectedIndustry.workflow_templates.map((workflow, index) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-start gap-3">
                                  <div className="bg-blue-50 p-2 rounded">
                                    <Zap className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{workflow.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Trigger: {workflow.trigger}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {workflow.actions?.map((action, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {action}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No workflow templates configured</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="pipeline" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Sales Pipeline Stages</CardTitle>
                        <CardDescription>
                          Recommended stages for {selectedIndustry.industry_name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedIndustry.pipeline_stages?.length > 0 ? (
                          <div className="space-y-2">
                            {selectedIndustry.pipeline_stages.map((stage, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{stage.name}</p>
                                </div>
                                <Badge variant="outline">{stage.probability}% Win Probability</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No pipeline stages configured</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="integrations" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recommended Integrations</CardTitle>
                        <CardDescription>
                          Popular tools used in {selectedIndustry.industry_name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedIndustry.recommended_integrations?.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {selectedIndustry.recommended_integrations.map((integration, index) => (
                              <div key={index} className="p-3 border rounded-lg text-center hover:bg-gray-50 transition-colors">
                                <p className="font-medium">{integration}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No integrations recommended</p>
                        )}
                      </CardContent>
                    </Card>

                    {selectedIndustry.compliance_features?.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            Compliance Features
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedIndustry.compliance_features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="bg-yellow-50">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowDetails(false)}>
                    Close
                  </Button>
                  <Button onClick={handleApplyTemplate} disabled={applying}>
                    {applying ? 'Applying Template...' : 'Apply This Template'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
