import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside 
      className={cn(
        "w-64 bg-white shadow-md z-20 fixed lg:relative inset-y-0 left-0 transform transition duration-200 ease-in-out overflow-y-auto sidebar-height scrollbar-hide", 
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <nav className="pt-6 pb-8 px-4">
        <div className="space-y-8">
          <div>
            <div className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</div>
            <div className="space-y-1">
              <Link href="/">
                <a className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive("/") ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"
                )}>
                  <span className={cn(
                    "material-icons-round mr-3",
                    isActive("/") ? "text-primary-500" : "text-gray-500"
                  )}>dashboard</span>
                  <span>Dashboard</span>
                </a>
              </Link>
              <Link href="/maps">
                <a className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive("/maps") ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"
                )}>
                  <span className={cn(
                    "material-icons-round mr-3",
                    isActive("/maps") ? "text-primary-500" : "text-gray-500"
                  )}>map</span>
                  <span>Maps & Analytics</span>
                </a>
              </Link>
              <a href="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
                <span className="material-icons-round mr-3 text-gray-500">history</span>
                <span>Activity Log</span>
              </a>
            </div>
          </div>

          <div>
            <div className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monitoring</div>
            <div className="space-y-1">
              <Link href="/live-feed">
                <a className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive("/live-feed") ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"
                )}>
                  <span className={cn(
                    "material-icons-round mr-3",
                    isActive("/live-feed") ? "text-primary-500" : "text-gray-500"
                  )}>camera_alt</span>
                  <span>CCTV Feeds</span>
                </a>
              </Link>
              <Link href="/license-plate">
                <a className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive("/license-plate") ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"
                )}>
                  <span className={cn(
                    "material-icons-round mr-3",
                    isActive("/license-plate") ? "text-primary-500" : "text-gray-500"
                  )}>directions_car</span>
                  <span>License Plate Recognition</span>
                </a>
              </Link>
              <Link href="/facial-recognition">
                <a className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive("/facial-recognition") ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"
                )}>
                  <span className={cn(
                    "material-icons-round mr-3",
                    isActive("/facial-recognition") ? "text-primary-500" : "text-gray-500"
                  )}>face</span>
                  <span>Facial Recognition</span>
                </a>
              </Link>
              <Link href="/accident-detection">
                <a className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive("/accident-detection") ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"
                )}>
                  <span className={cn(
                    "material-icons-round mr-3",
                    isActive("/accident-detection") ? "text-primary-500" : "text-gray-500"
                  )}>warning</span>
                  <span>Accident Detection</span>
                </a>
              </Link>
            </div>
          </div>

          <div>
            <div className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</div>
            <div className="space-y-1">
              <a href="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
                <span className="material-icons-round mr-3 text-gray-500">report</span>
                <span>Reports</span>
              </a>
              <a href="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
                <span className="material-icons-round mr-3 text-gray-500">settings</span>
                <span>Settings</span>
              </a>
              <a href="#" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
                <span className="material-icons-round mr-3 text-gray-500">help</span>
                <span>Help Center</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
