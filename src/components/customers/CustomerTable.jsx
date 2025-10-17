import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerTable({ customers, onEditCustomer, isLoading }) {
  const getTierBadge = (lifetimeValue = 0) => {
    if (lifetimeValue >= 5000) return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">VIP</Badge>;
    if (lifetimeValue >= 1000) return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Premium</Badge>;
    return <Badge variant="secondary">Regular</Badge>;
  };

  const getStatusBadge = (status) => {
    const styles = {
      lead: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      prospect: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      customer: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      vip: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
      churned: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };
    return <Badge className={`${styles[status] || 'bg-slate-100 text-slate-800'} capitalize`}>{status}</Badge>;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>LTV</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                No customers found. Create your first customer to get started.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <motion.tr
                key={customer.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {(customer.first_name?.[0] || customer.email?.[0] || '?').toUpperCase()}
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => onEditCustomer(customer)}>
                      {customer.first_name} {customer.last_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">{customer.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{customer.company || '-'}</TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell>{getTierBadge(customer.lifetime_value)}</TableCell>
                <TableCell>${(customer.lifetime_value || 0).toFixed(2)}</TableCell>
                <TableCell>{customer.total_orders || 0}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditCustomer(customer)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
