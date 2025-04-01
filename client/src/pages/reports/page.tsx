import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, Search, FileText, Download, Plus, Eye, BarChart, ArrowUpDown, Filter, Clock, Car, AlertTriangle, UserCircle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for reports
const reports = [
  {
    id: 'REP-1001',
    title: 'Monthly Traffic Analysis',
    date: '2023-10-15T09:30:00',
    type: 'analytics',
    status: 'complete',
    author: 'John Smith',
    department: 'Traffic Control',
    pages: 12,
    format: 'PDF',
    size: '2.4 MB',
    description: 'Analysis of traffic patterns and violations for the month of October 2023.',
    preview: 'https://placehold.co/800x1000/png'
  },
  {
    id: 'REP-1002',
    title: 'Watchlist Vehicles Summary',
    date: '2023-10-14T14:15:00',
    type: 'watchlist',
    status: 'complete',
    author: 'Sarah Johnson',
    department: 'Security',
    pages: 8,
    format: 'PDF',
    size: '1.8 MB',
    description: 'Summary of all vehicles currently on the watchlist and recent sightings.',
    preview: 'https://placehold.co/800x1000/png'
  },
  {
    id: 'REP-1003',
    title: 'Accident Hotspot Mapping',
    date: '2023-10-13T11:45:00',
    type: 'accidents',
    status: 'complete',
    author: 'Michael Brown',
    department: 'Safety',
    pages: 15,
    format: 'PDF',
    size: '3.2 MB',
    description: 'Geographical analysis of accident-prone areas based on data from the last quarter.',
    preview: 'https://placehold.co/800x1000/png'
  },
  {
    id: 'REP-1004',
    title: 'Weekly Security Incidents',
    date: '2023-10-10T16:30:00',
    type: 'security',
    status: 'complete',
    author: 'Emily Davis',
    department: 'Security',
    pages: 6,
    format: 'PDF',
    size: '1.5 MB',
    description: 'Summary of security incidents detected by the system for the past week.',
    preview: 'https://placehold.co/800x1000/png'
  },
  {
    id: 'REP-1005',
    title: 'Monthly Vehicle Registration',
    date: '2023-10-01T10:00:00',
    type: 'analytics',
    status: 'complete',
    author: 'Robert Wilson',
    department: 'Administration',
    pages: 10,
    format: 'PDF',
    size: '2.1 MB',
    description: 'Summary of new vehicle registrations and status changes for the month.',
    preview: 'https://placehold.co/800x1000/png'
  }
];

// Mock data for report templates
const reportTemplates = [
  {
    id: 'TEMP-1',
    title: 'Traffic Analysis Report',
    description: 'Comprehensive traffic pattern analysis with violations breakdown',
    category: 'analytics',
    lastUsed: '2023-10-15'
  },
  {
    id: 'TEMP-2',
    title: 'Watchlist Status Report',
    description: 'Summary of watchlist vehicles and recent sightings',
    category: 'watchlist',
    lastUsed: '2023-10-14'
  },
  {
    id: 'TEMP-3',
    title: 'Accident Analysis Report',
    description: 'Detailed breakdown of accidents by location, type, and severity',
    category: 'accidents',
    lastUsed: '2023-10-13'
  },
  {
    id: 'TEMP-4',
    title: 'Security Incident Report',
    description: 'Summary of security incidents and response actions taken',
    category: 'security',
    lastUsed: '2023-10-10'
  },
  {
    id: 'TEMP-5',
    title: 'Vehicle Registration Summary',
    description: 'Overview of vehicle registrations and status changes',
    category: 'analytics',
    lastUsed: '2023-10-01'
  }
];

