import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Search, Car, FileText, AlertTriangle, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const vehicleDetails = {
  plateNumber: 'MH 01 AB 1234',
  owner: 'John Smith',
  vehicleType: 'SUV',
  make: 'Toyota',
  model: 'Fortuner',
  year: '2019',
  color: 'White',
  registrationDate: '12/05/2019',
  registrationExpiry: '11/05/2024',
  insuranceStatus: 'Valid',
  taxStatus: 'Paid',
  emissions: 'Compliant',
  hsrpStatus: 'Valid',
  stolen: false,
  wanted: false,
  previousViolations: [
    { date: '15/03/2023', type: 'Speeding', location: 'Highway 101', status: 'Paid' },
    { date: '22/11/2022', type: 'Parking', location: 'City Center', status: 'Paid' }
  ]
};

interface ScanResult {
  isLoading: boolean;
  isSuccess: boolean;
  data?: typeof vehicleDetails;
  error?: string;
}

const LicensePlateScannerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('camera');
  const [plateNumber, setPlateNumber] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult>({ isLoading: false, isSuccess: false });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Start camera stream
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        toast({
          title: 'Camera Error',
          description: 'Failed to access camera. Please check permissions.',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: 'Camera Not Supported',
        description: 'Your browser does not support camera access.',
        variant: 'destructive'
      });
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Capture frame from video
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data URL from canvas
        const imageData = canvas.toDataURL('image/png');
        
        // Simulate sending to API for processing
        processImage(imageData);
      }
    }
  };

  // Process the captured image
  const processImage = (imageData: string) => {
    setScanResult({ isLoading: true, isSuccess: false });
    
    // Simulate API call delay
    setTimeout(() => {
      // Simulate successful detection
      setScanResult({ 
        isLoading: false, 
        isSuccess: true,
        data: vehicleDetails
      });
      
      toast({
        title: 'Plate Detected',
        description: `License plate ${vehicleDetails.plateNumber} successfully scanned.`,
      });
    }, 2000);
  };

  // Handle manual search form
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (plateNumber.trim() === '') {
      toast({
        title: 'Validation Error',
        description: 'Please enter a license plate number.',
        variant: 'destructive'
      });
      return;
    }
    
    setScanResult({ isLoading: true, isSuccess: false });
    
    // Simulate API call delay
    setTimeout(() => {
      // Match against our mock data (in a real app this would be a backend call)
      if (plateNumber.toUpperCase().replace(/\s/g, '') === vehicleDetails.plateNumber.replace(/\s/g, '')) {
        setScanResult({ 
          isLoading: false, 
          isSuccess: true,
          data: vehicleDetails
        });
      } else {
        setScanResult({ 
          isLoading: false, 
          isSuccess: false,
          error: 'No vehicle found with this license plate number.'
        });
        
        toast({
          title: 'Not Found',
          description: 'No vehicle matches the provided license plate.',
          variant: 'destructive'
        });
      }
    }, 1500);
  };

  // Clean up camera when component unmounts
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Switch to appropriate tab
  React.useEffect(() => {
    if (activeTab === 'camera' && !cameraActive) {
      startCamera();
    } else if (activeTab !== 'camera' && cameraActive) {
      stopCamera();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">License Plate Scanner</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan License Plate</CardTitle>
              <CardDescription>
                Use camera or enter license plate manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="camera">
                    <Camera className="mr-2 h-4 w-4" />
                    Camera
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <FileText className="mr-2 h-4 w-4" />
                    Manual Entry
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="camera" className="space-y-4">
                  <div className="relative border rounded-lg overflow-hidden aspect-video bg-muted">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover" 
                    />
                    {!cameraActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <Button onClick={startCamera}>
                          <Camera className="mr-2 h-4 w-4" />
                          Start Camera
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={captureFrame} 
                      disabled={!cameraActive || scanResult.isLoading}
                      className="px-8"
                    >
                      {scanResult.isLoading ? 'Processing...' : 'Scan Plate'}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="manual">
                  <form onSubmit={handleManualSearch} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="plateNumber" className="text-sm font-medium">
                        License Plate Number
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          id="plateNumber"
                          placeholder="e.g. MH 01 AB 1234"
                          value={plateNumber}
                          onChange={(e) => setPlateNumber(e.target.value)}
                        />
                        <Button type="submit" disabled={scanResult.isLoading}>
                          <Search className="mr-2 h-4 w-4" />
                          {scanResult.isLoading ? 'Searching...' : 'Search'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter the full license plate number including spaces
                      </p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {scanResult.isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Processing</CardTitle>
                <CardDescription>Analyzing license plate...</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center animate-pulse">
                  <Search className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <p>Please wait while we process the license plate...</p>
                  <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {scanResult.isSuccess && scanResult.data ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>Vehicle Details</CardTitle>
                  <CardDescription>Information for license plate {scanResult.data.plateNumber}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {scanResult.data.stolen ? (
                    <Badge variant="destructive" className="px-3 py-1 text-sm">
                      <ShieldAlert className="mr-1 h-4 w-4" />
                      STOLEN
                    </Badge>
                  ) : (
                    <Badge variant="default" className="px-3 py-1 text-sm bg-green-600">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      VALID
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-sm p-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Vehicle Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Owner</p>
                          <p className="font-medium">{scanResult.data.owner}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vehicle Type</p>
                          <p className="font-medium">{scanResult.data.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Make</p>
                          <p className="font-medium">{scanResult.data.make}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Model</p>
                          <p className="font-medium">{scanResult.data.model}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Year</p>
                          <p className="font-medium">{scanResult.data.year}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Color</p>
                          <p className="font-medium">{scanResult.data.color}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Registration & Status</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Registration Date</p>
                          <p className="font-medium">{scanResult.data.registrationDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Registration Expires</p>
                          <p className="font-medium">{scanResult.data.registrationExpiry}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Insurance</p>
                          <div className="flex items-center">
                            {scanResult.data.insuranceStatus === 'Valid' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Valid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3 w-3" />
                                Invalid
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tax Status</p>
                          <div className="flex items-center">
                            {scanResult.data.taxStatus === 'Paid' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3 w-3" />
                                Unpaid
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">HSRP Status</p>
                          <div className="flex items-center">
                            {scanResult.data.hsrpStatus === 'Valid' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Valid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3 w-3" />
                                Invalid
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Emissions</p>
                          <div className="flex items-center">
                            {scanResult.data.emissions === 'Compliant' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Compliant
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3 w-3" />
                                Non-Compliant
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Violations & History</h3>
                      {scanResult.data.previousViolations.length > 0 ? (
                        <div className="space-y-3">
                          {scanResult.data.previousViolations.map((violation, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{violation.type} Violation</p>
                                  <p className="text-sm text-muted-foreground">{violation.date} - {violation.location}</p>
                                </div>
                                <Badge variant="outline">{violation.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No previous violations found.</p>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Print Report</Button>
                <Button>Flag Vehicle</Button>
              </CardFooter>
            </Card>
          ) : scanResult.error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Results Found</AlertTitle>
              <AlertDescription>{scanResult.error}</AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
                <CardDescription>Scan a license plate to view details</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Car className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <p>No vehicle data to display</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the scanner or manual search to look up a vehicle
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicensePlateScannerPage; 