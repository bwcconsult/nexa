
import React, { useState, useEffect } from "react";
import { Order } from "@/api/apiClient";
import { Plus, Search, Filter, Download, ShoppingCart, MoreVertical, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import OrderForm from "../components/orders/OrderForm";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await Order.list("-order_date");
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOrder = async (orderData) => {
    try {
      if (selectedOrder) {
        await Order.update(selectedOrder.id, orderData);
      } else {
        await Order.create(orderData);
      }
      await loadOrders();
      setShowForm(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowForm(true);
  };

  const filteredOrders = orders.filter(o =>
    searchTerm === "" ||
    o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };
    return <Badge className={`${statusStyles[status] || 'bg-slate-100 text-slate-800'} capitalize`}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track and fulfill customer orders.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> New Order
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search orders by ID, customer..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                : filteredOrders.map((order) => (
                    <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <TableCell className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{order.order_number}</TableCell>
                      <TableCell>{format(new Date(order.order_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{order.customer_email}</TableCell>
                      <TableCell>${order.total_amount?.toFixed(2)}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{order.source}</Badge></TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><FileText className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditOrder(order)}><Edit className="w-4 h-4 mr-2" />Edit Status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <OrderForm
          order={selectedOrder}
          onSave={handleSaveOrder}
          onCancel={() => {
            setShowForm(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
