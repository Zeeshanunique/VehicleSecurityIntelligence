import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Alert } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface Notification extends Alert {
  read: boolean;
}

const NotificationsDropdown = () => {
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/notifications/mark-all-read", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Notifications marked as read",
        description: "All notifications have been marked as read."
      });
    }
  });

  const dismissNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("POST", `/api/notifications/${id}/dismiss`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }
  });

  const getNotificationIcon = (type: string, severity: string) => {
    if (type.toLowerCase().includes('system')) {
      return { icon: 'update', className: 'bg-yellow-100 text-yellow-600' };
    }
    if (type.toLowerCase().includes('alert')) {
      if (severity.toLowerCase() === 'critical') {
        return { icon: 'priority_high', className: 'bg-red-100 text-red-600' };
      }
      return { icon: 'notifications', className: 'bg-primary-100 text-primary-600' };
    }
    if (type.toLowerCase().includes('resolved')) {
      return { icon: 'check_circle', className: 'bg-green-100 text-green-600' };
    }
    return { icon: 'notifications', className: 'bg-primary-100 text-primary-600' };
  };

  return (
    <div id="notificationsPanel" className="absolute right-4 top-16 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-xs"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            Mark all as read
          </Button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification) => {
            const { icon, className } = getNotificationIcon(notification.type, notification.severity);
            
            return (
              <div 
                key={notification.id} 
                className={`py-2 px-4 border-b border-gray-100 ${!notification.read ? 'bg-primary-50' : ''}`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 pt-0.5">
                    <span className={`h-8 w-8 rounded-full ${className} flex items-center justify-center`}>
                      <span className={`material-icons-round text-sm`}>{icon}</span>
                    </span>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-500">{notification.description}</p>
                    
                    {!notification.read && (
                      <div className="mt-2 flex space-x-2">
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary-600">
                          View
                        </Button>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-xs text-gray-500"
                          onClick={() => dismissNotificationMutation.mutate(notification.id)}
                          disabled={dismissNotificationMutation.isPending}
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                    
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(notification.timestamp).toRelativeTime()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center">
            <span className="material-icons-round text-4xl text-gray-300">notifications_off</span>
            <p className="mt-2 text-sm text-gray-500">No notifications</p>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <Button variant="link" size="sm" className="w-full text-center text-xs">
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
