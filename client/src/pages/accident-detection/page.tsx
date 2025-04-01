import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, FileVideo, Clock, MapPin, AlertTriangle, Car, RefreshCw, Play, Pause, Download, CheckCircle, XCircle, Info, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";

// Mock data for accident incidents
const accidentIncidents = [
  {
    id: "INC-1023",
    timestamp: "2023-10-15T09:34:21",
    location: "Highway 101, Mile 28",
    coordinates: [73.9023, 18.4931],
    severity: "high",
    status: "processed",
    vehiclesInvolved: 2,
    type: "collision",
    videoSource: "Camera 12",
    injuries: "Suspected",
    emergencyDispatched: true,
    aiConfidence: 0.94,
    frames: [
      "https://plus.unsplash.com/premium_photo-1682092618105-59a8e453d98c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591018104374-f163881a88fd?q=80&w=2070&auto=format&fit=crop"
    ],
    description: "Multiple vehicle collision detected on highway. Emergency services were automatically dispatched. Traffic control measures initiated."
  },
  {
    id: "INC-1022",
    timestamp: "2023-10-14T16:52:38",
    location: "Central Junction, Downtown",
    coordinates: [73.8756, 18.5189],
    severity: "medium",
    status: "processed",
    vehiclesInvolved: 1,
    type: "single-vehicle",
    videoSource: "Camera 5",
    injuries: "None detected",
    emergencyDispatched: false,
    aiConfidence: 0.87,
    frames: [
      "https://images.unsplash.com/photo-1592805144716-feeccccef5ac?q=80&w=1932&auto=format&fit=crop"
    ],
    description: "Single vehicle incident. Vehicle appears to have swerved to avoid obstacle. No injuries detected, however vehicle is blocking partial lane."
  },
  {
    id: "INC-1018",
    timestamp: "2023-10-13T08:12:45",
    location: "Garden City Mall Entrance",
    coordinates: [73.9156, 18.5441],
    severity: "low",
    status: "processed",
    vehiclesInvolved: 2,
    type: "minor-collision",
    videoSource: "Camera 8",
    injuries: "None detected",
    emergencyDispatched: false,
    aiConfidence: 0.91,
    frames: [
      "https://images.unsplash.com/photo-1646855142503-2b6332ef1279?q=80&w=2070&auto=format&fit=crop"
    ],
    description: "Minor collision in parking area. Both vehicles sustained minimal damage. No injuries detected. Traffic flow unaffected."
  }
];

