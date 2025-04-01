import { useQuery } from '@tanstack/react-query';
import { Activity } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const RecentActivity = () => {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  const getActivityTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'alert':
      case 'warning':
        return { icon: 'warning', className: 'bg-red-100 text-red-600' };
      case 'officer':
      case 'user':
        return { icon: 'person', className: 'bg-primary-100 text-primary-600' };
      case 'facial':
      case 'recognition':
        return { icon: 'face', className: 'bg-yellow-100 text-yellow-600' };
      case 'resolved':
      case 'success':
        return { icon: 'check_circle', className: 'bg-green-100 text-green-600' };
      default:
        return { icon: 'info', className: 'bg-blue-100 text-blue-600' };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="p-4">
          <div className="flow-root">
            <ul className="-mb-8">
              {[1, 2, 3, 4].map((i) => (
                <li key={i}>
                  <div className="relative pb-8">
                    {i < 4 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>}
                    <div className="relative flex space-x-3">
                      <div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <Skeleton className="h-4 w-60 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline">View All Activity</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="p-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities && activities.length > 0 ? (
              activities.slice(0, 4).map((activity, idx) => {
                const { icon, className } = getActivityTypeIcon(activity.activityType);
                const isLast = idx === Math.min(activities.length - 1, 3);
                
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {!isLast && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full ${className} flex items-center justify-center`}>
                            <span className="material-icons-round text-sm">{icon}</span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: activity.description }}></p>
                            {activity.details && activity.details.location && (
                              <p className="text-xs text-gray-500 mt-0.5">{activity.details.location}</p>
                            )}
                            {activity.details && activity.details.user && (
                              <p className="text-xs text-gray-500 mt-0.5">By {activity.details.user}</p>
                            )}
                          </div>
                          <div className="text-right text-xs whitespace-nowrap text-gray-500">
                            <time>{new Date(activity.timestamp).toRelativeTime()}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="text-center py-8">
                <span className="material-icons-round text-4xl text-gray-300">history_toggle_off</span>
                <p className="mt-2 text-gray-500">No recent activity</p>
              </li>
            )}
          </ul>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button variant="outline">View All Activity</Button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
