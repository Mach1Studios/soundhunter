import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

// This would typically check actual service health
async function getSystemStatus() {
  // Mock data - replace with actual health checks
  return {
    services: [
      { name: 'PostgreSQL', status: 'healthy', uptime: '99.9%' },
      { name: 'MinIO', status: 'healthy', uptime: '99.8%' },
      { name: 'OpenSearch', status: 'healthy', uptime: '99.7%' },
      { name: 'Redis', status: 'healthy', uptime: '99.9%' },
      { name: 'Metabase', status: 'warning', uptime: '98.5%' },
    ],
    lastUpdated: new Date().toISOString(),
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'healthy':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    case 'warning':
      return <ClockIcon className="w-5 h-5 text-yellow-500" />
    case 'error':
      return <XCircleIcon className="w-5 h-5 text-red-500" />
    default:
      return <ClockIcon className="w-5 h-5 text-gray-500" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'healthy':
      return 'text-green-700 bg-green-50'
    case 'warning':
      return 'text-yellow-700 bg-yellow-50'
    case 'error':
      return 'text-red-700 bg-red-50'
    default:
      return 'text-gray-700 bg-gray-50'
  }
}

export default async function SystemStatus() {
  const systemStatus = await getSystemStatus()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">System Status</h3>
        <span className="text-sm text-gray-500">
          Last updated: {new Date(systemStatus.lastUpdated).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-4">
        {systemStatus.services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
            <div className="flex items-center">
              {getStatusIcon(service.status)}
              <span className="ml-3 font-medium text-gray-900">{service.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Uptime: {service.uptime}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Overall System Health</span>
          <span className="font-medium text-green-600">Operational</span>
        </div>
      </div>
    </div>
  )
}