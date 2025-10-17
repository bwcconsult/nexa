import React, { useState, useEffect } from "react";
import { Customer } from "@/api/apiClient";
import { Plus, Search, Filter, Download, Users, Mail, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

import CustomerTable from "../components/customers/CustomerTable";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerFilters from "../components/customers/CustomerFilters";
import CustomerStats from "../components/customers/CustomerStats";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    source: "all",
    tier: "all"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, filters]);

  const loadCustomers = async () => {
    try {
      const data = await Customer.list("-created_date");
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(customer => customer.status === filters.status);
    }

    // Source filter
    if (filters.source !== "all") {
      filtered = filtered.filter(customer => customer.source === filters.source);
    }

    // Tier filter
    if (filters.tier !== "all") {
      filtered = filtered.filter(customer => {
        const lifetimeValue = customer.lifetime_value || 0;
        if (filters.tier === "vip") return lifetimeValue >= 5000;
        if (filters.tier === "premium") return lifetimeValue >= 1000 && lifetimeValue < 5000;
        if (filters.tier === "regular") return lifetimeValue < 1000;
        return true;
      });
    }

    setFilteredCustomers(filtered);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (selectedCustomer) {
        await Customer.update(selectedCustomer.id, customerData);
      } else {
        await Customer.create(customerData);
      }
      await loadCustomers();
      setShowForm(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const exportCustomers = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Status", "Source", "Lifetime Value", "Total Orders"],
      ...filteredCustomers.map(customer => [
        `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        customer.email,
        customer.phone || '',
        customer.company || '',
        customer.status,
        customer.source || '',
        customer.lifetime_value || 0,
        customer.total_orders || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Customer Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your customer relationships and track their journey
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportCustomers} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CustomerStats customers={customers} />

      {/* Search and Filters */}
      <Card className="glass-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search customers by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20 focus:bg-white/80"
              />
            </div>
            <CustomerFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        onEditCustomer={handleEditCustomer}
        isLoading={isLoading}
      />

      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customer={selectedCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => {
            setShowForm(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}