import { formatDistanceToNow } from 'date-fns'
import { PlayIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

// Mock data - would typically come from API
async function getRecordings() {
  return [
    {
      id: '1',
      title: 'Urban Soundscape #47',
      duration: 245.6,
      format: 'wav',
      layout: 'stereo',
      sampleRate: 48000,
      location: 'New York, United States',
      uploadedBy: 'john.doe@example.com',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'completed',
      isPublic: true,
    },
    {
      id: '2',
      title: 'Classical Piano Piece',
      duration: 187.3,
      format: 'flac',
      layout: 'stereo',
      sampleRate: 96000,
      location: 'Vienna, Austria',
      uploadedBy: 'composer@example.com',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      status: 'completed',
      isPublic: false,
    },
    {
      id: '3',
      title: 'Nature Sounds - Forest',
      duration: 1200.0,
      format: 'wav',
      layout: 'ambisonic_foa',
      sampleRate: 48000,
      location: 'Black Forest, Germany',
      uploadedBy: 'nature.recorder@example.com',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'processing',
      isPublic: true,
    },
    {
      id: '4',
      title: 'Electronic Experiment #12',
      duration: 156.8,
      format: 'wav',
      layout: 'mach1_8ch',
      sampleRate: 48000,
      location: 'Berlin, Germany',
      uploadedBy: 'electronic.artist@example.com',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: 'completed',
      isPublic: true,
    },
    {
      id: '5',
      title: 'Jazz Session Recording',
      duration: 2847.2,
      format: 'flac',
      layout: 'stereo',
      sampleRate: 96000,
      location: 'New Orleans, United States',
      uploadedBy: 'jazz.musician@example.com',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      status: 'completed',
      isPublic: false,
    },
  ]
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function getStatusBadge(status: string) {
  const styles = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800',
  }
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}>
      {status}
    </span>
  )
}

export default async function RecordingsTable() {
  const recordings = await getRecordings()

  return (
    <div className="card p-0">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Format</th>
              <th>Layout</th>
              <th>Location</th>
              <th>Uploaded By</th>
              <th>Uploaded</th>
              <th>Status</th>
              <th>Public</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recordings.map((recording) => (
              <tr key={recording.id} className="hover:bg-gray-50">
                <td>
                  <div className="flex items-center">
                    <PlayIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900">{recording.title}</div>
                      <div className="text-sm text-gray-500">ID: {recording.id}</div>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-gray-900">
                  {formatDuration(recording.duration)}
                </td>
                <td>
                  <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {recording.format.toUpperCase()}
                  </span>
                </td>
                <td className="text-sm text-gray-900">
                  {recording.layout.replace('_', ' ')}
                </td>
                <td className="text-sm text-gray-900">
                  {recording.location}
                </td>
                <td className="text-sm text-gray-900">
                  {recording.uploadedBy}
                </td>
                <td className="text-sm text-gray-500">
                  {formatDistanceToNow(recording.uploadedAt, { addSuffix: true })}
                </td>
                <td>
                  {getStatusBadge(recording.status)}
                </td>
                <td>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    recording.isPublic 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {recording.isPublic ? 'Public' : 'Private'}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing 1 to {recordings.length} of {recordings.length} results
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-secondary text-sm">Previous</button>
          <button className="btn btn-secondary text-sm">Next</button>
        </div>
      </div>
    </div>
  )
}