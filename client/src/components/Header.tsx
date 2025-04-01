import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationsDropdown from "./NotificationsDropdown";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Close notifications when clicked outside
  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('#notificationBtn') && !target.closest('#notificationsPanel')) {
      setShowNotifications(false);
    }
  };

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between" onClick={handleClickOutside}>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="lg:hidden p-2 rounded hover:bg-primary-700 transition-colors text-white"
            onClick={toggleSidebar}
          >
            <span className="material-icons-round">menu</span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-semibold">IVCS</div>
            <div className="hidden md:block text-sm text-gray-300">Intelligent Vehicle Classification & Security</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative">
            <Button 
              id="notificationBtn" 
              variant="ghost"
              className="p-2 rounded-full hover:bg-primary-700 transition-colors relative text-white"
              onClick={toggleNotifications}
            >
              <span className="material-icons-round">notifications</span>
              <span className="absolute top-1 right-1 bg-orange-500 rounded-full w-2 h-2"></span>
            </Button>
            {showNotifications && <NotificationsDropdown />}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium">{user?.name || "Officer"}</div>
              <div className="text-xs text-gray-300">{user?.role || "Law Enforcement"}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-400 flex items-center justify-center text-white font-medium">
              <span>{user?.name ? user.name.split(' ').map(n => n[0]).join('') : "U"}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex text-white"
            onClick={logout}
          >
            <span className="material-icons-round text-sm mr-1">logout</span>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
