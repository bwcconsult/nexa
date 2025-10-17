import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp } from "lucide-react";

// Mock data - in real app, this would come from your analytics
const mockData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 2000, orders: 156 },
  { name: 'Apr', revenue: 2780, orders: 189 },
  { name: 'May', revenue: 1890, orders: 145 },
  { name: 'Jun', revenue: 2390, orders: 178 },
  { name: 'Jul', revenue: 3490, orders: 223 },
  { name: 'Aug', revenue: 4200, orders: 267 },
  { name: 'Sep', revenue: 3800, orders: 245 },
  { name: 'Oct', revenue: 4600, orders: 289 },
  { name: 'Nov', revenue: 5200, orders: 312 },
  { name: 'Dec', revenue: 6100, orders: 345 }
];

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState("12M");

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-slate-900">{label}</p>
          <p className="text-sm text-emerald-600">
            Revenue: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-blue-600">
            Orders: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Revenue Overview
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Track your business performance over time
            </p>
          </div>
          <div className="flex gap-2">
            {["7D", "30D", "3M", "12M"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ordersGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-slate-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-600">Orders</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">+12.5%</span>
            <span className="text-sm text-slate-500">vs last period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}