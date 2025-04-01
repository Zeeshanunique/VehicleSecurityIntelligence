import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { SquareStack, UserCircle2, Car, Bell, AlertTriangle, ShieldAlert, Camera, Search } from 'lucide-react';

// Example data - would be replaced with API calls
const statsData = [
  { name: 'Total Vehicles', value: 3421, icon: <Car className="h-5 w-5" /> },
  { name: 'Active Alerts', value: 28, icon: <Bell className="h-5 w-5" />, status: 'warning' },
  { name: 'Stolen Vehicles', value: 12, icon: <ShieldAlert className="h-5 w-5" />, status: 'destructive' },
  { name: 'Recent Accidents', value: 8, icon: <AlertTriangle className="h-5 w-5" />, status: 'destructive' },
];

const vehicleTypeData = [
  { name: 'Cars', value: 1850 },
  { name: 'Motorcycles', value: 820 },
  { name: 'Trucks', value: 450 },
  { name: 'Buses', value: 180 },
  { name: 'Emergency', value: 90 },
  { name: 'Taxis', value: 31 },
];

const weeklyIncidentData = [
  { day: 'Mon', accidents: 2, alerts: 5, stolen: 1 },
  { day: 'Tue', accidents: 1, alerts: 3, stolen: 0 },
  { day: 'Wed', accidents: 0, alerts: 6, stolen: 2 },
  { day: 'Thu', accidents: 3, alerts: 4, stolen: 1 },
  { day: 'Fri', accidents: 2, alerts: 7, stolen: 3 },
  { day: 'Sat', accidents: 1, alerts: 2, stolen: 1 },
  { day: 'Sun', accidents: 0, alerts: 1, stolen: 0 },
];

const recentAlerts = [
  { id: 'A1', type: 'Stolen Vehicle', location: 'Main St & 5th Ave', time: '5 mins ago', plate: 'ABC 123', severity: 'high' },
  { id: 'A2', type: 'Accident', location: 'Highway 101, Mile 28', time: '15 mins ago', severity: 'critical' },
  { id: 'A3', type: 'Wanted Person', location: 'Central Mall CCTV #3', time: '28 mins ago', severity: 'high' },
  { id: 'A4', type: 'Traffic Violation', location: 'Downtown Junction', time: '42 mins ago', plate: 'XYZ 789', severity: 'medium' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a785e7', '#e78594'];

const StatCard = ({ title, value, icon, status }: { title: string; value: number; icon: React.ReactNode; status?: string }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {status && (
          <Badge variant={status as "default" | "destructive" | "outline" | "secondary" | "warning"} className="mt-1">
            {status === 'warning' ? 'Needs Attention' : 'Critical'}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

const LiveFeed = () => (
  <Card className="col-span-3">
    <CardHeader>
      <CardTitle>Live Incident Feed</CardTitle>
      <CardDescription>Real-time alerts and notifications</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {recentAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-3">
            <div className={`rounded-full p-2 ${
              alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 
              alert.severity === 'high' ? 'bg-orange-100 text-orange-600' : 
              'bg-yellow-100 text-yellow-600'
            }`}>
              {alert.type.includes('Stolen') ? <Car className="h-5 w-5" /> : 
               alert.type.includes('Accident') ? <AlertTriangle className="h-5 w-5" /> :
               alert.type.includes('Wanted') ? <UserCircle2 className="h-5 w-5" /> :
               <Bell className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{alert.type}</h4>
              <div className="text-sm text-muted-foreground">{alert.location}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{alert.time}</span>
                {alert.plate && (
                  <Badge variant="outline" className="text-xs">
                    {alert.plate}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">Details</Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
      <CardDescription>Frequently used tools</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-20 flex flex-col gap-1">
          <Camera className="h-5 w-5" />
          <span>Scan Plate</span>
        </Button>
        <Button className="h-20 flex flex-col gap-1">
          <UserCircle2 className="h-5 w-5" />
          <span>Face Scan</span>
        </Button>
        <Button className="h-20 flex flex-col gap-1" variant="outline">
          <Search className="h-5 w-5" />
          <span>Search Vehicle</span>
        </Button>
        <Button className="h-20 flex flex-col gap-1" variant="outline">
          <Bell className="h-5 w-5" />
          <span>All Alerts</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <SquareStack className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button size="sm">
            <Bell className="mr-2 h-4 w-4" />
            View All Alerts
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat) => (
              <StatCard 
                key={stat.name} 
                title={stat.name} 
                value={stat.value} 
                icon={stat.icon} 
                status={stat.status}
              />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <LiveFeed />
            <div className="md:col-span-1 lg:col-span-2">
              <QuickActions />
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Vehicle Distribution</CardTitle>
                  <CardDescription>By type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vehicleTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {vehicleTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Incident Trends</CardTitle>
              <CardDescription>Accidents, alerts, and stolen vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyIncidentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accidents" name="Accidents" fill="#FF8042" />
                    <Bar dataKey="alerts" name="Alerts" fill="#FFBB28" />
                    <Bar dataKey="stolen" name="Stolen Vehicles" fill="#FF0000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Analysis</CardTitle>
              <CardDescription>Coming Soon - Detailed vehicle analytics</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                Vehicle analysis dashboard will be implemented here.
                <br />
                This will include traffic patterns, vehicle type distributions, and more.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incident Analysis</CardTitle>
              <CardDescription>Coming Soon - Incident tracking and analysis</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                Incident analysis dashboard will be implemented here.
                <br />
                This will include accident hotspots, crime patterns, and response metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard; 