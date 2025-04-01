import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
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
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Watchlist } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const FacialRecognition = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [detectedPerson, setDetectedPerson] = useState<any | null>(null);
  
  const { toast } = useToast();
  
  const { data: watchlist, isLoading } = useQuery<Watchlist[]>({
    queryKey: ['/api/watchlist'],
  });

  const scanMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/facial-recognition/scan', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setDetectedPerson(data);
      setProcessingImage(false);
      
      if (data.isWanted) {
        toast({
          title: 'Alert! Wanted Person Detected',
          description: `${data.name} identified with ${data.confidence}% confidence`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Person Identified',
          description: `${data.name} identified with ${data.confidence}% confidence`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
    },
    onError: (error) => {
      setProcessingImage(false);
      toast({
        title: 'Detection Failed',
        description: error instanceof Error ? error.message : 'Failed to process the image',
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
    setDetectedPerson(null);
  };

  const handleImageProcess = () => {
    if (!selectedImage) return;
    
    setProcessingImage(true);
    
    // Create a FormData object to send the image
    const formData = new FormData();
    
    // Convert the data URL to a Blob
    fetch(selectedImage)
      .then(res => res.blob())
      .then(blob => {
        formData.append('image', blob, 'uploaded-image.jpg');
        scanMutation.mutate(formData);
      });
  };

  const resetImage = () => {
    setSelectedImage(null);
    setDetectedPerson(null);
    setFileInputKey(Date.now()); // Reset the file input
  };

  const filteredWatchlist = watchlist?.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (person.status && person.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'wanted':
        return <Badge variant="destructive">Wanted</Badge>;
      case 'missing':
        return <Badge variant="warning" className="bg-orange-100 text-orange-800 hover:bg-orange-200">Missing</Badge>;
      case 'person of interest':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Person of Interest</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
              <h1 className="text-2xl font-semibold text-gray-900">Facial Recognition</h1>
              <p className="text-gray-600 mt-1">Identify persons of interest using deep learning-based facial recognition</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Face Scanner</CardTitle>
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
                            {detectedPerson && (
                              <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {detectedPerson.confidence}% Match
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-8">
                            <span className="material-icons-round text-4xl text-gray-400 mb-2">face</span>
                            <p className="text-sm text-gray-500">Upload an image with a face</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <input
                            type="file"
                            id="faceImage"
                            key={fileInputKey}
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => document.getElementById('faceImage')?.click()}
                            disabled={processingImage}
                          >
                            <span className="material-icons-round mr-2">photo_camera</span>
                            Select Image
                          </Button>
                        </div>
                        
                        {selectedImage && (
                          <div className="space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={resetImage}
                              disabled={processingImage}
                            >
                              <span className="material-icons-round">refresh</span>
                            </Button>
                            <Button 
                              onClick={handleImageProcess}
                              disabled={processingImage}
                            >
                              {processingImage ? (
                                <>
                                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                                  Processing
                                </>
                              ) : (
                                <>
                                  <span className="material-icons-round mr-2">search</span>
                                  Scan Face
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {detectedPerson && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">Identity Match</h3>
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-sm font-medium">Match Confidence</div>
                              <div className="text-sm font-mono">{detectedPerson.confidence}%</div>
                            </div>
                            <Progress value={detectedPerson.confidence} className="h-2" />
                            
                            <div className="mt-3 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Name:</span>
                                <span className="text-sm font-medium">{detectedPerson.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Status:</span>
                                <span>
                                  {detectedPerson.isWanted ? (
                                    <Badge variant="destructive">Wanted</Badge>
                                  ) : (
                                    <Badge variant="outline">Person of Interest</Badge>
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Matched on:</span>
                                <span className="text-sm">{new Date(detectedPerson.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <Button className="w-full">
                                <span className="material-icons-round mr-2">info</span>
                                View Full Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Watchlist Database</CardTitle>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-icons-round text-gray-400 text-sm">search</span>
                        </span>
                        <Input 
                          type="text" 
                          placeholder="Search name or status..." 
                          className="pl-10 pr-4 py-1 text-sm h-9 w-full sm:w-64" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">All Persons</TabsTrigger>
                        <TabsTrigger value="wanted">Wanted</TabsTrigger>
                        <TabsTrigger value="missing">Missing</TabsTrigger>
                        <TabsTrigger value="poi">Persons of Interest</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : filteredWatchlist && filteredWatchlist.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12"></TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Confidence</TableHead>
                                  <TableHead>Last Seen</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredWatchlist.map((person) => (
                                  <TableRow key={person.id}>
                                    <TableCell>
                                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="material-icons-round text-gray-500">person</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{person.name}</TableCell>
                                    <TableCell>
                                      {getStatusBadge(person.status)}
                                    </TableCell>
                                    <TableCell>
                                      {person.confidence ? `${person.confidence}%` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                      {person.lastSeen ? new Date(person.lastSeen).toRelativeTime() : 'Unknown'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="mr-2"
                                      >
                                        <span className="material-icons-round text-sm">info</span>
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                      >
                                        <span className="material-icons-round text-sm">edit</span>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <span className="material-icons-round text-4xl text-gray-300">face_off</span>
                            <p className="mt-2 text-gray-500">No persons found in the database</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="wanted" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : watchlist && watchlist.filter(p => p.status.toLowerCase() === 'wanted').length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12"></TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Confidence</TableHead>
                                  <TableHead>Last Seen</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {watchlist.filter(p => p.status.toLowerCase() === 'wanted').map((person) => (
                                  <TableRow key={person.id}>
                                    <TableCell>
                                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="material-icons-round text-gray-500">person</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{person.name}</TableCell>
                                    <TableCell>
                                      {person.confidence ? `${person.confidence}%` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                      {person.lastSeen ? new Date(person.lastSeen).toRelativeTime() : 'Unknown'}
                                    </TableCell>
                                    <TableCell className="text-right">
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
                            <span className="material-icons-round text-4xl text-gray-300">gpp_good</span>
                            <p className="mt-2 text-gray-500">No wanted persons in the database</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="missing" className="mt-4">
                        <div className="text-center py-10">
                          <span className="material-icons-round text-4xl text-gray-300">person_search</span>
                          <p className="mt-2 text-gray-500">No missing persons in the database</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="poi" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : watchlist && watchlist.filter(p => p.status.toLowerCase() === 'person of interest').length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12"></TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Confidence</TableHead>
                                  <TableHead>Last Seen</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {watchlist.filter(p => p.status.toLowerCase() === 'person of interest').map((person) => (
                                  <TableRow key={person.id}>
                                    <TableCell>
                                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="material-icons-round text-gray-500">person</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{person.name}</TableCell>
                                    <TableCell>
                                      {person.confidence ? `${person.confidence}%` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                      {person.lastSeen ? new Date(person.lastSeen).toRelativeTime() : 'Unknown'}
                                    </TableCell>
                                    <TableCell className="text-right">
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
                            <span className="material-icons-round text-4xl text-gray-300">person_search</span>
                            <p className="mt-2 text-gray-500">No persons of interest in the database</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
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

export default FacialRecognition;
