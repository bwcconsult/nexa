import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, TrendingUp, Target, Award, Clock } from "lucide-react";

export default function LeadsStats({ leads }) {
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => {
    const created = new Date(l.created_date);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return created >= weekAgo;
  }).length;
  
  const hotLeads = leads.filter(l => (l.lead_score || 0) >= 80).length;
  const convertedLeads = leads.filter(l => l.status === 'customer').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
  const avgScore = totalLeads > 0 ? (leads.reduce((sum, l) => sum + (l.lead_score || 0), 0) / totalLeads).toFixed(1) : 0;

  const stats = [
    { 
      title: "Total Leads", 
      value: totalLeads.toLocaleString(), 
      icon: Users,
      change: "+12% from last month",
      positive: true
    },
    { 
      title: "New This Week", 
      value: newLeads.toLocaleString(), 
      icon: UserPlus,
      change: "+5 from last week",
      positive: true
    },
    { 
      title: "Hot Leads", 
      value: hotLeads.toLocaleString(), 
      icon: Target,
      change: "Score 80+",
      positive: true
    },
    { 
      title: "Conversion Rate", 
      value: `${conversionRate}%`, 
      icon: Award,
      change: "+2.3% from last month",
      positive: true
    },
    { 
      title: "Avg Lead Score", 
      value: avgScore, 
      icon: TrendingUp,
      change: "+8.5 from last month",
      positive: true
    },
    { 
      title: "Response Time", 
      value: "2.4h", 
      icon: Clock,
      change: "-30min improvement",
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-slate-500" />
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}