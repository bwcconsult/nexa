import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  List, 
  Zap, 
  Star, 
  Users, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

export default function ContactLists() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New list form state
  const [newList, setNewList] = useState({
    name: '',
    description: '',
    list_type: 'static',
    color: '#3B82F6',
    icon: 'List',
    is_favorite: false,
    is_shared: false,
    tags: []
  });

  useEffect(() => {
    fetchLists();
  }, [filterType]);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact-lists?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setLists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching lists:', error);
      setLists([]);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact-lists`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newList)
        }
      );
      
      if (response.ok) {
        setIsCreateDialogOpen(false);
        fetchLists();
        // Reset form
        setNewList({
          name: '',
          description: '',
          list_type: 'static',
          color: '#3B82F6',
          icon: 'List',
          is_favorite: false,
          is_shared: false,
          tags: []
        });
      }
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const toggleFavorite = async (listId, currentStatus) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/contact-lists/${listId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ is_favorite: !currentStatus })
        }
      );
      fetchLists();
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const deleteList = async (listId) => {
    if (!confirm('Are you sure you want to delete this list?')) return;
    
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/contact-lists/${listId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchLists();
      if (selectedList?.id === listId) setSelectedList(null);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconComponent = (iconName) => {
    const icons = { List, Zap, Users, Star, Filter };
    return icons[iconName] || List;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Lists</h1>
          <p className="text-muted-foreground mt-1">
            Save filtered contact views and create targeted segments
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create List
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
              <DialogDescription>
                Create a static list or dynamic segment for your contacts
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">List Name</Label>
                <Input
                  id="name"
                  value={newList.name}
                  onChange={(e) => setNewList({...newList, name: e.target.value})}
                  placeholder="e.g., High-Value Leads"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newList.description}
                  onChange={(e) => setNewList({...newList, description: e.target.value})}
                  placeholder="What is this list for?"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">List Type</Label>
                <Select 
                  value={newList.list_type}
                  onValueChange={(value) => setNewList({...newList, list_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">
                      <div className="flex flex-col items-start">
                        <div className="font-medium">Static List</div>
                        <div className="text-xs text-muted-foreground">
                          Manually add/remove contacts
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="dynamic">
                      <div className="flex flex-col items-start">
                        <div className="font-medium">Dynamic List</div>
                        <div className="text-xs text-muted-foreground">
                          Auto-updates based on criteria
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="shared"
                  checked={newList.is_shared}
                  onChange={(e) => setNewList({...newList, is_shared: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="shared" className="cursor-pointer">
                  Share with team
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createList} disabled={!newList.name}>
                Create List
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lists.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Static Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lists.filter(l => l.list_type === 'static').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Dynamic Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lists.filter(l => l.list_type === 'dynamic').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lists.filter(l => l.is_favorite).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs value={filterType} onValueChange={setFilterType} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="static">Static</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lists Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading lists...
        </div>
      ) : filteredLists.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <List className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No lists yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first contact list to get started
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create List
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLists.map((list, index) => {
            const IconComponent = getIconComponent(list.icon);
            return (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-shadow cursor-pointer relative"
                  onClick={() => setSelectedList(list)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${list.color}20`, color: list.color }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(list.id, list.is_favorite);
                          }}
                        >
                          <Star 
                            className={`w-4 h-4 ${list.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                          />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              setSelectedList(list);
                            }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            {list.list_type === 'dynamic' && (
                              <DropdownMenuItem>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh Count
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteList(list.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      {list.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {list.description}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {list.contact_count || 0} contacts
                        </span>
                      </div>
                      
                      <Badge variant={list.list_type === 'dynamic' ? 'default' : 'secondary'}>
                        {list.list_type === 'dynamic' ? (
                          <><Zap className="w-3 h-3 mr-1" /> Dynamic</>
                        ) : (
                          <><List className="w-3 h-3 mr-1" /> Static</>
                        )}
                      </Badge>
                    </div>
                    
                    {list.is_shared && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Share2 className="w-3 h-3" />
                        Shared with team
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