// Mapping severity to visual elements
const severityMap: Record<string, { color: string, label: string }> = {
  low: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', label: 'High' },
  critical: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', label: 'Critical' }
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Individual incident list item
const IncidentItem = ({ incident, onClick, isActive }: { 
  incident: typeof accidentIncidents[0], 
  onClick: () => void,
  isActive: boolean
}) => {
  return (
    <div 
      className={`p-3 border rounded-lg mb-3 cursor-pointer transition-colors ${isActive ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 flex-shrink-0 ${
          incident.severity === 'high' || incident.severity === 'critical' 
            ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
            : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
        }`}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{incident.id}</h4>
              <p className="text-sm text-muted-foreground">{incident.type.charAt(0).toUpperCase() + incident.type.slice(1).replace('-', ' ')}</p>
            </div>
            <Badge variant="outline" className={severityMap[incident.severity].color}>
              {severityMap[incident.severity].label}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{formatDate(incident.timestamp)}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="truncate max-w-[120px]">{incident.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t">
        <div className="flex items-center">
          <Car className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{incident.vehiclesInvolved} vehicle{incident.vehiclesInvolved !== 1 ? 's' : ''}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

const AccidentDetectionPage: React.FC = () => {
  const [activeCamera, setActiveCamera] = useState<string>("camera1");
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [detectionSensitivity, setDetectionSensitivity] = useState<number>(75);
  const [selectedIncident, setSelectedIncident] = useState<typeof accidentIncidents[0] | null>(null);
  const [activeTab, setActiveTab] = useState<string>("live");
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Simulated live processing using setInterval
  useEffect(() => {
    let processingInterval: NodeJS.Timeout | null = null;

    if (isProcessing) {
      processingInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            setIsProcessing(false);
            toast({
              title: "Processing complete",
              description: "Video analysis has been completed successfully",
            });
            return 0;
          }
          return prev + 5;
        });
      }, 300);
    }

    return () => {
      if (processingInterval) clearInterval(processingInterval);
    };
  }, [isProcessing]);

  // Handle upload action
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideo(file);
      toast({
        title: "Video uploaded",
        description: `File "${file.name}" ready for analysis`,
      });
    }
  };

  // Start video analysis
  const handleStartAnalysis = () => {
    if (!uploadedVideo) {
      toast({
        title: "No video selected",
        description: "Please upload a video file first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate setting up the video player with the uploaded file
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(uploadedVideo);
      videoRef.current.load();
    }
  };

  // Toggle camera monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(prev => !prev);
    toast({
      title: isMonitoring ? "Monitoring paused" : "Monitoring resumed",
      description: isMonitoring 
        ? "Accident detection is now paused. Manual monitoring required." 
        : "Automatic accident detection is now active.",
      variant: isMonitoring ? "destructive" : "default"
    });
  };

  // Render the accident details panel
  const renderIncidentDetails = () => {
    if (!selectedIncident) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{selectedIncident.id}</h3>
            <p className="text-muted-foreground">{selectedIncident.type.charAt(0).toUpperCase() + selectedIncident.type.slice(1).replace('-', ' ')}</p>
          </div>
          <Badge variant="outline" className={severityMap[selectedIncident.severity].color}>
            {severityMap[selectedIncident.severity].label} Severity
          </Badge>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {selectedIncident.frames.map((frame, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden border aspect-video">
              <img 
                src={frame} 
                alt={`Accident frame ${index + 1}`} 
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/70 hover:bg-black/70 text-white">
                  Frame {index + 1}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-3 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Time Detected</h4>
              <p>{formatDate(selectedIncident.timestamp)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
              <p>{selectedIncident.location}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Video Source</h4>
              <p>{selectedIncident.videoSource}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">AI Confidence</h4>
              <p>{Math.round(selectedIncident.aiConfidence * 100)}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t">
          <h4 className="font-medium">Incident Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Vehicles Involved</p>
                <p className="text-sm text-muted-foreground">{selectedIncident.vehiclesInvolved}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Injuries</p>
                <p className="text-sm text-muted-foreground">{selectedIncident.injuries}</p>
              </div>
            </div>
          </div>
          <p className="text-sm mt-4">{selectedIncident.description}</p>
        </div>

        <div className="pt-4 border-t flex justify-between">
          {selectedIncident.emergencyDispatched ? (
            <div className="flex items-center text-orange-600 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">Emergency services dispatched</p>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Info className="h-5 w-5 mr-2" />
              <p className="text-sm">No emergency dispatch required</p>
            </div>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Accident Detection</h1>
        <div className="flex items-center gap-2">
          <Select value={activeCamera} onValueChange={setActiveCamera}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cam-1">Highway Camera 1</SelectItem>
              <SelectItem value="cam-2">Highway Camera 2</SelectItem>
              <SelectItem value="cam-3">Downtown Junction</SelectItem>
              <SelectItem value="cam-4">Main St & 5th Ave</SelectItem>
              <SelectItem value="cam-5">Mall Entrance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={isMonitoring ? "default" : "outline"} onClick={toggleMonitoring}>
            {isMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isMonitoring ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live">Live Monitoring</TabsTrigger>
          <TabsTrigger value="analysis">Video Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex justify-between items-center">
                    <span>Live Feed</span>
                    {isMonitoring && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></span>
                        Monitoring
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg border aspect-video overflow-hidden relative">
                    <video 
                      className="w-full h-full object-cover" 
                      ref={videoRef}
                      autoPlay 
                      muted 
                      loop
                      poster="https://images.unsplash.com/photo-1618093500329-c147ea9fc700?q=80&w=2072&auto=format&fit=crop"
                    >
                      <source src="https://example.com/sample-video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {isMonitoring && (
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="animate-pulse h-3 w-3 rounded-full bg-red-600"></span>
                        <span className="text-xs bg-black/70 text-white px-2 py-1 rounded-full">REC</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
                      {activeCamera === 'cam-1' ? 'Highway Camera 1' : 
                       activeCamera === 'cam-2' ? 'Highway Camera 2' : 
                       activeCamera === 'cam-3' ? 'Downtown Junction' : 
                       activeCamera === 'cam-4' ? 'Main St & 5th Ave' : 'Mall Entrance'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground mr-2">Detection Sensitivity</span>
                      <Slider 
                        className="w-[100px]" 
                        value={[detectionSensitivity]} 
                        onValueChange={(value) => setDetectionSensitivity(value[0])}
                        max={100}
                        step={1}
                      />
                    </div>
                    <span className="text-sm">{detectionSensitivity}%</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Detection Settings</CardTitle>
                  <CardDescription>Adjust settings for accident detection system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">Automatic Emergency Dispatch</div>
                        <div className="text-sm text-muted-foreground">Automatically notify emergency services for critical accidents</div>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">Collision Detection</div>
                        <div className="text-sm text-muted-foreground">Detect vehicle collisions and impacts</div>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">Fire Detection</div>
                        <div className="text-sm text-muted-foreground">Detect vehicle fires and smoke</div>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="font-medium">Occupant Detection</div>
                        <div className="text-sm text-muted-foreground">Detect and count vehicle occupants</div>
                      </div>
                      <Switch checked={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Incidents</CardTitle>
                  <CardDescription>
                    {accidentIncidents.length} detected incidents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[550px] pr-3">
                    <div className="space-y-1">
                      {accidentIncidents.map(incident => (
                        <IncidentItem 
                          key={incident.id} 
                          incident={incident} 
                          onClick={() => setSelectedIncident(incident)}
                          isActive={selectedIncident?.id === incident.id}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Incidents</Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {selectedIncident && (
            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
                <CardDescription>
                  Information about the selected incident
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderIncidentDetails()}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Analysis</CardTitle>
              <CardDescription>
                Upload and analyze video footage for accident detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup defaultValue="camera" value={videoSource} onValueChange={setVideoSource} className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="camera" id="camera" />
                    <Label htmlFor="camera" className="flex items-center space-x-2 cursor-pointer">
                      <Camera className="h-5 w-5" />
                      <span>Camera Footage</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file" className="flex items-center space-x-2 cursor-pointer">
                      <FileVideo className="h-5 w-5" />
                      <span>Upload Video</span>
                    </Label>
                  </div>
                </RadioGroup>

                {videoSource === 'camera' ? (
                  <div className="space-y-4">
                    <Select defaultValue="cam-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cam-1">Highway Camera 1</SelectItem>
                        <SelectItem value="cam-2">Highway Camera 2</SelectItem>
                        <SelectItem value="cam-3">Downtown Junction</SelectItem>
                        <SelectItem value="cam-4">Main St & 5th Ave</SelectItem>
                        <SelectItem value="cam-5">Mall Entrance</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input id="start-time" type="datetime-local" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input id="end-time" type="datetime-local" className="mt-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={handleUploadClick}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                      <FileVideo className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">Upload Video for Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        {uploadedVideo ? `Selected: ${uploadedVideo.name}` : 'Click to browse or drag and drop'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Max file size: 500MB. Supported formats: MP4, MOV, AVI
                      </p>
                    </div>
                  </div>
                )}

                {isProcessing ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>Processing video...</span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      AI is analyzing the video for accidents. This may take a few minutes.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button onClick={handleStartAnalysis} className="flex-1">
                      Start Analysis
                    </Button>
                    <Button variant="outline">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detection Parameters</CardTitle>
              <CardDescription>
                Adjust parameters to fine-tune the accident detection system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Detection Sensitivity</Label>
                    <span className="text-sm">{detectionSensitivity}%</span>
                  </div>
                  <Slider 
                    value={[detectionSensitivity]} 
                    onValueChange={(value) => setDetectionSensitivity(value[0])}
                    max={100}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher sensitivity may detect more incidents but could increase false positives.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Collision Detection</h4>
                      <p className="text-sm text-muted-foreground">Detect vehicle collisions</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Vehicle Fire Detection</h4>
                      <p className="text-sm text-muted-foreground">Detect vehicle fires and smoke</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rollover Detection</h4>
                      <p className="text-sm text-muted-foreground">Detect vehicle rollovers</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Debris Detection</h4>
                      <p className="text-sm text-muted-foreground">Detect road debris from accidents</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccidentDetectionPage; 