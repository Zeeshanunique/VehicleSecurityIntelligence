import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, FileText, Car, Clock, Edit, Trash, Filter, MoreHorizontal, 
  AlertTriangle, CheckCircle, User, MapPin, Calendar
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Mock data for vehicles
const vehicles = [
  {
    id: 'VEH-1001',
    plate: 'MH 01 AB 1234',
    owner: 'John Smith',
    make: 'Toyota',
    model: 'Fortuner',
    year: '2019',
    color: 'White',
    status: 'active',
    registrationDate: '2019-05-12',
    lastScan: '2023-10-15T08:23:44',
    lastLocation: 'Main St & 5th Ave',
    history: [
      { date: '2023-10-15T08:23:44', event: 'License Plate Scan', location: 'Main St & 5th Ave' },
      { date: '2023-09-30T14:12:33', event: 'Routine Check', location: 'Highway Checkpoint B' },
      { date: '2023-08-22T09:45:12', event: 'Speed Violation', location: 'Downtown Junction' }
    ],
    watchlist: false,
    alerts: 0
  },
  {
    id: 'VEH-1002',
    plate: 'KA 02 CD 5678',
    owner: 'Sarah Johnson',
    make: 'Honda',
    model: 'City',
    year: '2021',
    color: 'Silver',
    status: 'active',
    registrationDate: '2021-02-18',
    lastScan: '2023-10-14T16:52:38',
    lastLocation: 'Central Junction, Downtown',
    history: [
      { date: '2023-10-14T16:52:38', event: 'License Plate Scan', location: 'Central Junction, Downtown' },
      { date: '2023-10-01T11:32:08', event: 'Traffic Violation', location: 'Downtown Junction' }
    ],
    watchlist: false,
    alerts: 1
  },
  {
    id: 'VEH-1003',
    plate: 'DL 03 EF 9012',
    owner: 'Michael Brown',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: '2020',
    color: 'Red',
    status: 'suspended',
    registrationDate: '2020-07-30',
    lastScan: '2023-10-13T12:18:55',
    lastLocation: 'South District Mall',
    history: [
      { date: '2023-10-13T12:18:55', event: 'License Plate Scan', location: 'South District Mall' },
      { date: '2023-10-10T08:12:45', event: 'Registration Check', location: 'DMV Office' },
      { date: '2023-09-28T15:40:22', event: 'Parking Violation', location: 'City Center' }
    ],
    watchlist: true,
    alerts: 2
  },
  {
    id: 'VEH-1004',
    plate: 'TN 04 GH 3456',
    owner: 'Emily Davis',
    make: 'Hyundai',
    model: 'Creta',
    year: '2022',
    color: 'Black',
    status: 'active',
    registrationDate: '2022-01-05',
    lastScan: '2023-10-12T09:34:21',
    lastLocation: 'Highway 101, Mile 28',
    history: [
      { date: '2023-10-12T09:34:21', event: 'License Plate Scan', location: 'Highway 101, Mile 28' }
    ],
    watchlist: false,
    alerts: 0
  },
  {
    id: 'VEH-1005',
    plate: 'KL 05 IJ 7890',
    owner: 'Robert Wilson',
    make: 'Mahindra',
    model: 'XUV700',
    year: '2023',
    color: 'Blue',
    status: 'active',
    registrationDate: '2023-03-22',
    lastScan: '2023-10-11T14:22:18',
    lastLocation: 'East Side Mall Parking',
    history: [
      { date: '2023-10-11T14:22:18', event: 'License Plate Scan', location: 'East Side Mall Parking' },
      { date: '2023-09-25T10:15:42', event: 'Routine Check', location: 'Airport Road Checkpoint' }
    ],
    watchlist: false,
    alerts: 0
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

const VehiclesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toast } = useToast();

  // Filter vehicles based on search query and active tab
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'watchlist') return matchesSearch && vehicle.watchlist;
    if (activeTab === 'alerts') return matchesSearch && vehicle.alerts > 0;
    
    return matchesSearch;
  });

  // Handle row click
  const handleRowClick = (vehicle: typeof vehicles[0]) => {
    setSelectedVehicle(vehicle);
  };

  // Handle vehicle actions
  const handleVehicleAction = (action: string, vehicle: typeof vehicles[0]) => {
    switch (action) {
      case 'edit':
        toast({
          title: "Edit Vehicle",
          description: `Editing vehicle ${vehicle.plate}`
        });
        break;
      case 'delete':
        toast({
          title: "Delete Vehicle",
          description: `Vehicle ${vehicle.plate} will be deleted`,
          variant: "destructive"
        });
        break;
      case 'report':
        toast({
          title: "Generate Report",
          description: `Creating report for vehicle ${vehicle.plate}`
        });
        break;
      case 'watchlist':
        toast({
          title: vehicle.watchlist ? "Remove from Watchlist" : "Add to Watchlist",
          description: `Vehicle ${vehicle.plate} ${vehicle.watchlist ? 'removed from' : 'added to'} watchlist`
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Vehicles List */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by plate, owner, make or model..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="alerts">With Alerts</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Vehicle Registry</CardTitle>
              <CardDescription>
                {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">License Plate</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Make & Model</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Last Seen</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map(vehicle => (
                        <TableRow 
                          key={vehicle.id}
                          className={`cursor-pointer ${selectedVehicle?.id === vehicle.id ? 'bg-muted/50' : ''}`}
                          onClick={() => handleRowClick(vehicle)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{vehicle.plate}</span>
                              {vehicle.watchlist && (
                                <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 mt-1 w-fit">
                                  Watchlist
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.owner}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{vehicle.make} {vehicle.model}</span>
                              <span className="text-xs text-muted-foreground">{vehicle.year} • {vehicle.color}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge 
                              variant="outline" 
                              className={vehicle.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              }
                            >
                              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span>{new Date(vehicle.lastScan).toLocaleDateString()}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-[150px]">{vehicle.lastLocation}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleVehicleAction('edit', vehicle)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleVehicleAction('report', vehicle)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Report
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleVehicleAction('watchlist', vehicle)}>
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    {vehicle.watchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleVehicleAction('delete', vehicle)}>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <div className="flex flex-col items-center">
                            <Car className="h-10 w-10 text-muted-foreground/50 mb-2" />
                            <p className="text-muted-foreground">No vehicles found</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Details Panel */}
        <div className="w-full md:w-1/3">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardDescription>
                {selectedVehicle ? `Information for ${selectedVehicle.plate}` : 'Select a vehicle to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedVehicle ? (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{selectedVehicle.plate}</h3>
                        <Badge 
                          variant="outline" 
                          className={selectedVehicle.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }
                        >
                          {selectedVehicle.status.charAt(0).toUpperCase() + selectedVehicle.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-muted-foreground mr-2" />
                        <span>{selectedVehicle.make} {selectedVehicle.model} • {selectedVehicle.year} • {selectedVehicle.color}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Owner Information */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Owner Information</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{selectedVehicle.owner}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Vehicle Status */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Status Information</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm text-muted-foreground">Registration Date</div>
                          <div className="text-sm font-medium">
                            {new Date(selectedVehicle.registrationDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm text-muted-foreground">Last Seen</div>
                          <div className="text-sm font-medium">
                            {formatDate(selectedVehicle.lastScan)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm text-muted-foreground">Location</div>
                          <div className="text-sm font-medium">
                            {selectedVehicle.lastLocation}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm text-muted-foreground">Alert Status</div>
                          <div className="text-sm font-medium flex items-center">
                            {selectedVehicle.alerts > 0 ? (
                              <>
                                <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                                <span>{selectedVehicle.alerts} active alert{selectedVehicle.alerts !== 1 ? 's' : ''}</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                <span>No active alerts</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm text-muted-foreground">Watchlist Status</div>
                          <div className="text-sm font-medium">
                            {selectedVehicle.watchlist ? (
                              <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                                On Watchlist
                              </Badge>
                            ) : (
                              <span>Not on watchlist</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Activity History */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Recent Activity</h4>
                      <div className="space-y-3">
                        {selectedVehicle.history.map((event, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div className="font-medium">{event.event}</div>
                              <Badge variant="outline" className="bg-muted">
                                {new Date(event.date).toLocaleDateString()}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{new Date(event.date).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Car className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No vehicle selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a vehicle from the list to view detailed information
                  </p>
                </div>
              )}
            </CardContent>
            {selectedVehicle && (
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Vehicle
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage; 