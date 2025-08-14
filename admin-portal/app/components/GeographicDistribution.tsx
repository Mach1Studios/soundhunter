'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data - would typically come from API
const data = [
  { country: 'United States', recordings: 2456 },
  { country: 'United Kingdom', recordings: 1823 },
  { country: 'Germany', recordings: 1567 },
  { country: 'Japan', recordings: 1234 },
  { country: 'France', recordings: 1098 },
  { country: 'Canada', recordings: 987 },
  { country: 'Australia', recordings: 876 },
  { country: 'Brazil', recordings: 765 },
  { country: 'South Korea', recordings: 654 },
  { country: 'India', recordings: 543 },
]

export default function GeographicDistribution() {
  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Geographic Distribution</h3>
        <p className="text-sm text-gray-600">Audio recordings by country</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="country" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="recordings" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Countries</span>
          <span className="font-medium text-gray-900">{data.length}</span>
        </div>
      </div>
    </div>
  )
}