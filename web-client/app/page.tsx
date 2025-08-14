import { Suspense } from 'react'
import HeroSection from './components/HeroSection'
import FeaturedSounds from './components/FeaturedSounds'
import ExploreCategories from './components/ExploreCategories'
import WorldMap from './components/WorldMap'
import RecentUploads from './components/RecentUploads'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg mx-8" />}>
        <FeaturedSounds />
      </Suspense>
      
      <ExploreCategories />
      
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg mx-8" />}>
        <WorldMap />
      </Suspense>
      
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg mx-8" />}>
        <RecentUploads />
      </Suspense>
    </div>
  )
}