'use client'

import { useState } from 'react'
import { PlayIcon, PauseIcon, HeartIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

// Mock data - would typically come from API
const featuredSounds = [
  {
    id: '1',
    title: 'Tokyo Rain at Night',
    artist: 'Urban Explorer',
    location: 'Tokyo, Japan',
    duration: 245,
    waveform: Array.from({ length: 50 }, () => Math.random() * 100),
    tags: ['urban', 'rain', 'ambient', 'night'],
    isLiked: false,
    plays: 1247,
    image: '/api/placeholder/300/200',
  },
  {
    id: '2',
    title: 'Forest Dawn Chorus',
    artist: 'Nature Sounds',
    location: 'Black Forest, Germany',
    duration: 420,
    waveform: Array.from({ length: 50 }, () => Math.random() * 100),
    tags: ['nature', 'birds', 'forest', 'dawn'],
    isLiked: true,
    plays: 2156,
    image: '/api/placeholder/300/200',
  },
  {
    id: '3',
    title: 'Café Jazz Session',
    artist: 'The Midnight Trio',
    location: 'New Orleans, USA',
    duration: 312,
    waveform: Array.from({ length: 50 }, () => Math.random() * 100),
    tags: ['jazz', 'live', 'café', 'instrumental'],
    isLiked: false,
    plays: 892,
    image: '/api/placeholder/300/200',
  },
  {
    id: '4',
    title: 'Ocean Waves at Sunset',
    artist: 'Coastal Recordings',
    location: 'Big Sur, California',
    duration: 600,
    waveform: Array.from({ length: 50 }, () => Math.random() * 100),
    tags: ['ocean', 'waves', 'sunset', 'peaceful'],
    isLiked: true,
    plays: 3421,
    image: '/api/placeholder/300/200',
  },
]

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function SoundCard({ sound, index }: { sound: any, index: number }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(sound.isLiked)

  return (
    <motion.div
      className="card-elevated group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Waveform Background */}
      <div className="waveform-container mb-4">
        <div className="flex items-end justify-center h-full space-x-1 px-4">
          {sound.waveform.map((height: number, i: number) => (
            <div
              key={i}
              className={`waveform-bar ${isPlaying && i < 25 ? 'active' : ''}`}
              style={{ height: `${Math.max(height * 0.6, 10)}%`, width: '2px' }}
            />
          ))}
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="flex items-center justify-center w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 text-primary-600" />
            ) : (
              <PlayIcon className="w-6 h-6 text-primary-600 ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{sound.title}</h3>
            <p className="text-sm text-gray-600 truncate">{sound.artist}</p>
          </div>
          <button
            className="ml-2 p-1 hover:scale-110 transition-transform duration-200"
            onClick={() => setIsLiked(!isLiked)}
          >
            {isLiked ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPinIcon className="w-4 h-4" />
            <span className="truncate">{sound.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4" />
            <span>{formatDuration(sound.duration)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sound.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="tag text-xs">
              {tag}
            </span>
          ))}
          {sound.tags.length > 3 && (
            <span className="tag text-xs">+{sound.tags.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{sound.plays.toLocaleString()} plays</span>
          <div className="flex space-x-2">
            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              Share
            </button>
            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              Add to Collection
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function FeaturedSounds() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Featured Sounds
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Handpicked audio experiences from our global community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredSounds.map((sound, index) => (
          <SoundCard key={sound.id} sound={sound} index={index} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="btn btn-primary">
          Explore More Sounds
        </button>
      </div>
    </section>
  )
}