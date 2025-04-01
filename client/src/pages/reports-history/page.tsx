import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Download, Eye, Filter, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for reports
const reports = [
  {
    id: 'RPT-1001',
    title: 'Vehicle Theft Investigation',
    type: 'Theft',
    date: '2023-10-15T08:23:44',
    officer: 'Officer J. Martinez',
    status: 'open',
    priority: 'high',
    description: 'Investigation into stolen vehicle with license plate KA 02 CD 5678.',
    related: {
      vehicles: ['KA 02 CD 5678'],
      persons: ['Sarah Johnson']
    }
  },
  {
    id: 'RPT-1002',
    title: 'Traffic Violation Report',
    type: 'Traffic',
    date: '2023-10-12T14:45:22',
    officer: 'Officer R. Wilson',
    status: 'closed',
    priority: 'low',
    description: 'Report on multiple traffic violations at Downtown Junction.',
    related: {
      vehicles: ['MH 01 AB 1234', 'DL 03 EF 9012'],
      persons: ['John Smith', 'Michael Brown']
    }
  },
  {
    id: 'RPT-1003',
    title: 'Suspicious Vehicle Activity',
    type: 'Surveillance',
    date: '2023-10-10T19:12:05',
    officer: 'Officer S. Thompson',
    status: 'open',
    priority: 'medium',
    description: 'Ongoing surveillance of suspicious activity involving vehicle TN 04 GH 3456.',
    related: {
      vehicles: ['TN 04 GH 3456'],
      persons: ['Emily Davis']
    }
  },
  {
    id: 'RPT-1004',
    title: 'DUI Incident Report',
    type: 'DUI',
    date: '2023-10-08T22:38:17',
    officer: 'Officer A. Rodriguez',
    status: 'closed',
    priority: 'high',
    description: 'DUI arrest and vehicle impoundment report.',
    related: {
      vehicles: ['KL 05 IJ 7890'],
      persons: ['Robert Wilson']
    }
  },
  {
    id: 'RPT-1005',
    title: 'Vehicle Identification Report',
    type: 'Investigation',
    date: '2023-10-05T10:28:33',
    officer: 'Officer L. Johnson',
    status: 'pending',
    priority: 'medium',
    description: 'Investigation to identify vehicle involved in hit and run incident.',
    related: {
      vehicles: ['Unknown'],
      persons: ['Unknown']
    }
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

const ReportsHistoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);

  // Filter reports based on search query and active tab
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'open') return matchesSearch && report.status === 'open';
    if (activeTab === 'closed') return matchesSearch && report.status === 'closed';
    if (activeTab === 'pending') return matchesSearch && report.status === 'pending';
    
    return matchesSearch;
  });

  // Handle row click
  const handleRowClick = (report: typeof reports[0]) => {
    setSelectedReport(report);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Case History</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Reports List */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by ID, title, type or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reports Registry</CardTitle>
              <CardDescription>
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No reports found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report) => (
                        <TableRow 
                          key={report.id}
                          className="cursor-pointer"
                          onClick={() => handleRowClick(report)}
                        >
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(report.date)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={
                              report.status === 'open' ? 'default' : 
                              report.status === 'closed' ? 'secondary' : 'outline'
                            }>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={(e) => { 
                              e.stopPropagation();
                              setSelectedReport(report);
                            }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Details */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Details</CardTitle>
              <CardDescription>
                {selectedReport ? `Viewing details for ${selectedReport.id}` : 'Select a report to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedReport ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{selectedReport.title}</h3>
                      <p className="text-sm text-muted-foreground">ID: {selectedReport.id}</p>
                    </div>
                    <Badge variant={
                      selectedReport.priority === 'high' ? 'destructive' : 
                      selectedReport.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {selectedReport.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p>{selectedReport.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p>{formatDate(selectedReport.date)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Officer</p>
                      <p>{selectedReport.officer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p>{selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{selectedReport.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Related Vehicles</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedReport.related.vehicles.map((vehicle, idx) => (
                        <Badge key={idx} variant="outline">{vehicle}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Related Persons</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedReport.related.persons.map((person, idx) => (
                        <Badge key={idx} variant="outline">{person}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Report
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No Report Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a report from the list to view its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsHistoryPage; 