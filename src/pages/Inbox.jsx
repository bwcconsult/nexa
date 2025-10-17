import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Inbox as InboxIcon, 
  Mail, 
  MessageSquare, 
  Phone, 
  Facebook,
  Send,
  User,
  Clock,
  CheckCheck,
  AlertCircle,
  ArrowLeft,
  MoreVertical,
  Archive,
  Trash2,
  Tag,
  Star
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

export default function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchConversations();
  }, [filterStatus]);

  useEffect(() => {
    if (selectedConversation) {
      fetchConversationDetails(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/conversations/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/conversations?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/conversations/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setMessages(data.messages || []);
      
      // Mark as read
      if (!data.is_read) {
        await fetch(
          `${import.meta.env.VITE_API_URL}/conversations/${id}/mark-read`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ is_read: true })
          }
        );
        fetchStats();
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;
    
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/conversations/${selectedConversation.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            body_text: replyText,
            direction: 'outbound',
            is_internal_note: isInternalNote
          })
        }
      );
      
      setReplyText('');
      setIsInternalNote(false);
      fetchConversationDetails(selectedConversation.id);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const updateConversationStatus = async (status) => {
    if (!selectedConversation) return;
    
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/conversations/${selectedConversation.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status })
        }
      );
      
      fetchConversations();
      setSelectedConversation(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getChannelIcon = (channel) => {
    const icons = {
      email: Mail,
      chat: MessageSquare,
      phone: Phone,
      social: Facebook,
      sms: MessageSquare,
      form: InboxIcon
    };
    const Icon = icons[channel] || InboxIcon;
    return <Icon className="w-4 h-4" />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar - Conversation List */}
      <div className="w-96 border-r flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Inbox</h2>
            <Badge variant="secondary">{stats.total || 0}</Badge>
          </div>
          
          <Tabs value={filterStatus} onValueChange={setFilterStatus}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">{stats.total || 0}</Badge>
              </TabsTrigger>
              <TabsTrigger value="open">
                Open
                <Badge variant="secondary" className="ml-2">{stats.open || 0}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <Badge variant="secondary" className="ml-2">{stats.pending || 0}</Badge>
              </TabsTrigger>
              <TabsTrigger value="closed">
                Closed
                <Badge variant="secondary" className="ml-2">{stats.closed || 0}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-accent' : ''
                  } ${!conv.is_read ? 'font-semibold' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(conv.channel)}
                      <span className="text-sm truncate max-w-[200px]">
                        {conv.subject}
                      </span>
                    </div>
                    {!conv.is_read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground truncate mb-2">
                    {conv.last_message_from}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(conv.priority)} variant="secondary">
                        {conv.priority}
                      </Badge>
                      <Badge className={getStatusColor(conv.status)} variant="secondary">
                        {conv.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Conversation Details */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <div>
                  <h2 className="font-semibold">{selectedConversation.subject}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getChannelIcon(selectedConversation.channel)}
                    <span>{selectedConversation.channel}</span>
                    <span>•</span>
                    <span>{selectedConversation.message_count} messages</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select 
                  value={selectedConversation.status}
                  onValueChange={updateConversationStatus}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Tag className="w-4 h-4 mr-2" />
                      Add Tag
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="w-4 h-4 mr-2" />
                      Star
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card className={`max-w-[70%] ${
                    message.is_internal_note ? 'bg-yellow-50 border-yellow-200' : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {message.from_name || 'Unknown'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.sent_at || message.created_at).toLocaleString()}
                        </span>
                      </div>
                      {message.is_internal_note && (
                        <Badge variant="secondary" className="w-fit">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Internal Note
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{message.body_text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t space-y-3">
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="internal-note"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="internal-note" className="text-sm cursor-pointer">
                    Internal note (team only)
                  </label>
                </div>
                
                <Button onClick={sendReply} disabled={!replyText.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <InboxIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
