import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Users, Bell, CreditCard, Shield, DollarSign, Zap, FileText, BarChart3, Mail } from 'lucide-react';
import TeamManagement from "../components/settings/TeamManagement";
import CurrencySettings from "../components/settings/CurrencySettings";
import SSOSettings from "../components/settings/SSOSettings";
import CustomFieldsManager from "../components/settings/CustomFieldsManager";
import ReportBuilder from "../components/analytics/ReportBuilder";
import MassEmailCampaign from "../components/marketing/MassEmailCampaign";
import WorkflowBuilder from "../components/automation/WorkflowBuilder";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your CRM settings and preferences</p>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="grid grid-cols-11 w-full">
          <TabsTrigger value="team" className="gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="currency" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Currency
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            SSO
          </TabsTrigger>
          <TabsTrigger value="customfields" className="gap-2">
            <FileText className="w-4 h-4" />
            Custom Fields
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            Mass Email
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-2">
            <Zap className="w-4 h-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="currency">
          <CurrencySettings />
        </TabsContent>

        <TabsContent value="security">
          <SSOSettings />
        </TabsContent>

        <TabsContent value="customfields">
          <CustomFieldsManager />
        </TabsContent>

        <TabsContent value="reports">
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="email">
          <MassEmailCampaign />
        </TabsContent>

        <TabsContent value="automation">
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12 text-slate-500">
              Profile customization coming soon
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12 text-slate-500">
              Notification settings coming soon
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12 text-slate-500">
              Billing management coming soon
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12 text-slate-500">
              Advanced configuration options
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}