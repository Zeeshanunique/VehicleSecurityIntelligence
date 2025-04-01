import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Car, UserCircle, AlertTriangle, Calendar, Clock, MapPin, Filter, Search, Eye, FileText, MapIcon } from 'lucide-react';

// Mock data for alerts
const alerts = [
  { 
    id: 'ALT-1001', 
    type: 'stolen-vehicle', 
    status: 'active', 
    priority: 'high',
    timestamp: '2023-10-15T08:23:44', 
    location: 'Main St & 5th Ave',
    coordinates: [73.8567, 18.5204],
    details: {
      vehicle: {
        plate: 'MH 01 AB 1234',
        make: 'Toyota',
        model: 'Fortuner',
        color: 'White',
        year: '2019'
      }
    }
  },
  { 
    id: 'ALT-1002', 
    type: 'wanted-person', 
    status: 'active', 
    priority: 'critical',
    timestamp: '2023-10-15T09:45:12', 
    location: 'Central Mall CCTV #3',
    coordinates: [73.8731, 18.5314],
    details: {
      person: {
        name: 'John Smith',
        age: '35',
        gender: 'Male',
        warrants: 2,
        reason: 'Armed Robbery'
      }
    }
  },
  { 
    id: 'ALT-1003', 
    type: 'accident', 
    status: 'active', 
    priority: 'high',
    timestamp: '2023-10-15T10:12:33', 
    location: 'Highway 101, Mile 28',
    coordinates: [73.9023, 18.4931],
    details: {
      severity: 'Major',
      vehicles: 2,
      injuries: 'Yes',
      emergencyDispatch: true
    }
  },
  { 
    id: 'ALT-1004', 
    type: 'traffic-violation', 
    status: 'pending', 
    priority: 'medium',
    timestamp: '2023-10-15T11:32:08', 
    location: 'Downtown Junction',
    coordinates: [73.8856, 18.5089],
    details: {
      vehicle: {
        plate: 'XYZ 789',
        make: 'Honda',
        model: 'City',
        color: 'Silver',
        year: '2020'
      },
      violation: 'Red Light',
      speed: '65 km/h',
      speedLimit: '50 km/h'
    }
  },
  { 
    id: 'ALT-1005', 
    type: 'stolen-vehicle', 
    status: 'resolved', 
    priority: 'high',
    timestamp: '2023-10-14T14:22:18', 
    location: 'East Side Mall Parking',
    coordinates: [73.9112, 18.5341],
    details: {
      vehicle: {
        plate: 'PQR 456',
        make: 'Hyundai',
        model: 'Creta',
        color: 'Black',
        year: '2021'
      },
      resolved: {
        time: '2023-10-15T08:15:22',
        officer: 'Officer Blake, ID#5482',
        notes: 'Vehicle recovered intact. Suspect apprehended.'
      }
    }
  }
];

// Alert icon mapping based on type
const alertTypeIcons: Record<string, React.ReactNode> = {
  'stolen-vehicle': <Car className="h-5 w-5" />,
  'wanted-person': <UserCircle className="h-5 w-5" />,
  'accident': <AlertTriangle className="h-5 w-5" />,
  'traffic-violation': <Bell className="h-5 w-5" />
};

// Alert type display names
const alertTypeNames: Record<string, string> = {
  'stolen-vehicle': 'Stolen Vehicle',
  'wanted-person': 'Wanted Person',
  'accident': 'Accident',
  'traffic-violation': 'Traffic Violation'
};

// Color classes for priority badges
const priorityClasses: Record<string, string> = {
  'low': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  'critical': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
};

// Status display classes
const statusClasses: Record<string, string> = {
  'active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  'pending': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'resolved': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
};

