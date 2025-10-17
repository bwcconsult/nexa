import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MousePointer, Target, DollarSign, Percent } from 'lucide-react';

export default function LinkStatsCards({ stats }) {
  const cardData = [
    { title: "Total Clicks", value: stats.totalClicks.toLocaleString(), icon: MousePointer },
    { title: "Total Conversions", value: stats.totalConversions.toLocaleString(), icon: Target },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { title: "Avg. Conv. Rate", value: `${stats.avgConversionRate.toFixed(1)}%`, icon: Percent },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map(card => (
        <Card key={card.title} className="glass-card border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">{card.title}</p>
              <card.icon className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}