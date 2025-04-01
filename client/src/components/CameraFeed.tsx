import { useState, useEffect } from 'react';
import { Camera } from '@shared/schema';

interface CameraFeedProps {
  camera: Camera;
}

const CameraFeed = ({ camera }: CameraFeedProps) => {
  const [streamActive, setStreamActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    // In a real app, this would connect to a real stream
    // For this demo, we're using placeholder images
    const cameraType = camera.type?.toLowerCase() || '';
    
    if (cameraType.includes('traffic') || cameraType.includes('street')) {
      setImageUrl('https://images.unsplash.com/photo-1588611911086-80d8a533cd23?auto=format&fit=crop&w=800&h=400');
    } else if (cameraType.includes('highway')) {
      setImageUrl('https://images.unsplash.com/photo-1524397057410-1e775ed476f3?auto=format&fit=crop&w=800&h=400');
    } else if (cameraType.includes('mall') || cameraType.includes('public')) {
      setImageUrl('https://images.unsplash.com/photo-1604726023857-874886b00224?auto=format&fit=crop&w=800&h=400');
    } else {
      // Default image
      setImageUrl('https://images.unsplash.com/photo-1596557406243-a199626d1a84?auto=format&fit=crop&w=800&h=400');
    }
    
    // Simulate connection issues occasionally
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.8) {
        setStreamActive(false);
      }
    }, 5000 + Math.random() * 10000);
    
    return () => clearTimeout(timeoutId);
  }, [camera]);
  
  const getCameraFeatures = () => {
    const features = [];
    
    if (camera.features) {
      if ('lpr' in camera.features && camera.features.lpr) {
        features.push({
          icon: 'directions_car',
          label: 'LPR Active'
        });
      }
      
      if ('facial' in camera.features && camera.features.facial) {
        features.push({
          icon: 'face',
          label: 'FR Active'
        });
      }
      
      if ('accident' in camera.features && camera.features.accident) {
        features.push({
          icon: 'warning',
          label: 'AD Active'
        });
      }
    }
    
    return features.length > 0 ? features[0] : { icon: 'videocam', label: 'Monitoring' };
  };
  
  const feature = getCameraFeatures();

  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-900 card-zoom">
      <div className="absolute top-2 left-2 z-10 flex items-center space-x-1">
        {streamActive ? (
          <>
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-white text-xs bg-black bg-opacity-50 px-1.5 py-0.5 rounded">LIVE</span>
          </>
        ) : (
          <span className="text-white text-xs bg-black bg-opacity-50 px-1.5 py-0.5 rounded flex items-center">
            <span className="material-icons-round text-xs mr-1 text-gray-300">cloud_off</span>
            OFFLINE
          </span>
        )}
      </div>
      
      <div className="absolute top-2 right-2 z-10">
        <button className="text-white bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70">
          <span className="material-icons-round text-sm">fullscreen</span>
        </button>
      </div>
      
      <div className="transition-transform duration-300 ease-in-out card-zoom-image">
        {streamActive ? (
          <img 
            src={imageUrl}
            alt={`Feed from ${camera.name}`} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <span className="material-icons-round block mb-2">signal_wifi_off</span>
              <span className="text-sm">Connection lost</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">{camera.name}</div>
          <div className="flex items-center space-x-2">
            <span className="material-icons-round text-xs">{feature.icon}</span>
            <span className="text-xs">{feature.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;