// Mock data for recent activity
const recentActivity = [
  {
    id: 'ACT-1001',
    action: 'Report Downloaded',
    target: 'Monthly Traffic Analysis',
    user: 'John Smith',
    timestamp: '2023-10-15T10:30:00',
    details: 'PDF format, 2.4 MB'
  },
  {
    id: 'ACT-1002',
    action: 'Report Generated',
    target: 'Weekly Security Incidents',
    user: 'Emily Davis',
    timestamp: '2023-10-14T16:45:00',
    details: 'PDF format, 1.5 MB'
  },
  {
    id: 'ACT-1003',
    action: 'Template Modified',
    target: 'Accident Analysis Report',
    user: 'Michael Brown',
    timestamp: '2023-10-13T14:20:00',
    details: 'Added new section for weather conditions'
  },
  {
    id: 'ACT-1004',
    action: 'Report Shared',
    target: 'Watchlist Vehicles Summary',
    user: 'Sarah Johnson',
    timestamp: '2023-10-12T09:15:00',
    details: 'Shared with Security Department'
  },
  {
    id: 'ACT-1005',
    action: 'New Template Created',
    target: 'Traffic Violation Trends',
    user: 'Robert Wilson',
    timestamp: '2023-10-11T11:30:00',
    details: 'Based on existing Traffic Analysis template'
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

// Type badge mapping
const typeBadgeClasses: Record<string, string> = {
  'analytics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  'watchlist': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  'accidents': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  'security': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
};

// Type icon mapping
const typeIcons: Record<string, React.ReactNode> = {
  'analytics': <BarChart className="h-4 w-4" />,
  'watchlist': <AlertTriangle className="h-4 w-4" />,
  'accidents': <Car className="h-4 w-4" />,
  'security': <UserCircle className="h-4 w-4" />
};

const ReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const { toast } = useToast();

  // Filter reports based on search query and type
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch && (typeFilter === 'all' || report.type === typeFilter);
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Handle report row click
  const handleReportClick = (report: typeof reports[0]) => {
    setSelectedReport(report);
  };

  // Handle report download
  const handleDownload = (reportId: string) => {
    toast({
      title: "Download Started",
      description: `Report ${reportId} is being downloaded`
    });
  };

  // Handle new report creation
  const handleCreateReport = () => {
    toast({
      title: "Create New Report",
      description: "Opening report creation wizard"
    });
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Report template card
  const ReportTemplateCard = ({ template }: { template: typeof reportTemplates[0] }) => (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          {typeIcons[template.category]}
          <span className="ml-2">{template.title}</span>
        </CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-0 flex justify-between">
        <Badge variant="outline" className={typeBadgeClasses[template.category]}>
          {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
        </Badge>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );

  // Recent activity item
  const ActivityItem = ({ activity }: { activity: typeof recentActivity[0] }) => (
    <div className="border rounded-lg p-3 mb-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{activity.action}</h4>
          <p className="text-sm text-muted-foreground">{activity.target}</p>
        </div>
        <Badge variant="outline">
          {new Date(activity.timestamp).toLocaleDateString()}
        </Badge>
      </div>
      <div className="flex items-center mt-2 text-sm">
        <UserCircle className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
        <span className="text-muted-foreground">{activity.user}</span>
      </div>
      <div className="flex items-center mt-1 text-sm">
        <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
        <span className="text-muted-foreground">{new Date(activity.timestamp).toLocaleTimeString()}</span>
      </div>
      {activity.details && (
        <div className="mt-2 text-sm text-muted-foreground">
          {activity.details}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & History</h1>
        <Button onClick={handleCreateReport}>
          <FileText className="h-4 w-4 mr-2" />
          Create New Report
        </Button>
      </div>

      <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="watchlist">Watchlist</SelectItem>
                    <SelectItem value="accidents">Accidents</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>
                    {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-3">
                      {filteredReports.map(report => (
                        <div
                          key={report.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedReport?.id === report.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'}`}
                          onClick={() => handleReportClick(report)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium">{report.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                            </div>
                            <Badge variant="outline" className={typeBadgeClasses[report.type]}>
                              {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-y-1 text-sm mt-3">
                            <div className="flex items-center text-muted-foreground">
                              <UserCircle className="h-3.5 w-3.5 mr-1" />
                              <span>{report.author}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              <span>{report.pages} pages • {report.format}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{formatDate(report.date)}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{report.department}</span>
                            </div>
                          </div>
                          <div className="flex justify-end mt-3 pt-2 border-t">
                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                              <Button size="sm" onClick={() => handleDownload(report.id)}>
                                <Download className="h-3.5 w-3.5 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {filteredReports.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                          <h3 className="text-lg font-medium mb-1">No reports found</h3>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search criteria or create a new report
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="lg:w-1/3">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Report Details</CardTitle>
                  <CardDescription>
                    {selectedReport ? `Details for ${selectedReport.title}` : 'Select a report to view details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedReport ? (
                    <div className="space-y-6">
                      <div className="aspect-[3/4] rounded-lg border overflow-hidden">
                        <img 
                          src={selectedReport.preview} 
                          alt={`Preview of ${selectedReport.title}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium">{selectedReport.title}</h3>
                          <Badge variant="outline" className={typeBadgeClasses[selectedReport.type]}>
                            {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                      </div>

                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Generated On</p>
                          <p className="font-medium">{formatDate(selectedReport.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Author</p>
                          <p className="font-medium">{selectedReport.author}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-medium">{selectedReport.department}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">File Details</p>
                          <p className="font-medium">{selectedReport.pages} pages • {selectedReport.format} • {selectedReport.size}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No report selected</h3>
                      <p className="text-sm text-muted-foreground">
                        Select a report from the list to view its details
                      </p>
                    </div>
                  )}
                </CardContent>
                {selectedReport && (
                  <CardFooter className="flex justify-between border-t p-4">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Report
                    </Button>
                    <Button onClick={() => handleDownload(selectedReport.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Report Templates</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reportTemplates.map(template => (
                <ReportTemplateCard key={template.id} template={template} />
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>Create a custom report by selecting options below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input id="report-title" placeholder="Enter report title" />
                </div>
                
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select defaultValue="analytics">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analytics">Analytics Report</SelectItem>
                      <SelectItem value="watchlist">Watchlist Report</SelectItem>
                      <SelectItem value="accidents">Accident Report</SelectItem>
                      <SelectItem value="security">Security Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Range From</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range To</Label>
                    <Input type="date" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Include Sections</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="section-summary" checked />
                      <label htmlFor="section-summary" className="text-sm font-medium leading-none cursor-pointer">
                        Executive Summary
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="section-charts" checked />
                      <label htmlFor="section-charts" className="text-sm font-medium leading-none cursor-pointer">
                        Charts and Visualizations
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="section-details" checked />
                      <label htmlFor="section-details" className="text-sm font-medium leading-none cursor-pointer">
                        Detailed Data Tables
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="section-recommendations" checked />
                      <label htmlFor="section-recommendations" className="text-sm font-medium leading-none cursor-pointer">
                        Recommendations
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recent actions related to reports and templates</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-1">
                    {recentActivity.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Calendar</CardTitle>
                <CardDescription>Report generation activity by date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Calendar mode="single" className="rounded-md border" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">October 15, 2023</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Reports Generated</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reports Downloaded</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Template Usage</span>
                        <span className="font-medium">2</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Activity Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage; 