import { UsersIcon, MusicalNoteIcon, FolderIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

// This would typically fetch from your API
async function getStats() {
  // Mock data - replace with actual API calls
  return {
    totalUsers: 1247,
    totalRecordings: 10543,
    totalCollections: 156,
    totalCountries: 23,
    userGrowth: 12.5,
    recordingGrowth: 8.3,
    collectionGrowth: 15.2,
    countryGrowth: 4.2,
  }
}

export default async function StatsCards() {
  const stats = await getStats()

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.userGrowth}%`,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Audio Recordings',
      value: stats.totalRecordings.toLocaleString(),
      change: `+${stats.recordingGrowth}%`,
      icon: MusicalNoteIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Collections',
      value: stats.totalCollections.toLocaleString(),
      change: `+${stats.collectionGrowth}%`,
      icon: FolderIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Countries',
      value: stats.totalCountries.toLocaleString(),
      change: `+${stats.countryGrowth}%`,
      icon: GlobeAltIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="card">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                <p className="ml-2 text-sm font-medium text-green-600">{card.change}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}