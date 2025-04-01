import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, User, AlertCircle, Search, UserX, Upload, FileImage, CheckCircle, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const personMatches = [
  {
    id: '1234',
    name: 'John Smith',
    age: 35,
    gender: 'Male',
    status: 'Wanted',
    reason: 'Armed Robbery',
    warrants: 2,
    lastSeen: '2023-09-15',
    confidenceScore: 94.5,
    image: 'https://i.pravatar.cc/150?img=14'
  }
];

const FacialRecognitionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchResults, setMatchResults] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        
        // Process the image
        processImage(imageData);
      }
    }
  };

  // Process the captured image
  const processImage = (imageData: string) => {
    setIsProcessing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Simulate face detection and matching
      setMatchFound(true);
      setMatchResults(personMatches[0]);
      setIsProcessing(false);
      
      toast({
        title: 'Match Found',
        description: 'Facial recognition detected a match in the database.',
        variant: 'default'
      });
    }, 2500);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process uploaded image
  const handleUploadProcess = () => {
    if (previewUrl) {
      processImage(previewUrl);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      // Clean up any preview URLs to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Switch camera on/off based on active tab
  useEffect(() => {
    if (activeTab === 'camera' && !cameraActive) {
      startCamera();
    } else if (activeTab !== 'camera' && cameraActive) {
      stopCamera();
    }
  }, [activeTab, cameraActive]);

  // Reset state when changing tabs
  useEffect(() => {
    setMatchFound(false);
    setMatchResults(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsProcessing(false);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Facial Recognition</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Database className="mr-2 h-4 w-4" />
            View Database
          </Button>
          <Button size="sm">
            <AlertCircle className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Face Detection & Recognition</CardTitle>
              <CardDescription>
                Use camera or upload an image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="camera">
                    <Camera className="mr-2 h-4 w-4" />
                    Camera
                  </TabsTrigger>
                  <TabsTrigger value="upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
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
                      disabled={!cameraActive || isProcessing}
                      className="px-8"
                    >
                      {isProcessing ? 'Processing...' : 'Scan Face'}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="border rounded-lg overflow-hidden aspect-video bg-muted flex items-center justify-center">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <div className="text-center p-8">
                        <FileImage className="mx-auto h-12 w-12 text-muted-foreground/60 mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload an image to scan for faces
                        </p>
                        <Button onClick={triggerFileInput} variant="secondary">
                          <Upload className="mr-2 h-4 w-4" />
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  <div className="flex justify-center space-x-2">
                    {previewUrl && (
                      <>
                        <Button variant="outline" onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}>
                          Change Image
                        </Button>
                        <Button 
                          onClick={handleUploadProcess} 
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Analyze Face'}
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle>Processing</CardTitle>
                <CardDescription>Analyzing facial features...</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center animate-pulse">
                  <User className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <p>Facial recognition in progress...</p>
                  <p className="text-sm text-muted-foreground mt-1">Comparing with database records</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {matchFound && matchResults ? (
            <Card>
              <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Match Found</CardTitle>
                    <CardDescription>Criminal record identified</CardDescription>
                  </div>
                  <Badge variant="destructive" className="px-3 py-1">
                    {matchResults.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="relative w-32 h-32 overflow-hidden rounded-lg border-4 border-red-200 dark:border-red-900/30">
                          <img 
                            src={matchResults.image} 
                            alt={matchResults.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-2 text-center sm:text-left">
                          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            Confidence: {matchResults.confidenceScore.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-grow space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold">{matchResults.name}</h2>
                          <p className="text-sm text-muted-foreground">ID: {matchResults.id}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p>{matchResults.age}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Gender</p>
                            <p>{matchResults.gender}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Outstanding Warrants</p>
                            <p>{matchResults.warrants}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Seen</p>
                            <p>{matchResults.lastSeen}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-lg mb-2">Criminal Record</h3>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wanted for {matchResults.reason}</AlertTitle>
                        <AlertDescription>
                          This individual is currently wanted by law enforcement. Consider dangerous.
                        </AlertDescription>
                      </Alert>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-lg mb-2">Recommended Actions</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <span>Contact local law enforcement immediately</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <span>Do not approach or engage directly</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <span>Monitor subject location if possible</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline">Print Report</Button>
                <Button>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Create Alert
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recognition Results</CardTitle>
                <CardDescription>Face scan results will appear here</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <UserX className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <p>No facial recognition results</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the camera or upload an image to identify individuals
                  </p>
                </div>
              </CardContent>
              <CardFooter className="text-center border-t p-4">
                <p className="text-sm text-muted-foreground w-full">
                  The system compares facial features against a database of known suspects and persons of interest
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacialRecognitionPage; 