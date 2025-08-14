'use client'

import { motion } from 'framer-motion'
import { PlayIcon, HeartIcon, ShareIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

// Mock data - would typically come from API
const recentUploads = [
  {
    id: 1,
    title: 'Thunderstorm Over the Prairie',
    artist: 'WeatherChaser',
    location: 'Kansas, USA',
    uploadedAt: '15 minutes ago',
    duration: '8:42',
    waveform: Array.from({ length: 30 }, () => Math.random() * 100),
    tags: ['storm', 'thunder', 'nature', 'prairie'],
    plays: 23,
    likes: 5,
  },
  {
    id: 2,
    title: 'Street Musician Violin',
    artist: 'CityCaptures',
    location: 'Vienna, Austria',
    uploadedAt: '32 minutes ago',
    duration: '4:18',
    waveform: Array.from({ length: 30 }, () => Math.random() * 100),
    tags: ['violin', 'street', 'classical', 'live'],
    plays: 67,
    likes: 12,
  },
  {
    id: 3,
    title: 'Monastery Bells at Dawn',
    artist: 'SacredSounds',
    location: 'Tibet, China',
    uploadedAt: '1 hour ago',
    duration: '6:55',
    waveform: Array.from({ length: 30 }, () => Math.random() * 100),
    tags: ['bells', 'monastery', 'spiritual', 'dawn'],
    plays: 145,
    likes: 28,
  },
  {
    id: 4,
    title: 'Underwater Whale Songs',
    artist: 'OceanExplorer',
    location: 'Pacific Ocean',
    uploadedAt: '2 hours ago',
    duration: '12:33',
    waveform: Array.from({ length: 30 }, () => Math.random() * 100),
    tags: ['whale', 'underwater', 'ocean', 'marine'],
    plays: 234,
    likes: 45,
  },
  {
    id: 5,
    title: 'Bamboo Forest Wind',
    artist: 'ZenRecordings',
    location: 'Kyoto, Japan',
    uploadedAt: '3 hours ago',
    duration: '10:21',
    waveform: Array.from({ length: 30 }, () => Math.random() * 100),
    tags: ['bamboo', 'wind', 'forest', 'zen'],
    plays: 189,
    likes: 37,
  },
  {
    id: 6,
    title: 'Market Square Chatter',
    artist: 'UrbanEthnographer',
    location: 'Marrakech, Morocco',
    uploadedAt: '4 hours ago',
    duration: '7:14',
    waveform: Array.from({ length: 30 }, () => Math.random() * 100),
    tags: ['market', 'voices', 'culture', 'arabic'],
    plays: 156,
    likes: 31,
  },
]

function UploadCard({ upload, index }: { upload: any, index: number }) {
  return (
    <motion.div
      className="card group cursor-pointer hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      {/* Waveform */}
      <div className="relative h-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden">
        <div className="flex items-end justify-center h-full space-x-1 px-2">
          {upload.waveform.map((height: number, i: number) => (
            <div
              key={i}
              className="bg-gradient-to-t from-primary-400 to-primary-600 rounded-sm transition-all duration-300 group-hover:from-accent-400 group-hover:to-accent-600"
              style={{ height: `${Math.max(height * 0.7, 8)}%`, width: '3px' }}
            />
          ))}
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform duration-200">
            <PlayIcon className="w-4 h-4 text-primary-600 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors duration-200">
            {upload.title}
          </h3>
          <p className="text-sm text-gray-600 truncate">by {upload.artist}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPinIcon className="w-3 h-3" />
            <span className="truncate">{upload.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-3 h-3" />
            <span>{upload.duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {upload.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="tag text-xs">
              {tag}
            </span>
          ))}
          {upload.tags.length > 2 && (
            <span className="tag text-xs">+{upload.tags.length - 2}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>{upload.plays} plays</span>
            <span>{upload.likes} likes</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200">
              <HeartIcon className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-primary-500 transition-colors duration-200">
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          {upload.uploadedAt}
        </div>
      </div>
    </motion.div>
  )
}

export default function RecentUploads() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <motion.h2 
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Fresh Uploads
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The latest sounds from our community of audio explorers
          </motion.p>
        </div>
        
        <motion.button 
          className="btn btn-secondary hidden sm:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          View All Recent
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentUploads.map((upload, index) => (
          <UploadCard key={upload.id} upload={upload} index={index} />
        ))}
      </div>

      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Ready to share your own audio discoveries?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary">
              Upload Your Recording
            </button>
            <button className="btn btn-secondary sm:hidden">
              View All Recent
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}