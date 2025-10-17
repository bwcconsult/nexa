
import React from "react";
import { Zap, CheckCircle, AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const integrations = [
  { name: "Shopify", category: "E-commerce", status: "connected", logo: "/integrations/shopify.svg" },
  { name: "Stripe", category: "Payment", status: "connected", logo: "/integrations/stripe.svg" },
  { name: "WooCommerce", category: "E-commerce", status: "available", logo: "/integrations/woocommerce.svg" },
  { name: "Linktree", category: "Creator", status: "error", logo: "/integrations/linktree.svg" },
  { name: "Beacons", category: "Creator", status: "available", logo: "/integrations/beacons.svg" },
  { name: "Amazon", category: "Marketplace", status: "available", logo: "/integrations/amazon.svg" },
  { name: "Gmail", category: "Email", status: "connected", logo: "/integrations/gmail.svg" },
  { name: "Stan.store", category: "Creator", status: "available", logo: "/integrations/stan-store.svg" },
];

export default function Integrations() {
  const getStatusIndicator = (status) => {
    if (status === "connected") return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "error") return <AlertTriangle className="w-5 h-5 text-red-500" />;
    return <Plus className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations Hub</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Connect Nexa CRM with your favorite tools and platforms.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {integrations.map(int => (
          <Card key={int.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <img src={`https://logo.clearbit.com/${int.name.toLowerCase()}.com`} alt={int.name} className="w-10 h-10"/>
                {getStatusIndicator(int.status)}
              </div>
              <h3 className="font-semibold">{int.name}</h3>
              <p className="text-sm text-slate-500">{int.category}</p>
              <Button 
                variant={int.status === 'connected' ? "secondary" : "default"}
                className="w-full mt-4"
              >
                {int.status === 'connected' ? "Manage" : int.status === 'error' ? 'Reconnect' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
