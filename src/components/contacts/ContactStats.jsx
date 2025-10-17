import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Zap, BarChart } from "lucide-react";

export default function ContactStats({ contacts }) {
  const newLeads = contacts.filter(c => c.status === 'lead').length;
  const activeCustomers = contacts.filter(c => c.status === 'customer').length;
  
  const stats = [
    { title: "Total Contacts", value: contacts.length, icon: Users },
    { title: "New Leads", value: newLeads, icon: UserPlus },
    { title: "Active Customers", value: activeCustomers, icon: Zap },
    { title: "Avg. Engagement", value: "6.8/10", icon: BarChart }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <Card key={stat.title} className="glass-card border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">{stat.title}</p>
              <stat.icon className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}