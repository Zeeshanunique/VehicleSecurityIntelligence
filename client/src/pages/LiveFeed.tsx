import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CameraFeed from '@/components/CameraFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Camera } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LiveFeed = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid-4');
  const [filterType, setFilterType] = useState('all');
  
  const { data: cameras, isLoading } = useQuery<Camera[]>({
    queryKey: ['/api/cameras'],
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getGridClassName = () => {
    switch (viewMode) {
      case 'grid-2':
        return 'grid-cols-1 md:grid-cols-2 gap-4';
      case 'grid-4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4';
      case 'grid-6':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3';
      case 'single':
        return 'grid-cols-1 gap-0';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4';
    }
  };

  const filteredCameras = cameras?.filter(camera => {
    if (filterType === 'all') return true;
    if (!camera.features) return false;
    
    switch (filterType) {
      case 'lpr':
        return camera.features.lpr === true;
      case 'facial':
        return camera.features.facial === true;
      case 'accident':
        return camera.features.accident === true;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-100 main-content">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center">
                  <h1 className="text-2xl font-semibold text-gray-900">Live CCTV Feeds</h1>
                  
                  <div className="flex flex-wrap mt-4 sm:mt-0 gap-2">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-icons-round text-gray-400">search</span>
                      </span>
                      <Input 
                        type="text" 
                        placeholder="Search cameras..." 
                        className="pl-10 pr-4 py-2 w-full sm:w-64" 
                      />
                    </div>
                    
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cameras</SelectItem>
                        <SelectItem value="lpr">LPR Enabled</SelectItem>
                        <SelectItem value="facial">Facial Recog.</SelectItem>
                        <SelectItem value="accident">Accident Det.</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="default">
                      <span className="material-icons-round mr-2">add</span>
                      Add Camera
                    </Button>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="live" className="w-full">
                <div className="px-6 py-2 border-b border-gray-200 flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="live">Live Feeds</TabsTrigger>
                    <TabsTrigger value="recordings">Recordings</TabsTrigger>
                    <TabsTrigger value="analytics">Camera Analytics</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={viewMode === 'single' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('single')}
                      className="px-2"
                    >
                      <span className="material-icons-round">crop_din</span>
                    </Button>
                    <Button 
                      variant={viewMode === 'grid-2' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('grid-2')}
                      className="px-2"
                    >
                      <span className="material-icons-round">dashboard</span>
                    </Button>
                    <Button 
                      variant={viewMode === 'grid-4' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('grid-4')}
                      className="px-2"
                    >
                      <span className="material-icons-round">grid_view</span>
                    </Button>
                    <Button 
                      variant={viewMode === 'grid-6' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('grid-6')}
                      className="px-2"
                    >
                      <span className="material-icons-round">apps</span>
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="live" className="p-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                  ) : filteredCameras && filteredCameras.length > 0 ? (
                    <div className={`grid ${getGridClassName()}`}>
                      {filteredCameras.map((camera) => (
                        <CameraFeed key={camera.id} camera={camera} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <span className="material-icons-round text-6xl text-gray-300">videocam_off</span>
                      <p className="mt-4 text-lg text-gray-500">No camera feeds available</p>
                      <p className="text-gray-400">Check your connection or add a new camera feed</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="recordings" className="p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <span className="material-icons-round text-6xl text-gray-300">history</span>
                    <h3 className="mt-4 text-xl font-medium text-gray-700">Camera Recordings</h3>
                    <p className="mt-2 text-gray-500">
                      Access and review historical camera footage with advanced search capabilities.
                    </p>
                    <Button className="mt-4">
                      <span className="material-icons-round mr-2">video_library</span>
                      Browse Recordings
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <span className="material-icons-round text-6xl text-gray-300">insights</span>
                    <h3 className="mt-4 text-xl font-medium text-gray-700">Camera Analytics</h3>
                    <p className="mt-2 text-gray-500">
                      View detailed statistics and analysis of your camera system performance.
                    </p>
                    <Button className="mt-4">
                      <span className="material-icons-round mr-2">assessment</span>
                      View Analytics
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveFeed;
