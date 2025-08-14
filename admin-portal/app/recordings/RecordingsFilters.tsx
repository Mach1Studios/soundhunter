'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

export default function RecordingsFilters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedLayout, setSelectedLayout] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Recordings
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              className="input pl-10"
              placeholder="Search by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Format Filter */}
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <select
            id="format"
            className="input"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">All Formats</option>
            <option value="wav">WAV</option>
            <option value="flac">FLAC</option>
            <option value="mp3">MP3</option>
            <option value="aac">AAC</option>
            <option value="ogg">OGG</option>
            <option value="aiff">AIFF</option>
          </select>
        </div>

        {/* Layout Filter */}
        <div>
          <label htmlFor="layout" className="block text-sm font-medium text-gray-700 mb-2">
            Layout
          </label>
          <select
            id="layout"
            className="input"
            value={selectedLayout}
            onChange={(e) => setSelectedLayout(e.target.value)}
          >
            <option value="">All Layouts</option>
            <option value="mono">Mono</option>
            <option value="stereo">Stereo</option>
            <option value="quad">Quad</option>
            <option value="ambisonic_foa">Ambisonic FOA</option>
            <option value="mach1_8ch">Mach1 8ch</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            className="input"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {searchTerm || selectedFormat || selectedLayout || selectedStatus 
              ? 'Filters applied' 
              : 'No filters applied'
            }
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="btn btn-secondary text-sm"
            onClick={() => {
              setSearchTerm('')
              setSelectedFormat('')
              setSelectedLayout('')
              setSelectedStatus('')
            }}
          >
            Clear Filters
          </button>
          <button className="btn btn-primary text-sm">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}