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
import { useQuery, useMutation } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Vehicle } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

const LicensePlate = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  const scanMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/license-plate/scan', {
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
      setDetectedPlate(data.licensePlate);
      setProcessingImage(false);
      
      if (data.isStolen) {
        toast({
          title: 'Alert! Stolen Vehicle Detected',
          description: `License plate ${data.licensePlate} is registered as stolen`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'License Plate Detected',
          description: `Identified license plate: ${data.licensePlate}`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
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

  const markStolenMutation = useMutation({
    mutationFn: async (vehicleId: number) => {
      return await apiRequest("PATCH", `/api/vehicles/${vehicleId}`, { isStolen: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      toast({
        title: 'Vehicle Marked as Stolen',
        description: 'The vehicle has been flagged as stolen in the system.',
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
    setDetectedPlate(null);
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
    setDetectedPlate(null);
    setFileInputKey(Date.now()); // Reset the file input
  };

  const filteredVehicles = vehicles?.filter(vehicle => 
    vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vehicle.owner && vehicle.owner.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-100 main-content">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">License Plate Recognition</h1>
              <p className="text-gray-600 mt-1">Detect, validate, and track vehicle license plates</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Plate Scanner</CardTitle>
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
                            {detectedPlate && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {detectedPlate}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-8">
                            <span className="material-icons-round text-4xl text-gray-400 mb-2">upload_file</span>
                            <p className="text-sm text-gray-500">Upload an image with a license plate</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <input
                            type="file"
                            id="plateImage"
                            key={fileInputKey}
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => document.getElementById('plateImage')?.click()}
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
                                  Scan Plate
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {detectedPlate && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">Detected Plate</h3>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-xl font-mono font-bold bg-yellow-100 px-3 py-1 rounded border border-yellow-300">
                              {detectedPlate}
                            </div>
                            <Button size="sm">
                              <span className="material-icons-round mr-2">search</span>
                              Lookup
                            </Button>
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
                      <CardTitle>Vehicle Database</CardTitle>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-icons-round text-gray-400 text-sm">search</span>
                        </span>
                        <Input 
                          type="text" 
                          placeholder="Search license plate or owner..." 
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
                        <TabsTrigger value="all">All Vehicles</TabsTrigger>
                        <TabsTrigger value="stolen">Stolen Vehicles</TabsTrigger>
                        <TabsTrigger value="recent">Recently Scanned</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : filteredVehicles && filteredVehicles.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>License Plate</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Owner</TableHead>
                                  <TableHead>Last Seen</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredVehicles.map((vehicle) => (
                                  <TableRow key={vehicle.id}>
                                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                                    <TableCell>
                                      {vehicle.isStolen ? (
                                        <Badge variant="destructive">Stolen</Badge>
                                      ) : (
                                        <Badge variant="outline">Clear</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>{vehicle.owner || 'Unknown'}</TableCell>
                                    <TableCell>{new Date(vehicle.lastSeen).toRelativeTime()}</TableCell>
                                    <TableCell className="text-right">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="mr-2"
                                      >
                                        <span className="material-icons-round text-sm">info</span>
                                      </Button>
                                      {!vehicle.isStolen && (
                                        <Button 
                                          variant="destructive" 
                                          size="sm"
                                          onClick={() => markStolenMutation.mutate(vehicle.id)}
                                          disabled={markStolenMutation.isPending}
                                        >
                                          <span className="material-icons-round text-sm mr-1">report</span>
                                          Stolen
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <span className="material-icons-round text-4xl text-gray-300">directions_car</span>
                            <p className="mt-2 text-gray-500">No vehicles found</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="stolen" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : vehicles && vehicles.filter(v => v.isStolen).length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>License Plate</TableHead>
                                  <TableHead>Owner</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Last Seen</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {vehicles.filter(v => v.isStolen).map((vehicle) => (
                                  <TableRow key={vehicle.id}>
                                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                                    <TableCell>{vehicle.owner || 'Unknown'}</TableCell>
                                    <TableCell>{vehicle.vehicleType || 'Unknown'}</TableCell>
                                    <TableCell>{new Date(vehicle.lastSeen).toRelativeTime()}</TableCell>
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
                            <p className="mt-2 text-gray-500">No stolen vehicles in the database</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="recent" className="mt-4">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                          </div>
                        ) : vehicles ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>License Plate</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Location</TableHead>
                                  <TableHead>Time</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {vehicles.sort((a, b) => 
                                  new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
                                ).slice(0, 10).map((vehicle) => (
                                  <TableRow key={vehicle.id}>
                                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                                    <TableCell>
                                      {vehicle.isStolen ? (
                                        <Badge variant="destructive">Stolen</Badge>
                                      ) : (
                                        <Badge variant="outline">Clear</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>{vehicle.location || 'Unknown'}</TableCell>
                                    <TableCell>{new Date(vehicle.lastSeen).toRelativeTime()}</TableCell>
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
                            <span className="material-icons-round text-4xl text-gray-300">directions_car</span>
                            <p className="mt-2 text-gray-500">No vehicles found</p>
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

export default LicensePlate;
