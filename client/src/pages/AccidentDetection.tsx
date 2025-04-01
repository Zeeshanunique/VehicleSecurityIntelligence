import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation } from '@tanstack/react-query';
import { Alert } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const AccidentDetection = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [processingMedia, setProcessingMedia] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any | null>(null);
  
  const { toast } = useToast();
  
  const { data: accidents, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    select: (data) => data.filter(alert => alert.type.toLowerCase() === 'accident')
  });

  const scanMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/accident-detection/scan', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to process media');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setDetectionResult(data);
      setProcessingMedia(false);
      
      if (data.isAccident) {
        toast({
          title: 'Accident Detected!',
          description: `Accident with ${data.severity} severity detected at ${data.location}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'No Accident Detected',
          description: 'The system did not detect any accidents in the provided media',
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    },
    onError: (error) => {
      setProcessingMedia(false);
      toast({
        title: 'Detection Failed',
        description: error instanceof Error ? error.message : 'Failed to process the media',
        variant: 'destructive',
      });
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedImage(URL.createObjectURL(file));
    setSelectedVideo(null);
    setDetectionResult(null);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedVideo(URL.createObjectURL(file));
    setSelectedImage(null);
    setDetectionResult(null);
  };

  const handleMediaProcess = () => {
    if (!selectedImage && !selectedVideo) return;
    
    setProcessingMedia(true);
    
    // Create a FormData object to send the media
    const formData = new FormData();
    
    if (selectedImage) {
      // Convert the data URL to a Blob
      fetch(selectedImage)
        .then(res => res.blob())
        .then(blob => {
          formData.append('image', blob, 'uploaded-image.jpg');
          scanMutation.mutate(formData);
        });
    } else if (selectedVideo) {
      // Convert the data URL to a Blob
      fetch(selectedVideo)
        .then(res => res.blob())
        .then(blob => {
          formData.append('video', blob, 'uploaded-video.mp4');
          scanMutation.mutate(formData);
        });
    }
  };

  const resetMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setDetectionResult(null);
    setFileInputKey(Date.now()); // Reset the file input
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning" className="bg-orange-100 text-orange-800 hover:bg-orange-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-100 main-content">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Accident Detection & Response</h1>
              <p className="text-gray-600 mt-1">Automatically detect traffic accidents and coordinate emergency response</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Accident Scanner</CardTitle>
                    <CardDescription>Upload footage from CCTV or dashcams to detect accidents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {selectedImage ? (
                          <div className="relative">
                            <img 
                              src={selectedImage} 
                              alt="Selected" 
                              className="mx-auto max-h-60 rounded"
                            />
                            {detectionResult && (
                              <div className={`absolute top-2 right-2 ${detectionResult.isAccident ? 'bg-red-500' : 'bg-green-500'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                                {detectionResult.isAccident ? `${detectionResult.severity} Severity` : 'No Accident'}
                              </div>
                            )}
                          </div>
                        ) : selectedVideo ? (
                          <div className="relative">
                            <video 
                              src={selectedVideo} 
                              controls
                              className="mx-auto max-h-60 rounded"
                            />
                            {detectionResult && (
                              <div className={`absolute top-2 right-2 ${detectionResult.isAccident ? 'bg-red-500' : 'bg-green-500'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                                {detectionResult.isAccident ? `${detectionResult.severity} Severity` : 'No Accident'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-8">
                            <span className="material-icons-round text-4xl text-gray-400 mb-2">car_crash</span>
                            <p className="text-sm text-gray-500">Upload an image or video with potential accident</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-x-2">
                          <input
                            type="file"
                            id="accidentImage"
                            key={`image-${fileInputKey}`}
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => document.getElementById('accidentImage')?.click()}
                            disabled={processingMedia}
                            size="sm"
                          >
                            <span className="material-icons-round mr-2">image</span>
                            Image
                          </Button>
                          
                          <input
                            type="file"
                            id="accidentVideo"
                            key={`video-${fileInputKey}`}
                            accept="video/*"
                            className="hidden"
                            onChange={handleVideoUpload}
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => document.getElementById('accidentVideo')?.click()}
                            disabled={processingMedia}
                            size="sm"
                          >
                            <span className="material-icons-round mr-2">videocam</span>
                            Video
                          </Button>
                        </div>
                        
                        {(selectedImage || selectedVideo) && (
                          <div className="space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={resetMedia}
                              disabled={processingMedia}
                              size="sm"
                            >
                              <span className="material-icons-round">refresh</span>
                            </Button>
                            <Button 
                              onClick={handleMediaProcess}
                              disabled={processingMedia}
                              size="sm"
                            >
                              {processingMedia ? (
                                <>
                                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                                  Processing
                                </>
                              ) : (
                                <>
                                  <span className="material-icons-round mr-2">search</span>
                                  Analyze
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {detectionResult && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">Detection Result</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Accident Detected:</span>
                              <span className="text-sm font-medium">{detectionResult.isAccident ? 'Yes' : 'No'}</span>
                            </div>
                            
                            {detectionResult.isAccident && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Severity:</span>
                                  <span>{getSeverityBadge(detectionResult.severity)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Location:</span>
                                  <span className="text-sm font-medium">{detectionResult.location}</span>
                                </div>
                              </>
                            )}
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Detected on:</span>
                              <span className="text-sm">{new Date(detectionResult.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {detectionResult.isAccident && (
                            <div className="mt-3 space-y-2">
                              <Button className="w-full" variant="destructive">
                                <span className="material-icons-round mr-2">local_hospital</span>
                                Dispatch Emergency Services
                              </Button>
                              <Button className="w-full" variant="outline">
                                <span className="material-icons-round mr-2">info</span>
                                View Incident Details
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Emergency Response</CardTitle>
                    <CardDescription>Coordinate emergency services for accident response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                        <div className="flex items-center">
                          <span className="material-icons-round text-green-600 mr-2">local_police</span>
                          <div>
                            <div className="text-sm font-medium">Police</div>
                            <div className="text-xs text-gray-500">3 units available</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-100">
                          Dispatch
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between bg-red-50 p-3 rounded-md border border-red-200">
                        <div className="flex items-center">
                          <span className="material-icons-round text-red-600 mr-2">local_hospital</span>
                          <div>
                            <div className="text-sm font-medium">Ambulance</div>
                            <div className="text-xs text-gray-500">2 units available</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                          Dispatch
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between bg-orange-50 p-3 rounded-md border border-orange-200">
                        <div className="flex items-center">
                          <span className="material-icons-round text-orange-600 mr-2">local_fire_department</span>
                          <div>
                            <div className="text-sm font-medium">Fire Department</div>
                            <div className="text-xs text-gray-500">1 unit available</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100">
                          Dispatch
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md border border-blue-200">
                        <div className="flex items-center">
                          <span className="material-icons-round text-blue-600 mr-2">engineering</span>
                          <div>
                            <div className="text-sm font-medium">Traffic Control</div>
                            <div className="text-xs text-gray-500">2 units available</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                          Dispatch
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Accident Reports</CardTitle>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-icons-round text-gray-400 text-sm">search</span>
                        </span>
                        <Input 
                          type="text" 
                          placeholder="Search accident records..." 
                          className="pl-10 pr-4 py-1 text-sm h-9 w-full sm:w-64" 
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="active">
                      <TabsList>
                        <TabsTrigger value="active">Active Incidents</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
                        <TabsTrigger value="all">All Accidents</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="active" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : accidents && accidents.filter(a => a.status === 'active').length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Location</TableHead>
                                  <TableHead>Severity</TableHead>
                                  <TableHead>Detected</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {accidents.filter(a => a.status === 'active').map((accident) => (
                                  <TableRow key={accident.id}>
                                    <TableCell className="font-medium">A-{accident.id}</TableCell>
                                    <TableCell>{accident.location?.split(',')[0] || 'Unknown'}</TableCell>
                                    <TableCell>
                                      {accident.details && accident.details.severity 
                                        ? getSeverityBadge(accident.details.severity as string)
                                        : getSeverityBadge('Medium')
                                      }
                                    </TableCell>
                                    <TableCell>{new Date(accident.timestamp).toRelativeTime()}</TableCell>
                                    <TableCell>
                                      <Badge variant="destructive">In Progress</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        className="mr-2"
                                      >
                                        <span className="material-icons-round text-sm mr-1">local_hospital</span>
                                        Respond
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                      >
                                        <span className="material-icons-round text-sm">info</span>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <span className="material-icons-round text-4xl text-gray-300">check_circle</span>
                            <p className="mt-2 text-gray-500">No active accidents</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="resolved" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : accidents && accidents.filter(a => a.status === 'resolved').length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Location</TableHead>
                                  <TableHead>Severity</TableHead>
                                  <TableHead>Detected</TableHead>
                                  <TableHead>Resolved At</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {accidents.filter(a => a.status === 'resolved').map((accident) => (
                                  <TableRow key={accident.id}>
                                    <TableCell className="font-medium">A-{accident.id}</TableCell>
                                    <TableCell>{accident.location?.split(',')[0] || 'Unknown'}</TableCell>
                                    <TableCell>
                                      {accident.details && accident.details.severity 
                                        ? getSeverityBadge(accident.details.severity as string)
                                        : getSeverityBadge('Medium')
                                      }
                                    </TableCell>
                                    <TableCell>{new Date(accident.timestamp).toLocaleString()}</TableCell>
                                    <TableCell>{new Date().toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                      >
                                        <span className="material-icons-round text-sm">description</span>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <span className="material-icons-round text-4xl text-gray-300">history</span>
                            <p className="mt-2 text-gray-500">No resolved accident records</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="all" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : accidents && accidents.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Location</TableHead>
                                  <TableHead>Severity</TableHead>
                                  <TableHead>Detected</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {accidents.map((accident) => (
                                  <TableRow key={accident.id}>
                                    <TableCell className="font-medium">A-{accident.id}</TableCell>
                                    <TableCell>{accident.location?.split(',')[0] || 'Unknown'}</TableCell>
                                    <TableCell>
                                      {accident.details && accident.details.severity 
                                        ? getSeverityBadge(accident.details.severity as string)
                                        : getSeverityBadge('Medium')
                                      }
                                    </TableCell>
                                    <TableCell>{new Date(accident.timestamp).toRelativeTime()}</TableCell>
                                    <TableCell>
                                      {accident.status === 'active' ? (
                                        <Badge variant="destructive">In Progress</Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                          Resolved
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {accident.status === 'active' ? (
                                        <Button 
                                          variant="default" 
                                          size="sm"
                                          className="mr-2"
                                        >
                                          <span className="material-icons-round text-sm mr-1">local_hospital</span>
                                          Respond
                                        </Button>
                                      ) : null}
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                      >
                                        <span className="material-icons-round text-sm">info</span>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <span className="material-icons-round text-4xl text-gray-300">car_crash</span>
                            <p className="mt-2 text-gray-500">No accident records found</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Accident Hotspots</CardTitle>
                    <CardDescription>Areas with high accident frequency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <span className="material-icons-round text-4xl text-gray-400">map</span>
                          <p className="mt-2 text-sm text-gray-500">Heat Map of Accident Hotspots</p>
                          <p className="text-xs text-gray-400">Map would display areas with high accident frequency</p>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                        <Button variant="default" size="icon" className="rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow h-8 w-8">
                          <span className="material-icons-round text-sm">add</span>
                        </Button>
                        <Button variant="default" size="icon" className="rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow h-8 w-8">
                          <span className="material-icons-round text-sm">remove</span>
                        </Button>
                        <Button variant="default" size="icon" className="rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow h-8 w-8">
                          <span className="material-icons-round text-sm">my_location</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium">Highway 95</span>
                          </div>
                          <span className="text-sm font-semibold">12 incidents</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium">Main St Junction</span>
                          </div>
                          <span className="text-sm font-semibold">8 incidents</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium">River Rd Bridge</span>
                          </div>
                          <span className="text-sm font-semibold">5 incidents</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccidentDetection;
