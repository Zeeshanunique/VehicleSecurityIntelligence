import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Camera, Alert } from '@shared/schema';

declare global {
  interface Window {
    google: any;
  }
}

interface MapFilterOption {
  id: string;
  label: string;
  active: boolean;
  color: string;
}

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filters, setFilters] = useState<MapFilterOption[]>([
    { id: 'all', label: 'All Incidents', active: true, color: 'bg-blue-500' },
    { id: 'accidents', label: 'Accidents', active: false, color: 'bg-red-500' },
    { id: 'violations', label: 'Traffic Violations', active: false, color: 'bg-yellow-500' },
    { id: 'stolen', label: 'Stolen Vehicles', active: false, color: 'bg-red-500' },
    { id: 'cameras', label: 'CCTV Locations', active: false, color: 'bg-blue-400' },
  ]);

  const { data: cameras } = useQuery<Camera[]>({
    queryKey: ['/api/cameras'],
  });

  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const toggleFilter = (filterId: string) => {
    if (filterId === 'all') {
      // If 'All Incidents' is selected, deactivate all other filters
      setFilters(filters.map(filter => ({
        ...filter,
        active: filter.id === 'all'
      })));
    } else {
      // If any other filter is selected, deactivate 'All Incidents'
      setFilters(filters.map(filter => {
        if (filter.id === 'all') {
          return { ...filter, active: false };
        }
        if (filter.id === filterId) {
          return { ...filter, active: !filter.active };
        }
        return filter;
      }));
    }
  };

  useEffect(() => {
    // Check if Google Maps is loaded
    if (window.google && window.google.maps && mapRef.current && !googleMapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to New York City
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });
      googleMapRef.current = map;
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Add markers if map is loaded and we have data
    if (googleMapRef.current && mapLoaded && (cameras || alerts)) {
      // Clear existing markers
      googleMapRef.current.data.forEach((feature: any) => {
        googleMapRef.current?.data.remove(feature);
      });

      // Add camera markers if cameras filter is active
      if (cameras && (filters.find(f => f.id === 'all')?.active || filters.find(f => f.id === 'cameras')?.active)) {
        cameras.forEach(camera => {
          if (camera.latitude && camera.longitude) {
            const cameraMarker = {
              position: new window.google.maps.LatLng(parseFloat(camera.latitude), parseFloat(camera.longitude)),
              map: googleMapRef.current,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#3B82F6",
                fillOpacity: 0.8,
                strokeWeight: 1,
                strokeColor: "#1E40AF"
              },
              title: camera.name
            };
            new window.google.maps.Marker(cameraMarker);
          }
        });
      }

      // Add alert markers based on active filters
      if (alerts) {
        const allActive = filters.find(f => f.id === 'all')?.active;
        
        alerts.forEach(alert => {
          // Skip if no location data or alert is not active
          if (!alert.location || alert.status !== 'active') return;
          
          // Try to extract lat/lng from location string (format: "lat,lng")
          const locationParts = alert.location.split(',');
          if (locationParts.length !== 2) return;
          
          const lat = parseFloat(locationParts[0]);
          const lng = parseFloat(locationParts[1]);
          if (isNaN(lat) || isNaN(lng)) return;
          
          let shouldShow = allActive;
          
          // Check individual filters
          if (!shouldShow) {
            if (alert.type.toLowerCase().includes('accident') && filters.find(f => f.id === 'accidents')?.active) {
              shouldShow = true;
            } else if (alert.type.toLowerCase().includes('violation') && filters.find(f => f.id === 'violations')?.active) {
              shouldShow = true;
            } else if (alert.type.toLowerCase().includes('stolen') && filters.find(f => f.id === 'stolen')?.active) {
              shouldShow = true;
            }
          }
          
          if (shouldShow) {
            let iconUrl = '';
            switch (alert.type.toLowerCase()) {
              case 'accident':
                iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
                break;
              case 'traffic violation':
                iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
                break;
              case 'stolen vehicle':
                iconUrl = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
                break;
              default:
                iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            }
            
            const alertMarker = {
              position: new window.google.maps.LatLng(lat, lng),
              map: googleMapRef.current,
              icon: iconUrl,
              title: alert.title
            };
            new window.google.maps.Marker(alertMarker);
          }
        });
      }
    }
  }, [cameras, alerts, filters, mapLoaded]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Map View</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <span className="material-icons-round text-sm mr-1">fullscreen</span>
              Expand
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <span className="material-icons-round text-sm mr-1">filter_list</span>
              Filters
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant={filter.active ? "secondary" : "outline"}
              size="sm"
              className={`flex items-center text-xs px-3 py-1 h-auto rounded-full ${filter.active ? 'bg-primary-100 text-primary-800 hover:bg-primary-200' : 'hover:bg-gray-200'}`}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.id !== 'all' && <span className={`w-2 h-2 ${filter.color} rounded-full mr-1`}></span>}
              {filter.label}
            </Button>
          ))}
        </div>
        
        <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
          {!mapLoaded && (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <span className="material-icons-round text-4xl text-gray-400">map</span>
                <p className="mt-2 text-sm text-gray-500">Loading map...</p>
              </div>
            </div>
          )}
          
          <div ref={mapRef} className="w-full h-full"></div>
          
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
      </div>
    </div>
  );
};

export default MapView;
