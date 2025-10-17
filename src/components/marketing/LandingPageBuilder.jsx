import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Eye, Code, Layout, Type, Image as ImageIcon, Mouse, Check, Palette, Settings, Globe, Copy, Trash2 } from 'lucide-react';

export default function LandingPageBuilder() {
  const [pages, setPages] = useState([
    {
      id: 1,
      name: 'Product Launch 2024',
      url: 'product-launch-2024',
      status: 'published',
      visits: 1247,
      conversions: 89,
      template: 'Hero + Features',
      created: '2024-01-15',
    },
    {
      id: 2,
      name: 'Free Trial Signup',
      url: 'free-trial',
      status: 'published',
      visits: 3421,
      conversions: 412,
      template: 'Lead Capture',
      created: '2024-02-01',
    },
    {
      id: 3,
      name: 'Webinar Registration',
      url: 'webinar-2024',
      status: 'draft',
      visits: 0,
      conversions: 0,
      template: 'Event Registration',
      created: '2024-03-10',
    },
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  const templates = [
    { id: 'hero', name: 'Hero + Features', preview: 'Large hero section with feature grid' },
    { id: 'lead_capture', name: 'Lead Capture', preview: 'Centered form with benefits' },
    { id: 'event', name: 'Event Registration', preview: 'Event details + registration form' },
    { id: 'product', name: 'Product Showcase', preview: 'Product gallery with pricing' },
    { id: 'thank_you', name: 'Thank You Page', preview: 'Post-conversion confirmation' },
    { id: 'coming_soon', name: 'Coming Soon', preview: 'Pre-launch email capture' },
  ];

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: Layout, description: 'Large header with CTA' },
    { id: 'features', name: 'Features Grid', icon: Layout, description: '3-column feature display' },
    { id: 'testimonials', name: 'Testimonials', icon: Type, description: 'Customer reviews' },
    { id: 'pricing', name: 'Pricing Table', icon: Layout, description: 'Pricing plans' },
    { id: 'form', name: 'Form Section', icon: Mouse, description: 'Lead capture form' },
    { id: 'cta', name: 'Call to Action', icon: Mouse, description: 'Conversion button' },
    { id: 'image', name: 'Image/Video', icon: ImageIcon, description: 'Media content' },
    { id: 'text', name: 'Text Block', icon: Type, description: 'Rich text content' },
  ];

  const [pageContent, setPageContent] = useState({
    sections: [
      { type: 'hero', title: 'Transform Your Business', subtitle: 'The all-in-one CRM solution', cta: 'Start Free Trial' },
      { type: 'features', items: 3, title: 'Powerful Features' },
      { type: 'form', fields: ['name', 'email', 'company'] },
    ],
    styles: {
      primaryColor: '#3b82f6',
      font: 'Inter',
      buttonStyle: 'rounded',
    },
  });

  const getStatusBadge = (status) => {
    return status === 'published' ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
        <Globe className="w-3 h-3 mr-1" />
        Published
      </Badge>
    ) : (
      <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
        Draft
      </Badge>
    );
  };

  const calculateConversionRate = (visits, conversions) => {
    if (visits === 0) return 0;
    return ((conversions / visits) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Landing Page Builder</h2>
          <p className="text-slate-600 dark:text-slate-400">Create high-converting landing pages</p>
        </div>
        <Button onClick={() => setShowBuilder(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Page
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pages.filter(p => p.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.reduce((sum, p) => sum + p.visits, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pages.reduce((sum, p) => sum + p.conversions, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages List */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {pages.map((page) => (
              <div key={page.id} className="border rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{page.name}</h3>
                      {getStatusBadge(page.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span className="font-mono">/{page.url}</span>
                      </div>
                      <div>•</div>
                      <div>{page.template}</div>
                      <div>•</div>
                      <div>{page.visits.toLocaleString()} visits</div>
                      <div>•</div>
                      <div className="text-green-600">{page.conversions} conversions ({calculateConversionRate(page.visits, page.conversions)}%)</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPage(page);
                        setShowBuilder(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page Builder Dialog */}
      {showBuilder && (
        <Dialog open={true} onOpenChange={() => setShowBuilder(false)}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPage ? `Edit: ${selectedPage.name}` : 'Create Landing Page'}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="design" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="design" className="gap-2">
                  <Layout className="w-4 h-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-2">
                  <Type className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-2">
                  <Code className="w-4 h-4" />
                  Code
                </TabsTrigger>
              </TabsList>

              {/* Design Tab */}
              <TabsContent value="design" className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Sidebar - Components */}
                  <div className="col-span-3 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Templates</h3>
                      <div className="space-y-2">
                        {templates.slice(0, 3).map(template => (
                          <Button key={template.id} variant="outline" className="w-full justify-start" size="sm">
                            {template.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Add Section</h3>
                      <div className="space-y-2">
                        {sections.map(section => {
                          const Icon = section.icon;
                          return (
                            <Button key={section.id} variant="outline" className="w-full justify-start gap-2" size="sm">
                              <Icon className="w-4 h-4" />
                              {section.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Center - Canvas */}
                  <div className="col-span-6">
                    <div className="border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 min-h-[600px] p-8">
                      {/* Hero Section Preview */}
                      <div className="text-center mb-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg">
                        <h1 className="text-4xl font-bold mb-4">Transform Your Business</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">The all-in-one CRM solution</p>
                        <Button size="lg">Start Free Trial</Button>
                      </div>

                      {/* Features Section Preview */}
                      <div className="grid grid-cols-3 gap-6 mb-12">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="text-center p-4 border rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-3 flex items-center justify-center">
                              <Check className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Feature {i}</h3>
                            <p className="text-sm text-slate-500">Feature description here</p>
                          </div>
                        ))}
                      </div>

                      {/* Form Section Preview */}
                      <div className="max-w-md mx-auto p-6 border rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Get Started Today</h3>
                        <div className="space-y-3">
                          <Input placeholder="Full Name" />
                          <Input type="email" placeholder="Email Address" />
                          <Input placeholder="Company" />
                          <Button className="w-full">Sign Up Free</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar - Properties */}
                  <div className="col-span-3 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Styles</h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Primary Color</Label>
                          <div className="flex gap-2">
                            <Input type="color" value="#3b82f6" className="w-16 h-10" />
                            <Input value="#3b82f6" readOnly className="flex-1" />
                          </div>
                        </div>
                        <div>
                          <Label>Font Family</Label>
                          <Select defaultValue="inter">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inter">Inter</SelectItem>
                              <SelectItem value="roboto">Roboto</SelectItem>
                              <SelectItem value="poppins">Poppins</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Button Style</Label>
                          <Select defaultValue="rounded">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="pill">Pill</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Page Title</Label>
                    <Input placeholder="e.g., Product Launch 2024" />
                  </div>
                  <div>
                    <Label>URL Slug</Label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 border rounded-l-lg bg-slate-50 dark:bg-slate-900 text-slate-500">
                        yoursite.com/
                      </span>
                      <Input placeholder="product-launch" className="rounded-l-none" />
                    </div>
                  </div>
                  <div>
                    <Label>Meta Description (SEO)</Label>
                    <Textarea placeholder="Page description for search engines" rows={3} />
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Form Submissions Go To</Label>
                    <Select defaultValue="crm">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crm">Save to CRM (Leads)</SelectItem>
                        <SelectItem value="email">Send via Email</SelectItem>
                        <SelectItem value="webhook">Webhook URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Redirect After Submit</Label>
                    <Input placeholder="/thank-you" />
                  </div>
                  <div>
                    <Label>Tracking Code (Optional)</Label>
                    <Textarea placeholder="Google Analytics, Facebook Pixel, etc." rows={3} />
                  </div>
                </div>
              </TabsContent>

              {/* Code Tab */}
              <TabsContent value="code">
                <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-auto">
                  <pre>{`<!DOCTYPE html>
<html>
<head>
  <title>Transform Your Business</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div class="container">
    <section class="hero">
      <h1>Transform Your Business</h1>
      <p>The all-in-one CRM solution</p>
      <button>Start Free Trial</button>
    </section>
    ...
  </div>
</body>
</html>`}</pre>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setShowBuilder(false)}>Cancel</Button>
              <div className="flex gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button className="gap-2">
                  <Globe className="w-4 h-4" />
                  Publish Page
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
