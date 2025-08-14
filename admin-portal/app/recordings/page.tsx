import { Suspense } from 'react'
import RecordingsTable from './RecordingsTable'
import RecordingsFilters from './RecordingsFilters'

export default function RecordingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audio Recordings</h1>
          <p className="mt-2 text-gray-600">
            Manage and browse all audio recordings in the database
          </p>
        </div>
        <button className="btn btn-primary">
          Upload Recording
        </button>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-16 rounded-lg" />}>
        <RecordingsFilters />
      </Suspense>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
        <RecordingsTable />
      </Suspense>
    </div>
  )
}