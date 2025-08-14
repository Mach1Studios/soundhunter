'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, PlayIcon, MapPinIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const floatingElements = [
  { icon: MusicalNoteIcon, top: '10%', left: '10%', delay: 0 },
  { icon: MapPinIcon, top: '20%', right: '15%', delay: 0.5 },
  { icon: PlayIcon, bottom: '30%', left: '5%', delay: 1 },
  { icon: MusicalNoteIcon, bottom: '20%', right: '10%', delay: 1.5 },
]

const quickSearches = [
  'Nature sounds',
  'Urban ambience', 
  'Classical music',
  'Field recordings',
  'Electronic',
  'Jazz sessions'
]

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="hero-section relative py-20 lg:py-32">
      {/* Floating background elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="floating-element"
          style={{
            top: element.top,
            left: element.left,
            right: element.right,
            bottom: element.bottom,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: element.delay, duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          <element.icon className="w-16 h-16 text-primary-500" />
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover the{' '}
            <span className="gradient-text">World of Audio</span>
          </motion.h1>
          
          <motion.p 
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore thousands of audio recordings from around the globe. 
            Search by location, mood, genre, or let serendipity guide your journey.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="mx-auto mt-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                className="search-input pl-14 pr-32"
                placeholder="Search sounds, places, moods, or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Search Tags */}
          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-sm text-gray-500 mr-2">Try:</span>
            {quickSearches.map((search, index) => (
              <button
                key={search}
                className="tag tag-primary hover:scale-105 transform transition-all duration-200"
                onClick={() => setSearchQuery(search)}
              >
                {search}
              </button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">10K+</div>
              <div className="text-sm text-gray-600 mt-1">Audio Recordings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">50+</div>
              <div className="text-sm text-gray-600 mt-1">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">1K+</div>
              <div className="text-sm text-gray-600 mt-1">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-gray-600 mt-1">New Discoveries</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}