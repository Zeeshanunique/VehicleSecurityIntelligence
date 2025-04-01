import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Camera, Alert } from '@shared/schema';

const Maps = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [mapType, setMapType] = useState('roadmap');
  const [activeFilters, setActiveFilters] = useState<string[]>(['accidents', 'violations', 'stolen', 'cameras']);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { data: cameras } = useQuery<Camera[]>({
    queryKey: ['/api/cameras'],
  });

  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  useEffect(() => {
    // Check if Google Maps is loaded
    if (window.google && window.google.maps && mapRef.current && !googleMapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to New York City
        zoom: 12,
        mapTypeId: mapType,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
      });
      googleMapRef.current = map;
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (googleMapRef.current && mapType) {
      googleMapRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  useEffect(() => {
    // Add markers if map is loaded and we have data
    if (googleMapRef.current && mapLoaded && (cameras || alerts)) {
      // Clear existing markers
      googleMapRef.current.data.forEach((feature: any) => {
        googleMapRef.current?.data.remove(feature);
      });

      // Add camera markers if cameras filter is active
      if (cameras && activeFilters.includes('cameras')) {
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
        alerts.forEach(alert => {
          // Skip if no location data or alert is not active
          if (!alert.location || alert.status !== 'active') return;
          
          // Try to extract lat/lng from location string (format: "lat,lng")
          const locationParts = alert.location.split(',');
          if (locationParts.length !== 2) return;
          
          const lat = parseFloat(locationParts[0]);
          const lng = parseFloat(locationParts[1]);
          if (isNaN(lat) || isNaN(lng)) return;
          
          let shouldShow = false;
          
          // Check individual filters
          if (activeFilters.includes('accidents') && alert.type.toLowerCase().includes('accident')) {
            shouldShow = true;
          } else if (activeFilters.includes('violations') && alert.type.toLowerCase().includes('violation')) {
            shouldShow = true;
          } else if (activeFilters.includes('stolen') && alert.type.toLowerCase().includes('stolen')) {
            shouldShow = true;
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
  }, [cameras, alerts, activeFilters, mapLoaded]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 overflow-hidden bg-gray-100 main-content flex flex-col">
          <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex flex-wrap justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Maps & Analytics</h1>
              
              <div className="flex space-x-4 mt-4 sm:mt-0">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={mapType} onValueChange={setMapType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Map Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roadmap">Road Map</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button>
                  <span className="material-icons-round mr-2">add</span>
                  Add Region
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Button 
                variant={activeFilters.includes('accidents') ? "default" : "outline"} 
                size="sm"
                onClick={() => toggleFilter('accidents')}
                className="flex items-center"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                Accidents
              </Button>
              <Button 
                variant={activeFilters.includes('violations') ? "default" : "outline"} 
                size="sm"
                onClick={() => toggleFilter('violations')}
                className="flex items-center"
              >
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                Traffic Violations
              </Button>
              <Button 
                variant={activeFilters.includes('stolen') ? "default" : "outline"} 
                size="sm"
                onClick={() => toggleFilter('stolen')}
                className="flex items-center"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                Stolen Vehicles
              </Button>
              <Button 
                variant={activeFilters.includes('cameras') ? "default" : "outline"} 
                size="sm"
                onClick={() => toggleFilter('cameras')}
                className="flex items-center"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                CCTV Locations
              </Button>
              <Button 
                variant={activeFilters.includes('heatmap') ? "default" : "outline"} 
                size="sm"
                onClick={() => toggleFilter('heatmap')}
                className="flex items-center"
              >
                <span className="material-icons-round text-sm mr-1">grid_3x3</span>
                Crime Heatmap
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
            <div ref={mapRef} className="w-full h-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Maps;
