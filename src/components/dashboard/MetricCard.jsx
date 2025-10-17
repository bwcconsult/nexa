
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const colorVariants = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  blue: "text-blue-600 dark:text-blue-400", 
  purple: "text-purple-600 dark:text-purple-400",
  orange: "text-orange-600 dark:text-orange-400"
};

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "blue", 
  isLoading = false 
}) {
  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <Card className="transition-shadow hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
            <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800`}>
              <Icon className={`w-4 h-4 ${colorVariants[color]}`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">vs last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
