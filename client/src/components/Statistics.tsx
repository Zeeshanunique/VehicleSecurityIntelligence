import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface StatData {
  id: string;
  label: string;
  value: number;
  change: number;
  icon: string;
  iconClassName: string;
  changeLabel: string;
}

const Statistics = () => {
  const { data: stats, isLoading } = useQuery<StatData[]>({
    queryKey: ['/api/stats'],
  });

  const getDefaultStats = (): StatData[] => [
    {
      id: 'vehicles',
      label: 'Vehicles Scanned',
      value: 2584,
      change: 8.2,
      icon: 'directions_car',
      iconClassName: 'bg-primary-100 text-primary-600',
      changeLabel: 'vs last week'
    },
    {
      id: 'alerts',
      label: 'Alerts Today',
      value: 48,
      change: 12.5,
      icon: 'warning',
      iconClassName: 'bg-yellow-100 text-yellow-600',
      changeLabel: 'vs yesterday'
    },
    {
      id: 'resolved',
      label: 'Resolved Cases',
      value: 36,
      change: 5.3,
      icon: 'check_circle',
      iconClassName: 'bg-green-100 text-green-600',
      changeLabel: 'vs yesterday'
    },
    {
      id: 'critical',
      label: 'Critical Alerts',
      value: 12,
      change: 18.7,
      icon: 'priority_high',
      iconClassName: 'bg-red-100 text-red-600',
      changeLabel: 'vs last week'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Use provided stats or fall back to default if none available
  const displayStats = stats || getDefaultStats();

  return (
    <div className="grid grid-cols-2 gap-4">
      {displayStats.map((stat) => (
        <div key={stat.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.iconClassName} mr-4`}>
              <span className="material-icons-round">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-semibold text-gray-900">{stat.value.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className={`${stat.change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              <span className="material-icons-round text-xs mr-1">
                {stat.change >= 0 ? 'arrow_upward' : 'arrow_downward'}
              </span>
              {Math.abs(stat.change)}%
            </span>
            <span className="text-gray-500 ml-2">{stat.changeLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
