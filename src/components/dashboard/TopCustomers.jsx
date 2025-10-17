import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Crown, Star, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const customerTiers = {
  vip: { icon: Crown, color: "text-yellow-600 bg-yellow-100", label: "VIP" },
  premium: { icon: Star, color: "text-purple-600 bg-purple-100", label: "Premium" },
  regular: { icon: User, color: "text-blue-600 bg-blue-100", label: "Regular" }
};

export default function TopCustomers({ customers, isLoading }) {
  const getCustomerTier = (lifetimeValue) => {
    if (lifetimeValue >= 5000) return 'vip';
    if (lifetimeValue >= 1000) return 'premium';
    return 'regular';
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
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
                  <Skeleton className="h-6 w-16 rounded-full" />
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
              Top Customers
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Your most valuable customers by lifetime value
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No customers yet</p>
              <p className="text-sm text-slate-400">Your top customers will appear here</p>
            </div>
          ) : (
            customers.map((customer, index) => {
              const tier = getCustomerTier(customer.lifetime_value || 0);
              const TierIcon = customerTiers[tier].icon;
              
              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-blue-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {customer.first_name?.[0] || customer.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${customerTiers[tier].color} flex items-center justify-center`}>
                        <TierIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {customer.first_name && customer.last_name 
                          ? `${customer.first_name} ${customer.last_name}`
                          : customer.email
                        }
                      </p>
                      <p className="text-sm text-slate-500">
                        {customer.total_orders || 0} orders
                      </p>
                      <p className="text-xs text-slate-400">
                        {customer.company && `${customer.company} • `}
                        {customer.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ${(customer.lifetime_value || 0).toLocaleString()}
                    </p>
                    <Badge className={`text-xs ${customerTiers[tier].color}`}>
                      {customerTiers[tier].label}
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