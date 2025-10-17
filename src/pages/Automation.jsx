import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Layout, Mouse } from 'lucide-react';
import WorkflowBuilder from "../components/automation/WorkflowBuilder";
import LandingPageBuilder from "../components/marketing/LandingPageBuilder";
import WebFormBuilder from "../components/marketing/WebFormBuilder";

export default function Automation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing & Automation</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Build workflows, landing pages, and capture forms</p>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows" className="gap-2">
            <Zap className="w-4 h-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="landing" className="gap-2">
            <Layout className="w-4 h-4" />
            Landing Pages
          </TabsTrigger>
          <TabsTrigger value="forms" className="gap-2">
            <Mouse className="w-4 h-4" />
            Web Forms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows">
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="landing">
          <LandingPageBuilder />
        </TabsContent>

        <TabsContent value="forms">
          <WebFormBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
