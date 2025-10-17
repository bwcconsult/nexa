import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw, TrendingUp, AlertTriangle, Target, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const impactColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  low: "bg-green-100 text-green-800 border-green-200"
};

const impactIcons = {
  high: AlertTriangle,
  medium: TrendingUp,
  low: Target
};

export default function AIInsights({ insights, onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 bg-opacity-10">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                AI Insights
              </CardTitle>
              <p className="text-sm text-slate-600">
                Powered by Base44 AI
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!insights ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border border-white/10">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const ImpactIcon = impactIcons[insight.impact] || Target;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-white/10 hover:border-purple-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${impactColors[insight.impact]} bg-opacity-10`}>
                        <ImpactIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-slate-900">{insight.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${impactColors[insight.impact]}`}
                          >
                            {insight.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {insight.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <p className="text-xs text-purple-600 font-medium">
                            Action: {insight.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
        
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              AI Analysis Complete
            </span>
          </div>
          <p className="text-xs text-purple-700">
            These insights are generated using advanced AI to help optimize your business performance and customer relationships.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}