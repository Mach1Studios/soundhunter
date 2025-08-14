#!/bin/bash

# GSD Startup Script
# Starts all services and initializes the database

set -e

echo "🎵 Starting GSD (Global Sound Database) Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.example .env
fi

# Start Docker Compose services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if PostgreSQL is ready
echo "🔍 Checking PostgreSQL connection..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U gsd_user -d gsd > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ PostgreSQL failed to start after $max_attempts attempts"
        exit 1
    fi
    
    echo "   Attempt $attempt/$max_attempts - PostgreSQL not ready yet..."
    sleep 2
    ((attempt++))
done

# Install Python dependencies
echo "📦 Installing Python dependencies..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

# Run database seeding
echo "🌱 Seeding database with sample data..."
cd scripts
python seed_database.py --users 50 --recordings 10000 --collections 100
cd ..

# Create OpenSearch indices and index data
echo "🔍 Setting up OpenSearch indices..."
cd scripts
python manage.py create-indices
python manage.py index-recordings
cd ..

echo ""
echo "🎉 GSD Environment is ready!"
echo ""
echo "📊 Service URLs:"
echo "   PostgreSQL:        localhost:5432"
echo "   MinIO Console:      http://localhost:9001 (minioadmin/minioadmin123)"
echo "   OpenSearch:         http://localhost:9200"
echo "   OpenSearch Dashboards: http://localhost:5601"
echo "   Metabase:          http://localhost:3001"
echo "   pgAdmin:           http://localhost:5050 (admin@gsd.local/admin123)"
echo ""
echo "🛠️  Management Commands:"
echo "   Check health:       cd scripts && python manage.py health"
echo "   View statistics:    cd scripts && python manage.py stats"
echo "   Reset database:     cd scripts && python manage.py reset-db"
echo "   Reindex search:     cd scripts && python manage.py reindex"
echo ""
echo "🔧 To stop services: docker-compose down"
echo "🗑️  To reset everything: docker-compose down -v"