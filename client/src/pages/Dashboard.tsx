import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AlertsSection from '@/components/AlertsSection';
import MapView from '@/components/MapView';
import LiveMonitoring from '@/components/LiveMonitoring';
import Statistics from '@/components/Statistics';
import RecentActivity from '@/components/RecentActivity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-100 main-content">
          <div className="container mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Security Dashboard</h1>
                <div className="flex space-x-4">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-icons-round text-gray-400">search</span>
                    </span>
                    <Input 
                      type="text" 
                      placeholder="Search..." 
                      className="pl-10 pr-4 py-2 w-full sm:w-64" 
                    />
                  </div>
                  <Button>
                    <span className="material-icons-round mr-2">add</span>
                    New Alert
                  </Button>
                </div>
              </div>
            </div>

            {/* Alerts Section */}
            <AlertsSection />

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Map and Activity Section (2/3 width) */}
              <div className="xl:col-span-2 space-y-6">
                <MapView />
                <LiveMonitoring />
              </div>
              
              {/* Statistics and Recent Activity (1/3 width) */}
              <div className="space-y-6">
                <Statistics />
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
