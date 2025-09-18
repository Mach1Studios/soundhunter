'use client'

import { motion } from 'framer-motion'
import { 
  MusicalNoteIcon, 
  BuildingOffice2Icon, 
  GlobeAltIcon,
  MicrophoneIcon,
  SpeakerWaveIcon 
} from '@heroicons/react/24/outline'

const categories = [
  {
    name: 'Nature & Environment',
    description: 'Forest sounds, ocean waves, wildlife recordings',
    icon: GlobeAltIcon,
    count: '2,847',
    gradient: 'from-green-400 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
  },
  {
    name: 'Urban & City',
    description: 'Street ambience, traffic, city life recordings',
    icon: BuildingOffice2Icon,
    count: '1,923',
    gradient: 'from-gray-400 to-slate-600',
    bgGradient: 'from-gray-50 to-slate-50',
  },
  {
    name: 'Music & Performance',
    description: 'Live sessions, concerts, instrumental pieces',
    icon: MusicalNoteIcon,
    count: '3,156',
    gradient: 'from-purple-400 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
  },
  {
    name: 'Cultural & Traditional',
    description: 'Folk music, ceremonies, cultural expressions',
    icon: GlobeAltIcon,
    count: '1,234',
    gradient: 'from-orange-400 to-red-600',
    bgGradient: 'from-orange-50 to-red-50',
  },
  {
    name: 'Field Recordings',
    description: 'Raw captures, ambient spaces, found sounds',
    icon: MicrophoneIcon,
    count: '987',
    gradient: 'from-blue-400 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    name: 'Electronic & Experimental',
    description: 'Synthesized sounds, electronic compositions',
    icon: SpeakerWaveIcon,
    count: '756',
    gradient: 'from-pink-400 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-50',
  },
]

function CategoryCard({ category, index }: { category: any, index: number }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.bgGradient} p-8 cursor-pointer group hover:shadow-xl transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent transform rotate-12 scale-150" />
      </div>

      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <category.icon className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
            <span className="text-sm font-medium text-gray-600 bg-white/60 px-3 py-1 rounded-full">
              {category.count}
            </span>
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            {category.description}
          </p>

          <div className="pt-4">
            <span className="inline-flex items-center text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
              Explore category
              <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ExploreCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore by Category
        </motion.h2>
        <motion.p 
          className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Dive into curated collections of sounds organized by theme, environment, and style
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <CategoryCard key={category.name} category={category} index={index} />
        ))}
      </div>

      <motion.div 
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="text-gray-600 mb-6">
          Can't find what you're looking for?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn btn-secondary">
            Browse All Categories
          </button>
          <button className="btn btn-accent">
            Suggest a Category
          </button>
        </div>
      </motion.div>
    </section>
  )
}