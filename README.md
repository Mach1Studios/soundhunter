# SoundHunter - Global Sound Database

A comprehensive platform for discovering, managing, and exploring audio recordings from around the world. SoundHunter consists of a powerful backend database system (GSD), an administrative portal, and a beautiful web client for public audio discovery.

## Project Overview

SoundHunter enables users to:
- **Discover** audio recordings from diverse global locations
- **Search** by geography, mood, genre, and audio characteristics
- **Explore** through an interactive world map interface
- **Manage** large-scale audio databases with advanced tooling
- **Analyze** audio content using vector similarity and geospatial queries

## Architecture

### Components

| Component | Purpose | Port | Technology |
|-----------|---------|------|------------|
| **GSD** | Backend database and services | Various | Docker Compose, PostgreSQL, OpenSearch, MinIO |
| **Admin Portal** | Database administration interface | 3002 | Next.js, TypeScript, Tailwind CSS |
| **Web Client** | Public audio discovery platform | 3003 | Next.js, Framer Motion, Howler.js |

### Technology Stack

#### Backend (GSD)
- **Database**: PostgreSQL 16 with PostGIS and pgvector extensions
- **Search**: OpenSearch 2.x with custom audio metadata indexing
- **Storage**: MinIO S3-compatible object storage
- **Caching**: Redis 7 for queuing and session management
- **Analytics**: Metabase for data visualization
- **Administration**: pgAdmin for database management

#### Frontend Applications
- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom design systems
- **Animations**: Framer Motion for smooth interactions
- **Audio**: Howler.js for advanced audio playback
- **Maps**: React Leaflet for interactive geographic exploration
- **Charts**: Recharts for data visualization

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Python 3.8+ (for database seeding)
- 8GB+ RAM recommended

### 1. Start the Backend Services

```bash
cd GSD
./start.sh
```

This will:
- Start all Docker services (PostgreSQL, MinIO, OpenSearch, Redis, Metabase)
- Seed the database with 10,000 synthetic audio records
- Create search indices
- Set up storage buckets

### 2. Launch the Admin Portal

```bash
cd admin-portal
npm install
npm run dev
```

Access at: http://localhost:3002

### 3. Launch the Web Client

```bash
cd web-client
npm install
npm run dev
```

Access at: http://localhost:3003

### 4. Verify Installation

- **Backend Health**: http://localhost:9200/_cluster/health
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin123)
- **Metabase**: http://localhost:3001
- **pgAdmin**: http://localhost:5050 (admin@gsd.local/admin123)

## Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| PostgreSQL | localhost:5432 | gsd_user/gsd_password |
| MinIO API | localhost:9000 | minioadmin/minioadmin123 |
| MinIO Console | http://localhost:9001 | minioadmin/minioadmin123 |
| OpenSearch | http://localhost:9200 | - |
| OpenSearch Dashboards | http://localhost:5601 | - |
| Redis | localhost:6379 | - |
| Metabase | http://localhost:3001 | - |
| pgAdmin | http://localhost:5050 | admin@gsd.local/admin123 |
| Admin Portal | http://localhost:3002 | - |
| Web Client | http://localhost:3003 | - |

## Project Structure

```
soundhunter/
├── GSD/                    # Backend database and services
│   ├── docker-compose.yml # Service orchestration
│   ├── init-scripts/      # Database initialization
│   ├── scripts/           # Management and seeding tools
│   ├── start.sh           # Startup script
│   └── README.md
├── admin-portal/          # Administration interface
│   ├── app/               # Next.js application
│   ├── components/        # UI components
│   ├── package.json
│   └── README.md
├── web-client/            # Public web application
│   ├── app/               # Next.js application
│   ├── components/        # UI components
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

## Key Features

### GSD (Global Sound Database)
- **Multi-format Support**: Mono, Stereo, Quad, Ambisonic FOA, Mach1 8-channel
- **Geospatial Indexing**: PostGIS-powered location queries
- **Vector Search**: Audio similarity using MFCC, spectral, and tempo features
- **Synthetic Data**: 10k+ realistic audio records with global distribution
- **Full-text Search**: Advanced search across all metadata fields

### Admin Portal
- **Dashboard**: Real-time statistics and system health
- **Audio Management**: Browse, filter, and manage recordings
- **User Administration**: Role-based access control
- **Analytics**: Geographic distribution and usage insights
- **System Monitoring**: Service health and performance metrics

### Web Client
- **Immersive Discovery**: Beautiful homepage with featured content
- **Interactive Map**: Explore sounds by geographic location
- **Advanced Search**: Multi-faceted search with smart filters
- **Audio Player**: Rich playback with waveform visualization
- **Social Features**: Collections, favorites, and sharing

## Management Commands

### Database Operations
```bash
cd GSD/scripts

