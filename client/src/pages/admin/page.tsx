import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  Search, UserPlus, RefreshCw, CheckCircle, AlertTriangle, Settings, 
  UserCog, Database, Shield, Eye, Edit, Trash, Lock, Activity,
  Clock, ArrowUpDown, FilterX, Save, AlertCircle, FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock users data
const users = [
  {
    id: 'USR-1001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    department: 'IT',
    status: 'active',
    lastLogin: '2023-10-15T08:23:44',
    createdAt: '2022-01-10T10:00:00'
  },
  {
    id: 'USR-1002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Manager',
    department: 'Security',
    status: 'active',
    lastLogin: '2023-10-14T16:52:38',
    createdAt: '2022-02-15T09:30:00'
  },
  {
    id: 'USR-1003',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'Operator',
    department: 'Traffic Control',
    status: 'inactive',
    lastLogin: '2023-09-30T14:12:33',
    createdAt: '2022-03-22T14:45:00'
  },
  {
    id: 'USR-1004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'Analyst',
    department: 'Safety',
    status: 'active',
    lastLogin: '2023-10-13T11:45:00',
    createdAt: '2022-04-05T11:15:00'
  },
  {
    id: 'USR-1005',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    role: 'Operator',
    department: 'Security',
    status: 'active',
    lastLogin: '2023-10-12T09:34:21',
    createdAt: '2022-05-18T16:20:00'
  }
];

// Mock system logs
const systemLogs = [
  {
    id: 'LOG-1001',
    event: 'User Login',
    user: 'john.smith@example.com',
    status: 'success',
    timestamp: '2023-10-15T08:23:44',
    ipAddress: '192.168.1.1',
    details: 'Successfully authenticated'
  },
  {
    id: 'LOG-1002',
    event: 'User Permission Changed',
    user: 'admin@example.com',
    status: 'success',
    timestamp: '2023-10-14T16:52:38',
    ipAddress: '192.168.1.10',
    details: 'Changed permissions for sarah.johnson@example.com'
  },
  {
    id: 'LOG-1003',
    event: 'Failed Login Attempt',
    user: 'michael.brown@example.com',
    status: 'error',
    timestamp: '2023-10-14T15:30:22',
    ipAddress: '192.168.1.5',
    details: 'Invalid password provided'
  },
  {
    id: 'LOG-1004',
    event: 'System Configuration Changed',
    user: 'admin@example.com',
    status: 'success',
    timestamp: '2023-10-13T11:45:00',
    ipAddress: '192.168.1.10',
    details: 'Updated notification settings'
  },
  {
    id: 'LOG-1005',
    event: 'Database Backup',
    user: 'system',
    status: 'success',
    timestamp: '2023-10-12T03:00:00',
    ipAddress: 'localhost',
    details: 'Automated daily backup completed'
  },
  {
    id: 'LOG-1006',
    event: 'User Account Created',
    user: 'admin@example.com',
    status: 'success',
    timestamp: '2023-10-11T14:22:18',
    ipAddress: '192.168.1.10',
    details: 'Created account for robert.wilson@example.com'
  },
  {
    id: 'LOG-1007',
    event: 'API Rate Limit Exceeded',
    user: 'emily.davis@example.com',
    status: 'warning',
    timestamp: '2023-10-10T16:30:00',
    ipAddress: '192.168.1.8',
    details: 'Rate limit of 100 requests per minute exceeded'
  }
];

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Status badge classes
const statusBadgeClasses: Record<string, string> = {
  'active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'suspended': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  'success': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  'error': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  'warning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
};

const AdminPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [activeTab, setActiveTab] = useState<string>('users');
  const [logFilter, setLogFilter] = useState<string>('all');
  const { toast } = useToast();

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter logs based on type filter
  const filteredLogs = systemLogs.filter(log => 
    logFilter === 'all' || log.status === logFilter
  );

  // Handle user row click
  const handleUserClick = (user: typeof users[0]) => {
    setSelectedUser(user);
  };

  // Handle user actions
  const handleUserAction = (action: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'edit':
        toast({
          title: "Edit User",
          description: `Editing user ${user.name}`
        });
        break;
      case 'delete':
        toast({
          title: "Delete User",
          description: `User ${user.name} will be deleted`,
          variant: "destructive"
        });
        break;
      case 'resetPassword':
        toast({
          title: "Reset Password",
          description: `Password reset email sent to ${user.email}`
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          System Settings
        </Button>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Configuration</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search users by name, email, role..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Users</CardTitle>
                  <CardDescription>
                    {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="hidden md:table-cell">Department</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map(user => (
                          <TableRow 
                            key={user.id}
                            className={`cursor-pointer ${selectedUser?.id === user.id ? 'bg-muted/50' : ''}`}
                            onClick={() => handleUserClick(user)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`} />
                                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="hidden md:table-cell">{user.department}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge 
                                variant="outline" 
                                className={statusBadgeClasses[user.status]}
                              >
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" onClick={() => handleUserAction('edit', user.id)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleUserAction('resetPassword', user.id)}>
                                  <Lock className="h-4 w-4" />
                                  <span className="sr-only">Reset Password</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleUserAction('delete', user.id)}>
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-1/3">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                  <CardDescription>
                    {selectedUser ? `Details for ${selectedUser.name}` : 'Select a user to view details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedUser ? (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${selectedUser.name.replace(' ', '+')}&background=random&size=100`} />
                          <AvatarFallback className="text-2xl">{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Role</p>
                          <p className="font-medium">{selectedUser.role}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-medium">{selectedUser.department}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge 
                            variant="outline" 
                            className={statusBadgeClasses[selectedUser.status]}
                          >
                            {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">User ID</p>
                          <p className="font-medium">{selectedUser.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Created On</p>
                          <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Login</p>
                          <p className="font-medium">{formatDate(selectedUser.lastLogin)}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Permissions</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label htmlFor="view-dashboard" className="text-sm">View Dashboard</label>
                            <Switch id="view-dashboard" checked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="manage-vehicles" className="text-sm">Manage Vehicles</label>
                            <Switch id="manage-vehicles" checked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="manage-alerts" className="text-sm">Manage Alerts</label>
                            <Switch id="manage-alerts" checked={selectedUser.role !== 'Operator'} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="generate-reports" className="text-sm">Generate Reports</label>
                            <Switch id="generate-reports" checked={selectedUser.role !== 'Operator'} />
                          </div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="admin-access" className="text-sm">Admin Access</label>
                            <Switch id="admin-access" checked={selectedUser.role === 'Admin'} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <UserCog className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No user selected</h3>
                      <p className="text-sm text-muted-foreground">
                        Select a user from the list to view detailed information
                      </p>
                    </div>
                  )}
                </CardContent>
                {selectedUser && (
                  <CardFooter className="flex justify-between border-t p-4">
                    <Button variant="outline" onClick={() => handleUserAction('resetPassword', selectedUser.id)}>
                      <Lock className="h-4 w-4 mr-2" />
                      Reset Password
                    </Button>
                    <Button onClick={() => handleUserAction('edit', selectedUser.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Two-Factor Authentication</label>
                      <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Password Expiry</label>
                      <p className="text-xs text-muted-foreground">Require password change every 90 days</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Session Timeout</label>
                      <p className="text-xs text-muted-foreground">Inactive users are logged out</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">60 min</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database & Storage
                </CardTitle>
                <CardDescription>Manage database and storage settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Automatic Backups</label>
                      <p className="text-xs text-muted-foreground">Scheduled database backups</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Backup Frequency</label>
                      <p className="text-xs text-muted-foreground">How often to create backups</p>
                    </div>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Data Retention</label>
                      <p className="text-xs text-muted-foreground">How long to keep records</p>
                    </div>
                    <Select defaultValue="365">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Storage Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  System Performance
                </CardTitle>
                <CardDescription>Monitor and optimize system performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>CPU Usage</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[32%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Memory Usage</span>
                      <span className="font-medium">64%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[64%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Storage Usage</span>
                      <span className="font-medium">48%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[48%] rounded-full"></div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>System Uptime</span>
                      <span className="font-medium">12 days, 4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Restart</span>
                      <span className="font-medium">Oct 3, 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stats
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure system notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">Send alerts via email</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">System Alerts</label>
                      <p className="text-xs text-muted-foreground">Critical system notifications</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">User Activity Reports</label>
                      <p className="text-xs text-muted-foreground">Weekly summary of system usage</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* System Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search logs..."
                className="pl-8"
              />
            </div>
            <Select value={logFilter} onValueChange={setLogFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-[42px] p-0">
              <FilterX className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-[42px] p-0">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                Recent system activity and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredLogs.map(log => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{log.event}</h3>
                          <p className="text-sm text-muted-foreground">{log.user}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={statusBadgeClasses[log.status]}
                        >
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{formatDate(log.timestamp)}</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{log.ipAddress}</span>
                        </div>
                      </div>
                      {log.details && (
                        <div className="mt-2 pt-2 border-t text-sm">
                          {log.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View All Logs
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage; 