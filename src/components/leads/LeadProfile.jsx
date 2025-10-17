import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X, Edit, Mail, Phone, Building, MapPin, Calendar, 
  Activity, DollarSign, Target, TrendingUp, Clock,
  ExternalLink, MessageSquare, Video, Users
} from 'lucide-react';
import { format } from 'date-fns';

export default function LeadProfile({ lead, activities, deals, onClose, onEdit }) {
  const totalDealValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const activitiesCount = activities.length;
  const lastActivity = activities[0];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-red-600 bg-red-100";
    if (score >= 50) return "text-orange-600 bg-orange-100";
    return "text-blue-600 bg-blue-100";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Video className="w-4 h-4" />;
      case 'note': return <MessageSquare className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {(lead.first_name?.[0] || lead.email[0]).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 'Unnamed Lead'}
                </h2>
                <p className="text-slate-500">{lead.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Panel: Lead Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium">{lead.email}</p>
                      <p className="text-sm text-slate-500">Email</p>
                    </div>
                  </div>
                  
                  {lead.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium">{lead.phone}</p>
                        <p className="text-sm text-slate-500">Phone</p>
                      </div>
                    </div>
                  )}
                  
                  {lead.company && (
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium">{lead.company}</p>
                        <p className="text-sm text-slate-500">Company</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium">{format(new Date(lead.created_date), "MMM d, yyyy")}</p>
                      <p className="text-sm text-slate-500">Created</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lead Scoring & Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lead Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Lead Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{lead.lead_score || 0}</span>
                      <Badge className={getScoreColor(lead.lead_score || 0)}>
                        {lead.lead_score >= 80 ? 'Hot' : lead.lead_score >= 50 ? 'Warm' : 'Cold'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant="outline" className="capitalize">{lead.status}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Source</span>
                    <Badge variant="secondary" className="capitalize">{lead.source || 'Unknown'}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Engagement</span>
                    <span className="font-medium">{lead.engagement_score || 0}/10</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">Activities</span>
                    </div>
                    <span className="font-semibold">{activitiesCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">Deals</span>
                    </div>
                    <span className="font-semibold">{deals.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">Deal Value</span>
                    </div>
                    <span className="font-semibold">${totalDealValue.toLocaleString()}</span>
                  </div>
                  
                  {lastActivity && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">Last Activity</span>
                      </div>
                      <span className="text-sm text-slate-600">
                        {format(new Date(lastActivity.created_date), "MMM d")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: Activity Timeline & Deals */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.slice(0, 10).map(activity => (
                        <div key={activity.id} className="flex gap-3 p-3 border rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-slate-900">{activity.title}</p>
                              <span className="text-xs text-slate-500">
                                {format(new Date(activity.created_date), "MMM d, h:mm a")}
                              </span>
                            </div>
                            {activity.description && (
                              <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {activity.type}
                              </Badge>
                              {activity.priority && (
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {activity.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No activities recorded yet</p>
                      <p className="text-sm text-slate-400">Activities will appear here as you interact with this lead</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Associated Deals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Associated Deals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {deals.length > 0 ? (
                    <div className="space-y-3">
                      {deals.map(deal => (
                        <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{deal.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {deal.stage}
                              </Badge>
                              <span className="text-sm text-slate-500">
                                {deal.expected_close_date && format(new Date(deal.expected_close_date), "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              ${(deal.value || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">{deal.probability || 0}% probability</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No deals associated yet</p>
                      <Button className="mt-3" size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        Create Deal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              {lead.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 whitespace-pre-wrap">{lead.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}