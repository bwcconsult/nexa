import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Sparkles,
  Target,
  Mail,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInsights();
    fetchStats();
  }, [filter]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('priority', filter);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/insights?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setInsights(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const dismissInsight = async (id) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/ai/insights/${id}/dismiss`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchInsights();
      fetchStats();
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  };

  const markActedUpon = async (id, outcome) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/ai/insights/${id}/acted`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ outcome })
        }
      );
      fetchInsights();
      fetchStats();
    } catch (error) {
      console.error('Error marking insight:', error);
    }
  };

  const runAnomalyDetection = async () => {
    try {
      setLoading(true);
      await fetch(
        `${import.meta.env.VITE_API_URL}/ai/detect-anomalies`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchInsights();
      fetchStats();
    } catch (error) {
      console.error('Error detecting anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type) => {
    const icons = {
      lead_score: Target,
      next_best_action: Zap,
      anomaly_detection: AlertTriangle,
      trend_prediction: TrendingUp,
      email_suggestion: Mail,
      meeting_suggestion: Calendar
    };
    return icons[type] || Sparkles;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">AI Insights</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            AI-powered recommendations and predictions
          </p>
        </div>
        
        <Button onClick={runAnomalyDetection} disabled={loading}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          Detect Anomalies
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Active Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.insights?.active || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.insights?.total || 0} total generated
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.insights?.urgent || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Acted Upon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.insights?.acted_upon || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Actions completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.predictions?.recent || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Insights List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading AI insights...
        </div>
      ) : insights.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No insights yet</h3>
            <p className="text-muted-foreground mb-4">
              AI will analyze your data and generate recommendations
            </p>
            <Button onClick={runAnomalyDetection}>
              <Zap className="w-4 h-4 mr-2" />
              Run Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.insight_type);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-l-4 ${getPriorityColor(insight.priority)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityColor(insight.priority)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{insight.title}</CardTitle>
                            <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                              {insight.priority}
                            </Badge>
                            {insight.confidence_score && (
                              <Badge variant="secondary">
                                {Math.round(insight.confidence_score * 100)}% confidence
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">
                            {insight.description}
                          </CardDescription>
                          
                          {insight.action_recommended && Object.keys(insight.action_recommended).length > 0 && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <div className="text-sm font-medium mb-1">Recommended Action:</div>
                              <div className="text-sm text-muted-foreground">
                                {insight.action_recommended.recommendation || 
                                 insight.action_recommended.action ||
                                 'See details'}
                              </div>
                              {insight.action_recommended.estimated_impact && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Impact: {insight.action_recommended.estimated_impact}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!insight.acted_upon && (
                          <Button
                            size="sm"
                            onClick={() => markActedUpon(insight.id, { status: 'completed' })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Done
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissInsight(insight.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {insight.acted_upon && (
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Action completed
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
