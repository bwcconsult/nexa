import React, { useState, useEffect } from "react";
import { Task, Contact, Account } from "@/api/apiClient";
import { Plus, Filter, Search, X, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { format } from "date-fns";

import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";

const TASK_STATUSES = [
  { id: "Not Started", name: "Not Started" },
  { id: "Deferred", name: "Deferred" },
  { id: "In Progress", name: "In Progress" },
  { id: "Completed", name: "Completed" },
  { id: "Waiting on someone else", name: "Waiting on someone else" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [systemFilters, setSystemFilters] = useState({
    touched_records: false,
    untouched_records: false,
    record_action: false,
    related_records_action: false,
    locked: false,
  });

  const [fieldFilters, setFieldFilters] = useState({
    closed_time: false,
    contact_name: false,
    created_by: false,
    created_time: false,
    due_date: false,
    last_activity_time: false,
    modified_by: false,
    modified_time: false,
    priority: false,
    related_to: false,
    status: false,
    subject: false,
    tag: false,
    task_owner: false,
  });
  
  const [relatedModuleFilters, setRelatedModuleFilters] = useState({
    notes: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, contactsData, accountsData] = await Promise.all([
        Activity.filter({ type: "task" }, "-due_date"),
        Contact.list(),
        Account.list(),
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
    }
    
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;
    const updatedTask = { ...task, status: newStatus };

    setTasks(prevTasks => prevTasks.map(t => t.id === draggableId ? updatedTask : t));

    try {
      await Activity.update(draggableId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
      loadData(); // Revert on error
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await Activity.update(selectedTask.id, taskData);
      } else {
        await Activity.create({ ...taskData, type: "task" });
      }
      await loadData();
      setShowForm(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => 
      task.status === status &&
      (searchTerm === "" || task.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  const getRelatedName = (task) => {
    if (task.contact_id) {
        const contact = contacts.find(c => c.id === task.contact_id);
        return contact ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() : "Unknown Contact";
    }
    if (task.account_id) {
        const account = accounts.find(a => a.id === task.account_id);
        return account ? account.name : "Unknown Account";
    }
    return "";
  };


  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Filters Sidebar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="flex-shrink-0 h-full overflow-y-auto">
            <Card className="h-full">
              <CardHeader className="pb-4 sticky top-0 bg-white dark:bg-slate-950 z-10">
                <CardTitle className="text-lg flex items-center justify-between">
                  Filter Tasks by
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">System Defined Filters</h3>
                  <div className="space-y-2">
                    {Object.entries(systemFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`sys_${key}`} checked={checked} onCheckedChange={(value) => setSystemFilters(prev => ({...prev, [key]: value}))} />
                        <label htmlFor={`sys_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Filter By Fields</h3>
                  <div className="space-y-2">
                    {Object.entries(fieldFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`field_${key}`} checked={checked} onCheckedChange={(value) => setFieldFilters(prev => ({...prev, [key]: value}))} />
                        <label htmlFor={`field_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Filter By Related Modules</h3>
                  <div className="space-y-2">
                    {Object.entries(relatedModuleFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox id={`related_${key}`} checked={checked} onCheckedChange={(value) => setRelatedModuleFilters(prev => ({...prev, [key]: value}))} />
                        <label htmlFor={`related_${key}`} className="text-sm capitalize cursor-pointer">{key.replace(/_/g, ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            {!showFilters && <Button variant="outline" size="icon" onClick={() => setShowFilters(true)}><Filter className="w-4 h-4" /></Button>}
            <h1 className="text-2xl font-bold">All Tasks</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">Sort By <ArrowUpDown className="w-4 h-4" /></Button>
            <Button onClick={() => { setSelectedTask(null); setShowForm(true); }} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Create Task
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline">Actions <ChevronDown className="w-4 h-4 ml-2"/></Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Mass Update</DropdownMenuItem>
                <DropdownMenuItem>Mass Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 flex-1">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full">
              {TASK_STATUSES.map(status => {
                const statusTasks = getTasksByStatus(status.id);
                return (
                  <div key={status.id} className="w-80 flex-shrink-0 flex flex-col">
                    <div className="p-3 rounded-t-lg">
                      <h3 className="font-semibold text-sm">{status.name} <Badge variant="secondary" className="text-xs">{statusTasks.length}</Badge></h3>
                    </div>
                    <Droppable droppableId={status.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-b-lg transition-colors overflow-y-auto ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                          <div className="space-y-3">
                            {statusTasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <TaskCard 
                                      task={task} 
                                      relatedName={getRelatedName(task)}
                                      onClick={() => { setSelectedTask(task); setShowForm(true); }}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </div>

      {showForm && (
        <TaskForm
          task={selectedTask}
          contacts={contacts}
          accounts={accounts}
          onSave={handleSaveTask}
          onCancel={() => { setShowForm(false); setSelectedTask(null); }}
        />
      )}
    </div>
  );
}