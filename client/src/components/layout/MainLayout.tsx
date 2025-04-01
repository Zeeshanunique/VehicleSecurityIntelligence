import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Bell, 
  Scan, 
  User, 
  AlertTriangle, 
  FileText, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

// Simple media query implementation until the import is fixed
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);
    
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));

  return (
    <NavLink to={to} className="block">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal h-12 px-4 mb-1",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Button>
    </NavLink>
  );
};

const Sidebar = ({ isMobile, isOpen, onClose }: { isMobile: boolean; isOpen: boolean; onClose: () => void }) => {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/license-plate-scanner", icon: Scan, label: "LPR Scanner" },
    { to: "/facial-recognition", icon: User, label: "Facial Recognition" },
    { to: "/alerts", icon: Bell, label: "Alerts" },
    { to: "/accident-detection", icon: AlertTriangle, label: "Accident Detection" },
    { to: "/vehicles", icon: Car, label: "Vehicles" },
    { to: "/reports-history", icon: FileText, label: "Reports & History" },
    { to: "/admin", icon: Settings, label: "Admin Panel" },
  ];

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center px-4 border-b">
        <h2 className="text-lg font-semibold">Vehicle Security</h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
            <X size={20} />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>
      </ScrollArea>
    </>
  );

  if (isMobile) {
    return (
      <>
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
        />
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-background border-r">
      {sidebarContent}
    </div>
  );
};

const MainLayout: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isMobile={isMobile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="md:pl-72 flex flex-col flex-1">
        {isMobile && (
          <div className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu size={20} />
            </Button>
            <h2 className="ml-2 text-lg font-semibold">Vehicle Security</h2>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* Child routes will render here */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 