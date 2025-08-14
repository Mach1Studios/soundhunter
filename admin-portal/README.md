# GSD Admin Portal

A comprehensive administration interface for the Global Sound Database, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Dashboard Overview**: Real-time statistics and system health monitoring
- **Audio Management**: Browse, filter, and manage audio recordings
- **User Administration**: User management with role-based access control
- **Collection Management**: Organize and curate audio collections
- **Search Interface**: Advanced search capabilities with filters
- **Analytics**: Detailed insights into usage patterns and geographic distribution
- **System Monitoring**: Health checks for all backend services
- **Settings Management**: Configuration and system preferences

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Database**: PostgreSQL with direct connections
- **State Management**: SWR for data fetching

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running GSD backend services (see ../GSD/README.md)

### Installation

```bash
cd admin-portal
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://gsd_user:gsd_password@localhost:5432/gsd
OPENSEARCH_URL=http://localhost:9200
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
```

### Development

```bash
npm run dev
```

The admin portal will be available at http://localhost:3002

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
admin-portal/
├── app/                    # Next.js 14 App Router
│   ├── components/         # Reusable UI components
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   ├── StatsCards.tsx  # Dashboard statistics
│   │   └── ...
│   ├── recordings/         # Audio recordings management
│   ├── users/             # User management
│   ├── collections/       # Collection management
│   ├── search/            # Search interface
│   ├── analytics/         # Analytics dashboard
│   ├── system/            # System health monitoring
│   ├── settings/          # Configuration
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── public/                # Static assets
├── package.json
└── README.md
```

## Key Features

### Dashboard
- Real-time system statistics
- Service health monitoring
- Recent activity feed
- Geographic distribution charts
- Quick action buttons

### Audio Recordings Management
- Paginated table with advanced filtering
- Search by title, description, tags, location
- Filter by format, layout, status, visibility
- Bulk operations (delete, update status, etc.)
- Audio preview and metadata editing
- File management integration with MinIO

### User Administration
- User list with role management
- Account activation/deactivation
- Permission management
- Activity tracking
- Bulk user operations

### Search Interface
- Full-text search across all audio metadata
- Geographic search with map interface
- Advanced filters (format, layout, date range)
- Saved searches and bookmarks
- Export search results

### Analytics
- Usage statistics and trends
- Geographic distribution analysis
- Popular content insights
- User engagement metrics
- Custom date range reporting

### System Monitoring
- Real-time service health checks
- Database connection monitoring
- Storage usage statistics
- Search index status
- Performance metrics

## API Integration

The admin portal connects directly to:

- **PostgreSQL**: Direct database queries for CRUD operations
- **OpenSearch**: Search functionality and analytics
- **MinIO**: File storage management
- **Redis**: Caching and session management

## Security Features

- Role-based access control
- Secure database connections
- Input validation and sanitization
- CSRF protection
- Rate limiting on sensitive operations

## Customization

### Adding New Pages

1. Create a new directory in `app/`
2. Add `page.tsx` for the main component
3. Update `components/Sidebar.tsx` navigation
4. Add any required API routes

### Styling

The portal uses Tailwind CSS with custom components defined in `globals.css`. Key classes:

- `.btn`, `.btn-primary`, `.btn-secondary` - Button styles
- `.card` - Card container
- `.input` - Form input styling
- `.table` - Table styling

### Charts and Visualizations

Uses Recharts for data visualization. Common chart types:
- Bar charts for geographic distribution
- Line charts for time series data
- Pie charts for categorical breakdowns
- Area charts for cumulative metrics

## Performance Considerations

- Server-side rendering for initial page loads
- Client-side data fetching with SWR for real-time updates
- Pagination for large datasets
- Lazy loading for heavy components
- Image optimization for audio waveforms

## Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
```

### Environment Variables

Production environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENSEARCH_URL`: OpenSearch endpoint
- `MINIO_ENDPOINT`: MinIO storage endpoint
- `REDIS_URL`: Redis connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `NEXTAUTH_URL`: Application URL

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify PostgreSQL is running
   - Check connection string format
   - Ensure database exists and user has permissions

2. **Search Not Working**
   - Verify OpenSearch is running on port 9200
   - Check if indices are created
   - Ensure data is indexed

3. **File Upload Issues**
   - Verify MinIO is accessible
   - Check bucket permissions
   - Ensure sufficient storage space

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
DEBUG=gsd:*
```

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Add proper error handling
4. Include loading states for async operations
5. Write descriptive commit messages
6. Test on multiple screen sizes

## License

This project is part of the SoundHunter GSD system and follows the same licensing terms.