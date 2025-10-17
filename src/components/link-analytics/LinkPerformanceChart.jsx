import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function LinkPerformanceChart({ links }) {
  const chartData = links.slice(0, 10).map(link => ({
    name: link.title,
    Clicks: link.clicks || 0,
    Conversions: link.conversions || 0,
  })).sort((a,b) => b.Clicks - a.Clicks);

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Top 10 Link Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
              <Legend />
              <Bar dataKey="Clicks" fill="#3B82F6" />
              <Bar dataKey="Conversions" fill="#84CC16" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}