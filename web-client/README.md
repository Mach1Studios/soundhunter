# Soundhunter - Cross-Platform Audio Discovery Client

A beautiful, modern web application for discovering and exploring audio recordings from around the world. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Immersive Discovery**: Beautiful homepage with featured sounds and categories
- **Advanced Search**: Multi-faceted search with filters, tags, and geographic queries
- **Interactive Map**: Explore sounds by location with an interactive world map
- **Audio Player**: Rich audio playback with waveform visualization
- **Collections**: Create and manage personal audio collections
- **Social Features**: Like, share, and follow other audio enthusiasts
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Audio**: Howler.js for audio playback
- **Maps**: React Leaflet for interactive maps
- **State Management**: SWR for data fetching and caching
- **UI Components**: Headless UI, Heroicons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running GSD backend services (see ../GSD/README.md)

### Installation

```bash
cd web-client
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
API_BASE_URL=http://localhost:3000/api
OPENSEARCH_URL=http://localhost:9200
MINIO_ENDPOINT=localhost:9000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### Development

```bash
npm run dev
```

The web client will be available at http://localhost:3003

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
web-client/
├── app/                    # Next.js 14 App Router
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Site footer
│   │   ├── HeroSection.tsx # Homepage hero
│   │   ├── FeaturedSounds.tsx
│   │   ├── ExploreCategories.tsx
│   │   ├── WorldMap.tsx
│   │   └── ...
│   ├── discover/          # Search and discovery pages
│   ├── map/               # Interactive map interface
│   ├── favorites/         # User favorites
│   ├── profile/           # User profile pages
│   ├── upload/            # Audio upload interface
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── public/                # Static assets
├── package.json
└── README.md
```

## Design System

### Colors

The application uses a carefully crafted color palette:

- **Primary**: Blue tones for main actions and branding
- **Accent**: Purple/pink gradient for highlights and special elements
- **Neutral**: Gray scale for text and backgrounds
- **Semantic**: Green (success), Red (error), Yellow (warning)

### Typography

- **Headings**: Inter font with various weights
- **Body**: Inter font, optimized for readability
- **Code**: Monospace font for technical elements

### Components

#### Buttons
```tsx
<button className="btn btn-primary">Primary Action</button>
<button className="btn btn-secondary">Secondary Action</button>
<button className="btn btn-accent">Special Action</button>
```

#### Cards
```tsx
<div className="card">Standard card</div>
<div className="card-elevated">Elevated card with hover effects</div>
```

#### Audio Player
```tsx
<div className="audio-player">
  <div className="waveform-container">
    {/* Waveform visualization */}
  </div>
  <div className="audio-progress">
    <div className="audio-progress-bar" style={{width: '45%'}} />
  </div>
</div>
```

## Key Features

### Homepage Experience
- **Hero Section**: Animated introduction with search functionality
- **Featured Sounds**: Curated audio highlights with playback
- **Category Explorer**: Visual category navigation
- **World Map**: Geographic sound distribution
- **Recent Uploads**: Latest community contributions

### Search & Discovery
- **Smart Search**: Full-text search with autocomplete
- **Advanced Filters**: Format, layout, location, date, mood, genre
- **Tag-based Navigation**: Explore by content tags
- **Similarity Search**: Find similar sounds using audio features
- **Saved Searches**: Bookmark frequent searches

### Audio Playback
- **Waveform Visualization**: Interactive audio waveforms
- **Playlist Support**: Queue multiple tracks
- **Keyboard Controls**: Space to play/pause, arrow keys for seeking
- **Background Playback**: Continue listening while browsing
- **Quality Selection**: Choose audio quality based on connection

### Interactive Map
- **Global View**: Explore sounds from around the world
- **Clustering**: Grouped markers for dense areas
- **Filters**: Filter by sound type, date, popularity
- **Street View Integration**: Visual context for recordings
- **Offline Support**: Cached map tiles for offline browsing

### Social Features
- **User Profiles**: Showcase uploaded sounds and collections
- **Following System**: Follow favorite contributors
- **Collections**: Create themed playlists
- **Sharing**: Share individual sounds or collections
- **Comments**: Community discussion on recordings

## Performance Optimizations

### Loading Performance
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component with WebP
- **Font Optimization**: Preloaded web fonts
- **Critical CSS**: Inlined critical styles

### Runtime Performance
- **Virtual Scrolling**: Efficient rendering of large lists
- **Lazy Loading**: Components loaded on demand
- **Audio Streaming**: Progressive audio loading
- **Caching**: Aggressive caching of API responses

### Mobile Optimization
- **Touch Gestures**: Swipe navigation for mobile
- **Responsive Images**: Optimized images for different screen sizes
- **Offline Support**: Service worker for offline functionality
- **Progressive Web App**: Installable PWA experience

## Accessibility

### WCAG Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Clear focus indicators
- **Alternative Text**: Descriptive alt text for images

### Audio Accessibility
- **Transcriptions**: Text transcriptions for audio content
- **Visual Indicators**: Visual feedback for audio events
- **Captions**: Closed captions where available
- **Audio Descriptions**: Descriptive audio for visual content

## API Integration

### Data Fetching
```tsx
import useSWR from 'swr'

function SoundsList() {
  const { data, error } = useSWR('/api/sounds', fetcher)
  
  if (error) return <ErrorComponent />
  if (!data) return <LoadingComponent />
  
  return <SoundGrid sounds={data} />
}
```

### Real-time Updates
- **WebSocket Connection**: Live updates for new uploads
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful degradation on connection issues
- **Retry Logic**: Automatic retry for failed requests

## Deployment

### Vercel Deployment (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3003
CMD ["npm", "start"]
```

### Environment Variables

Production environment variables:
- `API_BASE_URL`: Backend API endpoint
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox API token
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics tracking ID
- `NEXTAUTH_SECRET`: Authentication secret
- `NEXTAUTH_URL`: Application URL

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Polyfills**: Automatic polyfills for missing features

## Contributing

### Development Guidelines
1. Follow the established design system
2. Write accessible components
3. Add proper TypeScript types
4. Include loading and error states
5. Test on multiple devices and browsers
6. Optimize for performance

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive component names
- Include JSDoc comments for complex functions

### Testing
```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:a11y     # Run accessibility tests
```

## Troubleshooting

### Common Issues

1. **Audio Playback Issues**
   - Check browser audio permissions
   - Verify audio file formats are supported
   - Test with different audio codecs

2. **Map Not Loading**
   - Verify Mapbox token is valid
   - Check network connectivity
   - Ensure HTTPS in production

3. **Search Not Working**
   - Verify API endpoints are accessible
   - Check OpenSearch connection
   - Validate search query format

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
DEBUG=soundhunter:*
```

## License

This project is part of the SoundHunter GSD system and follows the same licensing terms.