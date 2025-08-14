import { Suspense } from 'react'
import StatsCards from './components/StatsCards'
import RecentActivity from './components/RecentActivity'
import SystemStatus from './components/SystemStatus'
import GeographicDistribution from './components/GeographicDistribution'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your Global Sound Database
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg" />}>
        <StatsCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <SystemStatus />
        </Suspense>
        
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
          <GeographicDistribution />
        </Suspense>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}