# Check service health
python manage.py health

# View statistics
python manage.py stats

# Reset database with fresh data
python manage.py reset-db

# Custom seeding
python seed_database.py --users 100 --recordings 50000 --collections 500
```

### Search Operations
```bash
# Recreate search indices
python manage.py create-indices

# Reindex all audio recordings
python manage.py index-recordings

# Full reindex
python manage.py reindex
```

### Service Management
```bash
# Start all services
cd GSD && ./start.sh

# Stop services
docker-compose down

# Reset everything (removes all data)
docker-compose down -v
```

## Sample Data

The system generates diverse, realistic audio metadata:

### Geographic Coverage
- **50+ cities** across 6 continents
- **Realistic coordinates** with cultural context
- **Regional audio characteristics** reflecting local environments

### Audio Diversity
- **Formats**: WAV, FLAC, MP3, AAC, OGG, AIFF
- **Layouts**: Mono to 8-channel immersive audio
- **Quality**: 44.1kHz to 192kHz sample rates
- **Content**: Nature, urban, music, field recordings

### Metadata Richness
- **Geospatial**: Precise coordinates with location names
- **Temporal**: 5-year historical range
- **Content**: Tags, genres, moods, environments
- **Technical**: Audio features, quality metrics
- **Social**: User attribution, visibility settings

## Development

### Adding New Audio Layouts
1. Update `AUDIO_LAYOUTS` in `GSD/scripts/seed_database.py`
2. Add enum value in `GSD/init-scripts/02-schema.sql`
3. Update search mappings in `GSD/scripts/manage.py`

### Customizing the Admin Portal
1. Add new pages in `admin-portal/app/`
2. Update navigation in `components/Sidebar.tsx`
3. Create API routes for data fetching
4. Add charts using Recharts components

### Extending the Web Client
1. Create new pages in `web-client/app/`
2. Add components to `components/` directory
3. Update navigation in `components/Header.tsx`
4. Implement audio playback with Howler.js

## Deployment

### Docker Deployment
Each component includes Dockerfile for containerized deployment:

```bash
# Build and deploy GSD
cd GSD && docker-compose up -d

# Build admin portal
cd admin-portal && docker build -t gsd-admin .

# Build web client
cd web-client && docker build -t soundhunter-web .
```

### Production Considerations
- **Environment Variables**: Configure for production endpoints
- **SSL/TLS**: Enable HTTPS for all services
- **Scaling**: Use load balancers for high availability
- **Monitoring**: Set up logging and alerting
- **Backups**: Regular database and storage backups

## 🔍 Troubleshooting

### Common Issues

1. **Services Won't Start**
   ```bash
   docker info  # Check Docker status
   docker-compose logs  # View service logs
   ```

2. **Database Connection Issues**
   ```bash
   docker-compose exec postgres pg_isready -U gsd_user -d gsd
   ```

3. **Search Not Working**
   ```bash
   curl http://localhost:9200/_cluster/health
   ```

4. **Storage Issues**
   ```bash
   curl http://localhost:9000/minio/health/live
   ```

### Reset Everything
```bash
cd GSD
docker-compose down -v  # Removes all data
./start.sh              # Fresh start
```