// Format date string to readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Alert list item component
const AlertItem = ({ alert, onClick }: { alert: typeof alerts[0]; onClick: () => void }) => {
  return (
    <div 
      className={`border rounded-lg p-4 mb-3 cursor-pointer hover:bg-muted/50 transition-colors ${alert.status === 'resolved' ? 'opacity-70' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 flex-shrink-0 ${
          alert.priority === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
          alert.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 
          'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
        }`}>
          {alertTypeIcons[alert.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-base font-medium truncate">
              {alertTypeNames[alert.type]}
            </h4>
            <Badge variant="outline" className={priorityClasses[alert.priority]}>
              {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            ID: {alert.id}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{alert.location}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{formatDate(alert.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 pt-2 border-t">
        <Badge variant="secondary" className={statusClasses[alert.status]}>
          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
        </Badge>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}>
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </div>
    </div>
  );
};

const AlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter alerts based on type tab and filters
  const filteredAlerts = alerts.filter(alert => {
    // Filter by alert type (tab)
    if (activeTab !== 'all' && alert.type !== activeTab) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && alert.status !== statusFilter) {
      return false;
    }
    
    // Filter by priority
    if (priorityFilter !== 'all' && alert.priority !== priorityFilter) {
      return false;
    }
    
    // Search by ID, location or details
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.id.toLowerCase().includes(query) || 
        alert.location.toLowerCase().includes(query) ||
        (alert.type === 'stolen-vehicle' && alert.details.vehicle.plate.toLowerCase().includes(query)) ||
        (alert.type === 'wanted-person' && alert.details.person.name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Handle alert selection
  const handleAlertClick = (alert: typeof alerts[0]) => {
    setSelectedAlert(alert);
  };

  // Alert details component based on type
  const renderAlertDetails = () => {
    if (!selectedAlert) return null;
    
    if (selectedAlert.type === 'stolen-vehicle') {
      const vehicle = selectedAlert.details.vehicle;
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-1">{alertTypeNames[selectedAlert.type]}</h3>
            <Badge variant="outline" className={priorityClasses[selectedAlert.priority]}>
              {selectedAlert.priority.charAt(0).toUpperCase() + selectedAlert.priority.slice(1)} Priority
            </Badge>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-3">Vehicle Information</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <p className="text-sm text-muted-foreground">License Plate</p>
                <p className="font-medium">{vehicle.plate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Make</p>
                <p className="font-medium">{vehicle.make}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{vehicle.year}</p>
              </div>
            </div>
          </div>

          {'resolved' in selectedAlert.details && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-lg mb-3">Resolution Details</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Date</p>
                  <p>{formatDate(selectedAlert.details.resolved.time)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Handled By</p>
                  <p>{selectedAlert.details.resolved.officer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p>{selectedAlert.details.resolved.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (selectedAlert.type === 'wanted-person') {
      const person = selectedAlert.details.person;
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-1">{alertTypeNames[selectedAlert.type]}</h3>
            <Badge variant="outline" className={priorityClasses[selectedAlert.priority]}>
              {selectedAlert.priority.charAt(0).toUpperCase() + selectedAlert.priority.slice(1)} Priority
            </Badge>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-3">Person Details</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{person.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{person.age}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{person.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Warrants</p>
                <p className="font-medium">{person.warrants}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Wanted For</p>
                <p className="font-medium">{person.reason}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedAlert.type === 'accident') {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-1">{alertTypeNames[selectedAlert.type]}</h3>
            <Badge variant="outline" className={priorityClasses[selectedAlert.priority]}>
              {selectedAlert.priority.charAt(0).toUpperCase() + selectedAlert.priority.slice(1)} Priority
            </Badge>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-3">Accident Details</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <p className="text-sm text-muted-foreground">Severity</p>
                <p className="font-medium">{selectedAlert.details.severity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicles Involved</p>
                <p className="font-medium">{selectedAlert.details.vehicles}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Injuries Reported</p>
                <p className="font-medium">{selectedAlert.details.injuries}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emergency Dispatched</p>
                <p className="font-medium">{selectedAlert.details.emergencyDispatch ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Traffic violation or other type
      const vehicle = selectedAlert.details.vehicle;
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-1">{alertTypeNames[selectedAlert.type]}</h3>
            <Badge variant="outline" className={priorityClasses[selectedAlert.priority]}>
              {selectedAlert.priority.charAt(0).toUpperCase() + selectedAlert.priority.slice(1)} Priority
            </Badge>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-3">Violation Details</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <p className="text-sm text-muted-foreground">Violation Type</p>
                <p className="font-medium">{selectedAlert.details.violation}</p>
              </div>
              {'speed' in selectedAlert.details && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Recorded Speed</p>
                    <p className="font-medium">{selectedAlert.details.speed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Speed Limit</p>
                    <p className="font-medium">{selectedAlert.details.speedLimit}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-3">Vehicle Information</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <p className="text-sm text-muted-foreground">License Plate</p>
                <p className="font-medium">{vehicle.plate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Make</p>
                <p className="font-medium">{vehicle.make}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{vehicle.year}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alerts</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts List Panel */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'} found
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                {/* Search and filters */}
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search alerts..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Alert type tabs */}
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5 h-9">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="stolen-vehicle" className="text-xs">
                      <Car className="h-3.5 w-3.5 mr-1" />
                      <span className="hidden sm:inline">Stolen</span>
                    </TabsTrigger>
                    <TabsTrigger value="wanted-person" className="text-xs">
                      <UserCircle className="h-3.5 w-3.5 mr-1" />
                      <span className="hidden sm:inline">Wanted</span>
                    </TabsTrigger>
                    <TabsTrigger value="accident" className="text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      <span className="hidden sm:inline">Accident</span>
                    </TabsTrigger>
                    <TabsTrigger value="traffic-violation" className="text-xs">
                      <Bell className="h-3.5 w-3.5 mr-1" />
                      <span className="hidden sm:inline">Violation</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>

            <div className="px-6 pb-6">
              <ScrollArea className="h-[500px] pr-4">
                {filteredAlerts.length > 0 ? (
                  <div className="space-y-1">
                    {filteredAlerts.map((alert) => (
                      <AlertItem 
                        key={alert.id} 
                        alert={alert} 
                        onClick={() => handleAlertClick(alert)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-60 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-medium">No alerts found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </Card>
        </div>

        {/* Alert Details Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Alert Details</CardTitle>
              <CardDescription>
                {selectedAlert ? `Details for alert ${selectedAlert.id}` : 'Select an alert to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAlert ? (
                <ScrollArea className="h-[500px] pr-4">
                  {renderAlertDetails()}
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-60 text-center p-6">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium">No alert selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select an alert from the list to view detailed information
                  </p>
                </div>
              )}
            </CardContent>
            {selectedAlert && (
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                {selectedAlert.status !== 'resolved' && (
                  <Button>
                    {selectedAlert.status === 'active' ? 'Resolve Alert' : 'Activate Alert'}
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage; 