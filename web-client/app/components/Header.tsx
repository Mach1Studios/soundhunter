'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  MapIcon,
  UserIcon
} from '@heroicons/react/24/outline'

// Official SoundHunter Logo Component
const SoundHunterLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 1000 1000" fill="currentColor">
    <g>
      <g>
        <g>
          <path d="m379.34 860c-198.5 0-360-161.5-360-360h240c0 66.17 53.83 120 120 120 66.17 0 120-53.83 120-120h240c0 198.5-161.49 360-360 360z"/>
          <path d="m979.34 500h-240c0-66.17-53.83-120-120-120-66.17 0-120 53.83-120 120h-240c0-198.5 161.5-360 360-360 198.51 0 360 161.5 360 360z"/>
        </g>
      </g>
    </g>
  </svg>
)

const navigation = [
  // { name: 'Discover', href: '/discover', icon: MagnifyingGlassIcon },
  { name: 'Map', href: '/map', icon: MapIcon },
  // { name: 'Profile', href: '/profile', icon: UserIcon },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-glass border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-sage-600 to-primary-700 rounded-xl shadow-lg">
                <SoundHunterLogo className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sage-700 to-primary-800 bg-clip-text text-transparent">SoundHunter</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-sage-700 hover:text-primary-600 transition-colors duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="search-input pl-12 pr-4"
                placeholder="Search sounds, locations, moods..."
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="btn btn-secondary">
              Sign In
            </button>
            <button className="btn btn-primary">
              Upload
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-sage-700 hover:text-primary-600 hover:bg-sage-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="search-input pl-12 pr-4"
              placeholder="Search sounds..."
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg border border-gray-200 mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                <button className="w-full btn btn-secondary">
                  Sign In
                </button>
                <button className="w-full btn btn-primary">
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}