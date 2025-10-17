import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CurrencySettings() {
  const [currencies, setCurrencies] = useState([
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, is_base: true, enabled: true },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, is_base: false, enabled: true },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, is_base: false, enabled: true },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36, is_base: false, enabled: false },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53, is_base: false, enabled: false },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.5, is_base: false, enabled: false },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.2, is_base: false, enabled: false },
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    symbol: '',
    name: '',
    rate: '',
  });

  const [autoUpdate, setAutoUpdate] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState('USD');

  const handleToggleCurrency = (code) => {
    setCurrencies(prev => prev.map(c => 
      c.code === code ? { ...c, enabled: !c.enabled } : c
    ));
  };

  const handleSetBase = (code) => {
    setCurrencies(prev => prev.map(c => ({
      ...c,
      is_base: c.code === code,
    })));
    setBaseCurrency(code);
  };

  const handleUpdateRate = (code, newRate) => {
    setCurrencies(prev => prev.map(c => 
      c.code === code ? { ...c, rate: parseFloat(newRate) } : c
    ));
  };

  const handleAddCurrency = () => {
    if (newCurrency.code && newCurrency.name && newCurrency.rate) {
      setCurrencies(prev => [...prev, {
        ...newCurrency,
        rate: parseFloat(newCurrency.rate),
        is_base: false,
        enabled: true,
      }]);
      setNewCurrency({ code: '', symbol: '', name: '', rate: '' });
      setShowAddDialog(false);
    }
  };

  const formatCurrency = (amount, currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return `${amount}`;
    return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const convertCurrency = (amount, fromCode, toCode) => {
    const from = currencies.find(c => c.code === fromCode);
    const to = currencies.find(c => c.code === toCode);
    if (!from || !to) return amount;
    
    // Convert to base currency first, then to target
    const inBase = amount / from.rate;
    return inBase * to.rate;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Multi-Currency Settings</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage supported currencies and exchange rates</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Currency
        </Button>
      </div>

      {/* Base Currency & Auto-Update */}
      <Card>
        <CardHeader>
          <CardTitle>Base Currency Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Base Currency</Label>
              <Select value={baseCurrency} onValueChange={handleSetBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1">All other rates are relative to this currency</p>
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <Label>Auto-Update Exchange Rates</Label>
                <p className="text-xs text-slate-500">Update rates daily from market data</p>
              </div>
              <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
            </div>
          </div>

          {autoUpdate && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-900 dark:text-blue-300">
                Exchange rates will update automatically at 00:00 UTC daily
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Currency List */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Currencies ({currencies.filter(c => c.enabled).length} Active)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Example</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.code}>
                  <TableCell className="font-medium">
                    {currency.name}
                    {currency.is_base && (
                      <Badge className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        Base
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono">{currency.code}</TableCell>
                  <TableCell className="text-lg">{currency.symbol}</TableCell>
                  <TableCell>
                    {currency.is_base ? (
                      <span className="text-slate-500">1.0000</span>
                    ) : (
                      <Input
                        type="number"
                        step="0.0001"
                        value={currency.rate}
                        onChange={(e) => handleUpdateRate(currency.code, e.target.value)}
                        className="w-32"
                        disabled={autoUpdate}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={currency.enabled}
                      onCheckedChange={() => handleToggleCurrency(currency.code)}
                      disabled={currency.is_base}
                    />
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {formatCurrency(1000, currency.code)}
                  </TableCell>
                  <TableCell>
                    {!currency.is_base && (
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Currency Converter Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label>Amount</Label>
              <Input type="number" placeholder="1000" defaultValue="1000" />
            </div>
            <div>
              <Label>From</Label>
              <Select defaultValue="USD">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {currencies.filter(c => c.enabled).map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>To</Label>
              <Select defaultValue="EUR">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {currencies.filter(c => c.enabled).map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">Result:</p>
            <p className="text-2xl font-bold">{formatCurrency(convertCurrency(1000, 'USD', 'EUR'), 'EUR')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Add Currency Dialog */}
      {showAddDialog && (
        <Dialog open={true} onOpenChange={() => setShowAddDialog(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Currency</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Currency Code *</Label>
                <Input
                  placeholder="e.g., CNY"
                  value={newCurrency.code}
                  onChange={e => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                  maxLength={3}
                />
              </div>
              <div>
                <Label>Currency Name *</Label>
                <Input
                  placeholder="e.g., Chinese Yuan"
                  value={newCurrency.name}
                  onChange={e => setNewCurrency({...newCurrency, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Symbol *</Label>
                <Input
                  placeholder="e.g., ¥"
                  value={newCurrency.symbol}
                  onChange={e => setNewCurrency({...newCurrency, symbol: e.target.value})}
                />
              </div>
              <div>
                <Label>Exchange Rate (vs {baseCurrency}) *</Label>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="e.g., 7.24"
                  value={newCurrency.rate}
                  onChange={e => setNewCurrency({...newCurrency, rate: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddCurrency}>Add Currency</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
