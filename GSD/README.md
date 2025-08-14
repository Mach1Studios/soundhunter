# GSD (Global Sound Database) Backend

A comprehensive local development environment for the Global Sound Database, featuring synthetic audio metadata generation, geospatial indexing, and multi-format audio support.

## Features

- **Multi-format Audio Support**: Mono, Stereo, Quad, Ambisonic FOA, Mach1 8-channel layouts
- **Geospatial Database**: PostGIS-enabled PostgreSQL with worldwide location data
- **Vector Search**: pgvector integration for audio feature similarity search
- **Object Storage**: MinIO S3-compatible storage with organized buckets
- **Full-text Search**: OpenSearch integration with custom audio metadata indexing
- **Data Visualization**: Metabase for geographic and statistical visualizations
- **Synthetic Data**: Automated generation of 10k+ realistic audio records

## Architecture

### Services (Docker Compose)

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL + PostGIS + pgvector | 5432 | Primary database with geospatial and vector extensions |
| MinIO API | 9000 | S3-compatible object storage |
| MinIO Console | 9001 | Web interface for storage management |
| OpenSearch | 9200 | Search and analytics engine |
| OpenSearch Dashboards | 5601 | Search visualization interface |
| Redis | 6379 | Queue and caching (placeholder) |
| Metabase | 3001 | Business intelligence and mapping |
| pgAdmin | 5050 | Database administration interface |

### Storage Buckets

- `gsd-originals`: Original audio files
- `gsd-proxies`: Compressed/processed versions
- `gsd-analysis`: Analysis results and metadata

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.8+
- 8GB+ RAM recommended

### 1. Start the Environment

```bash
cd GSD
./start.sh
```

This script will:
- Start all Docker services
- Install Python dependencies
- Seed the database with 10,000 synthetic audio records
- Create OpenSearch indices
- Index all audio metadata for search

### 2. Access Services

- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin123)
- **OpenSearch Dashboards**: http://localhost:5601
- **Metabase**: http://localhost:3001
- **pgAdmin**: http://localhost:5050 (admin@gsd.local/admin123)

### 3. Verify Installation

```bash
cd scripts
python manage.py health
python manage.py stats
```

## Database Schema

### Core Tables

#### `audio_recordings`
Primary table storing audio metadata with:
- **Technical specs**: sample rate, bit depth, channels, layout, format
- **Geospatial data**: PostGIS point geometry with country/region/city
- **Audio features**: MFCC, spectral, and tempo feature vectors
- **Content metadata**: tags, genre, mood, environment
- **File references**: S3 paths for originals and proxies

#### `users`
User management with admin roles and authentication data

#### `collections`
Playlists/collections with many-to-many relationships to recordings

#### `analysis_jobs`
Background processing job tracking

### Key Features

- **Vector Similarity Search**: Find similar audio using MFCC, spectral, and tempo features
- **Geospatial Queries**: Search by location, distance, and geographic regions
- **Full-text Search**: Title and description search with PostgreSQL FTS
- **Multi-dimensional Indexing**: Optimized for complex audio queries

## Management Commands

### Database Operations

```bash
cd scripts

# Check service health
python manage.py health

# View statistics
python manage.py stats

# Reset database with fresh data
python manage.py reset-db

# Seed with custom counts
python seed_database.py --users 100 --recordings 50000 --collections 500
```

### Search Operations

```bash
# Recreate OpenSearch indices
python manage.py create-indices

# Reindex all audio recordings
python manage.py index-recordings

# Full reindex (recreate + reindex)
python manage.py reindex
```

## Sample Data

The seeding script generates diverse, realistic audio metadata:

### Geographic Distribution
- **50+ cities** across 6 continents
- **Realistic coordinates** with geographic clustering
- **Cultural audio diversity** reflecting regional characteristics

### Audio Formats
- **Layouts**: Mono, Stereo, Quad, Ambisonic FOA, Mach1 8-channel
- **Formats**: WAV, FLAC, MP3, AAC, OGG, AIFF
- **Quality**: Various sample rates (44.1kHz to 192kHz) and bit depths

### Content Categories
- **Genres**: Ambient, classical, electronic, folk, jazz, world music, field recordings
- **Environments**: Studio, concert hall, outdoor, urban, nature, underwater
- **Moods**: Calm, energetic, mysterious, contemplative, dramatic

### Technical Features
- **Audio vectors**: Realistic MFCC, spectral, and tempo feature distributions
- **File sizes**: Calculated based on format, quality, and duration
- **Timestamps**: 5-year historical range with realistic upload patterns

## Development

### Adding New Audio Layouts

1. Update `AUDIO_LAYOUTS` in `scripts/seed_database.py`
2. Add enum value to `audio_layout` type in `init-scripts/02-schema.sql`
3. Update OpenSearch mapping in `scripts/manage.py`

### Custom Seeding

Modify `seed_database.py` to:
- Add new geographic regions
- Include additional audio formats
- Customize content categories
- Adjust feature vector dimensions

### Search Customization

Update OpenSearch mappings in `manage.py` to:
- Add new searchable fields
- Modify analyzers for different languages
- Implement custom scoring algorithms

## Troubleshooting

### Services Won't Start

```bash
# Check Docker status
docker info

# View service logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
docker-compose exec postgres pg_isready -U gsd_user -d gsd

# Access database directly
docker-compose exec postgres psql -U gsd_user -d gsd
```

### OpenSearch Problems

```bash
# Check OpenSearch health
curl http://localhost:9200/_cluster/health

# View indices
curl http://localhost:9200/_cat/indices
```

### Reset Everything

```bash
# Stop and remove all data
docker-compose down -v

# Restart fresh
./start.sh
```

## Performance Notes

- **Vector indices**: Built using IVFFlat for approximate nearest neighbor search
- **Batch processing**: Seeding and indexing use batched operations
- **Memory usage**: OpenSearch configured for development (512MB heap)
- **Scaling**: Increase Docker resource limits for larger datasets

## Next Steps

This GSD backend provides the foundation for:
- **Admin Portal**: Database management and user administration
- **Web Client**: Public audio search and discovery interface
- **Mobile Apps**: iOS/Android clients with offline capabilities
- **API Services**: RESTful and GraphQL endpoints
- **Real-time Features**: WebSocket integration for live updates