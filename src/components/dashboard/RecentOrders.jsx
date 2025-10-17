import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowRight, ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { color: "bg-blue-100 text-blue-800", icon: ShoppingBag },
  shipped: { color: "bg-purple-100 text-purple-800", icon: ArrowRight },
  delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800", icon: XCircle }
};

export default function RecentOrders({ orders, isLoading }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Recent Orders
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Latest customer orders and their status
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No recent orders</p>
              <p className="text-sm text-slate-400">Orders will appear here once customers start purchasing</p>
            </div>
          ) : (
            orders.map((order, index) => {
              const StatusIcon = statusConfig[order.status]?.icon || Clock;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-blue-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <StatusIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        #{order.order_number || `ORD-${order.id?.slice(-6)}`}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.customer_email}
                      </p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(order.created_date), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ${order.total_amount?.toFixed(2) || '0.00'}
                    </p>
                    <Badge 
                      className={`text-xs ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800'}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}