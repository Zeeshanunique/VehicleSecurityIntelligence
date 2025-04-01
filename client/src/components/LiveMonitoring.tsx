import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Camera } from '@shared/schema';
import CameraFeed from './CameraFeed';

const LiveMonitoring = () => {
  const [isGridView, setIsGridView] = useState(true);
  
  const { data: cameras, isLoading } = useQuery<Camera[]>({
    queryKey: ['/api/cameras'],
  });

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Live Monitoring</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={toggleView}
            >
              <span className="material-icons-round text-sm mr-1">
                {isGridView ? 'view_list' : 'view_module'}
              </span>
              {isGridView ? 'List View' : 'Grid View'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-primary-600 bg-primary-50 hover:bg-primary-100 border-primary-200"
            >
              <span className="material-icons-round text-sm mr-1">add</span>
              Add Camera
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className={`grid ${isGridView ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
            {cameras && cameras.length > 0 ? (
              cameras.slice(0, 2).map((camera) => (
                <CameraFeed key={camera.id} camera={camera} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <span className="material-icons-round text-4xl text-gray-300">videocam_off</span>
                <p className="mt-2 text-gray-500">No camera feeds available</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 flex justify-center">
          <Button 
            variant="default"
            className="inline-flex items-center"
          >
            <span className="material-icons-round text-sm mr-1">visibility</span>
            View All Cameras
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
