import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Alert } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const AlertsSection = () => {
  const { toast } = useToast();
  
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return await apiRequest("PATCH", `/api/alerts/${alertId}`, { status: "resolved" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alert resolved",
        description: "The alert has been successfully resolved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to resolve alert",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const dismissAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return await apiRequest("PATCH", `/api/alerts/${alertId}`, { status: "dismissed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alert dismissed",
        description: "The alert has been dismissed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to dismiss alert",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const getBorderColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'border-red-500';
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-blue-500';
      default:
        return 'border-gray-500';
    }
  };

  const getStatusBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stolen vehicle':
        return 'warning';
      case 'person of interest':
        return 'face';
      case 'accident':
        return 'car_crash';
      case 'traffic violation':
        return 'speed';
      default:
        return 'notifications';
    }
  };

  const getIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stolen vehicle':
        return 'text-red-500';
      case 'person of interest':
        return 'text-yellow-500';
      case 'accident':
        return 'text-red-500';
      case 'traffic violation':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Active Alerts</h2>
          <Button variant="link" size="sm">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-gray-300">
              <div className="px-4 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Active Alerts</h2>
        <Button variant="link" size="sm">View All</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${getBorderColor(alert.severity)}`}>
              <div className="px-4 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className={`material-icons-round ${getIconColor(alert.type)} mr-3`}>{getAlertIcon(alert.type)}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-xs text-gray-500">{new Date(alert.timestamp).toRelativeTime()}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${getStatusBadge(alert.severity)} px-2 py-1 rounded-full`}>{alert.severity}</span>
                </div>
                
                {alert.details && alert.details.licensePlate && (
                  <p className="mt-2 text-sm text-gray-600">License Plate: <span className="font-medium">{alert.details.licensePlate}</span></p>
                )}
                
                {alert.details && alert.details.confidence && (
                  <p className="mt-2 text-sm text-gray-600">Match Confidence: <span className="font-medium">{alert.details.confidence}%</span></p>
                )}
                
                {alert.details && alert.details.severity && (
                  <p className="mt-2 text-sm text-gray-600">Severity: <span className="font-medium">{alert.details.severity}</span></p>
                )}
                
                {alert.details && alert.details.type && (
                  <p className="mt-2 text-sm text-gray-600">Type: <span className="font-medium">{alert.details.type}</span></p>
                )}
                
                {alert.location && (
                  <p className="text-sm text-gray-600">Location: <span className="font-medium">{alert.location}</span></p>
                )}
                
                <div className="mt-3 flex justify-between items-center">
                  <Button variant="link" size="sm" className="text-xs h-auto p-0">View Details</Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-gray-400 hover:text-gray-600"
                      onClick={() => resolveAlertMutation.mutate(alert.id)}
                      disabled={resolveAlertMutation.isPending}
                    >
                      <span className="material-icons-round text-sm">check_circle</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-gray-400 hover:text-gray-600"
                      onClick={() => dismissAlertMutation.mutate(alert.id)}
                      disabled={dismissAlertMutation.isPending}
                    >
                      <span className="material-icons-round text-sm">cancel</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <span className="material-icons-round text-4xl text-gray-300">notifications_off</span>
            <p className="mt-2 text-gray-500">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Add a relative time method to Date prototype
declare global {
  interface Date {
    toRelativeTime(): string;
  }
}

Date.prototype.toRelativeTime = function() {
  const now = new Date();
  const diffMs = now.getTime() - this.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  
  if (diffMin < 1) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  } else {
    return this.toLocaleDateString();
  }
};

export default AlertsSection;
