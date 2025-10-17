
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, User, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ContactTable({ contacts, onEditContact, onViewProfile, isLoading }) {
  const getTierBadge = (lifetimeValue) => {
    if (lifetimeValue >= 5000) return <Badge className="bg-yellow-100 text-yellow-800">VIP</Badge>;
    if (lifetimeValue >= 1000) return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
    return <Badge variant="secondary">Regular</Badge>;
  };

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lead Score</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : contacts.map(contact => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-slate-50/50 cursor-pointer"
                onClick={() => onViewProfile(contact)}
              >
                <TableCell className="font-medium">
                  {contact.first_name && contact.last_name ? `${contact.first_name} ${contact.last_name}` : 'N/A'}
                </TableCell>
                <TableCell className="text-slate-500">{contact.email}</TableCell>
                <TableCell>{contact.company || 'N/A'}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{contact.status}</Badge></TableCell>
                <TableCell className="font-bold">{contact.lead_score || 0}</TableCell>
                <TableCell>{getTierBadge(contact.lifetime_value || 0)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewProfile(contact); }}><User className="w-4 h-4 mr-2" />View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditContact(contact); }}><Edit className="w-4 h-4 mr-2" />Edit Contact</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
