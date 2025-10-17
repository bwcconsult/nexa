import React, { useState, useEffect } from "react";
import { User, Deal, Contact, Activity } from "@/api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Phone, Briefcase } from "lucide-react";

const StatCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</CardTitle>
      <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ActivityList = ({ title, activities }) => (
  <Card className="col-span-1 md:col-span-2">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
       <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3">Subject</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Due Date</th>
              <th scope="col" className="px-6 py-3 hidden lg:table-cell">Priority</th>
              <th scope="col" className="px-6 py-3">Contact</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{activity.title}</td>
                <td className="px-6 py-4 hidden md:table-cell">{new Date(activity.due_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 hidden lg:table-cell">{activity.priority}</td>
                <td className="px-6 py-4">{activity.contact_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ openDeals: 0, newLeads: 0, callsToday: 0, untouchedDeals: 0 });
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userData, dealsData, contactsData, activitiesData] = await Promise.all([
          User.me(),
          Deal.list(),
          Contact.filter({ status: "lead" }),
          Activity.list("-due_date")
        ]);
        
        setUser(userData);
        
        const openDeals = dealsData.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
        setStats({
          openDeals: openDeals.length,
          newLeads: contactsData.length,
          callsToday: 0, // Placeholder
          untouchedDeals: 0 // Placeholder
        });

        setTasks(activitiesData.filter(a => a.type === 'task' && !a.completed).slice(0, 5));
        setMeetings(activitiesData.filter(a => a.type === 'meeting').slice(0, 5));

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user ? user.full_name.split(' ')[0] : 'User'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Open Deals" value={stats.openDeals} icon={Briefcase} />
        <StatCard title="New Leads" value={stats.newLeads} icon={Users} />
        <StatCard title="Calls Today" value={stats.callsToday} icon={Phone} />
        <StatCard title="Untouched Deals" value={stats.untouchedDeals} icon={Target} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <ActivityList title="My Open Tasks" activities={tasks} />
         <ActivityList title="My Meetings" activities={meetings} />
      </div>
    </div>
  );
}