import { formatDistanceToNow } from 'date-fns'
import { 
  MusicalNoteIcon, 
  UserPlusIcon, 
  FolderPlusIcon,
  TrashIcon,
  PencilIcon 
} from '@heroicons/react/24/outline'

// Mock data - would typically come from API
async function getRecentActivity() {
  return [
    {
      id: 1,
      type: 'recording_uploaded',
      description: 'New recording "Urban Soundscape #47" uploaded',
      user: 'john.doe@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      icon: MusicalNoteIcon,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
    },
    {
      id: 2,
      type: 'user_registered',
      description: 'New user registered',
      user: 'jane.smith@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      icon: UserPlusIcon,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      id: 3,
      type: 'collection_created',
      description: 'Collection "Nature Sounds Vol. 3" created',
      user: 'mike.wilson@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: FolderPlusIcon,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      id: 4,
      type: 'recording_updated',
      description: 'Recording metadata updated for "Jazz Session #12"',
      user: 'sarah.jones@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      icon: PencilIcon,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-50',
    },
    {
      id: 5,
      type: 'recording_deleted',
      description: 'Recording "Test Audio #123" deleted',
      user: 'admin@gsd.local',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      icon: TrashIcon,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50',
    },
    {
      id: 6,
      type: 'recording_uploaded',
      description: 'New recording "Classical Piano Piece" uploaded',
      user: 'composer@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      icon: MusicalNoteIcon,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
    },
  ]
}

export default async function RecentActivity() {
  const activities = await getRecentActivity()

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600">Latest actions across the platform</p>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconBg}`}>
                      <activity.icon className={`h-4 w-4 ${activity.iconColor}`} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">by {activity.user}</p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={activity.timestamp.toISOString()}>
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  )
}