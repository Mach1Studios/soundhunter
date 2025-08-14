#!/usr/bin/env python3
"""
GSD Management Script
Provides utilities for managing the GSD database and services.
"""

import os
import sys
import json
import argparse
import subprocess
import time
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from opensearchpy import OpenSearch

# Configuration
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'gsd'),
    'user': os.getenv('DB_USER', 'gsd_user'),
    'password': os.getenv('DB_PASSWORD', 'gsd_password')
}

OPENSEARCH_CONFIG = {
    'host': os.getenv('OPENSEARCH_HOST', 'localhost'),
    'port': os.getenv('OPENSEARCH_PORT', '9200'),
    'use_ssl': False,
    'verify_certs': False
}

MINIO_CONFIG = {
    'endpoint': os.getenv('MINIO_ENDPOINT', 'localhost:9000'),
    'access_key': os.getenv('MINIO_ACCESS_KEY', 'minioadmin'),
    'secret_key': os.getenv('MINIO_SECRET_KEY', 'minioadmin123')
}

class GSDManager:
    def __init__(self):
        self.db_conn = None
        self.opensearch_client = None
    
    def connect_database(self):
        """Connect to PostgreSQL database"""
        try:
            self.db_conn = psycopg2.connect(**DATABASE_CONFIG)
            self.db_conn.autocommit = True
            print("Connected to database successfully")
            return True
        except Exception as e:
            print(f"Error connecting to database: {e}")
            return False
    
    def connect_opensearch(self):
        """Connect to OpenSearch"""
        try:
            self.opensearch_client = OpenSearch([{
                'host': OPENSEARCH_CONFIG['host'],
                'port': OPENSEARCH_CONFIG['port']
            }], **{k: v for k, v in OPENSEARCH_CONFIG.items() if k not in ['host', 'port']})
            
            # Test connection
            info = self.opensearch_client.info()
            print(f"Connected to OpenSearch: {info['version']['number']}")
            return True
        except Exception as e:
            print(f"Error connecting to OpenSearch: {e}")
            return False
    
    def check_services(self):
        """Check if all services are running"""
        print("Checking service health...")
        
        services = {
            'PostgreSQL': self.check_postgres,
            'MinIO': self.check_minio,
            'OpenSearch': self.check_opensearch,
            'Redis': self.check_redis
        }
        
        results = {}
        for service_name, check_func in services.items():
            try:
                results[service_name] = check_func()
                status = "✓ UP" if results[service_name] else "✗ DOWN"
                print(f"  {service_name}: {status}")
            except Exception as e:
                results[service_name] = False
                print(f"  {service_name}: ✗ DOWN ({e})")
        
        return all(results.values())
    
    def check_postgres(self):
        """Check PostgreSQL connection"""
        try:
            conn = psycopg2.connect(**DATABASE_CONFIG)
            conn.close()
            return True
        except:
            return False
    
    def check_minio(self):
        """Check MinIO connection"""
        try:
            response = requests.get(f"http://{MINIO_CONFIG['endpoint']}/minio/health/live", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def check_opensearch(self):
        """Check OpenSearch connection"""
        try:
            response = requests.get(f"http://{OPENSEARCH_CONFIG['host']}:{OPENSEARCH_CONFIG['port']}", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def check_redis(self):
        """Check Redis connection"""
        try:
            import redis
            r = redis.Redis(host='localhost', port=6379, decode_responses=True)
            r.ping()
            return True
        except:
            return False
    
    def create_opensearch_indices(self):
        """Create OpenSearch indices for audio recordings"""
        if not self.opensearch_client:
            if not self.connect_opensearch():
                return False
        
        print("Creating OpenSearch indices...")
        
        # Audio recordings index mapping
        audio_mapping = {
            "mappings": {
                "properties": {
                    "id": {"type": "keyword"},
                    "title": {
                        "type": "text",
                        "analyzer": "standard",
                        "fields": {
                            "keyword": {"type": "keyword"}
                        }
                    },
                    "description": {
                        "type": "text",
                        "analyzer": "standard"
                    },
                    "duration_seconds": {"type": "float"},
                    "sample_rate": {"type": "integer"},
                    "bit_depth": {"type": "integer"},
                    "channels": {"type": "integer"},
                    "layout": {"type": "keyword"},
                    "format": {"type": "keyword"},
                    "file_size_bytes": {"type": "long"},
                    "location": {"type": "geo_point"},
                    "location_name": {
                        "type": "text",
                        "fields": {
                            "keyword": {"type": "keyword"}
                        }
                    },
                    "country": {"type": "keyword"},
                    "region": {"type": "keyword"},
                    "city": {"type": "keyword"},
                    "recorded_at": {"type": "date"},
                    "uploaded_at": {"type": "date"},
                    "tags": {"type": "keyword"},
                    "genre": {"type": "keyword"},
                    "mood": {"type": "keyword"},
                    "environment": {"type": "keyword"},
                    "status": {"type": "keyword"},
                    "is_public": {"type": "boolean"},
                    "license": {"type": "keyword"},
                    "peak_amplitude": {"type": "float"},
                    "rms_amplitude": {"type": "float"},
                    "dynamic_range": {"type": "float"},
                    "signal_to_noise_ratio": {"type": "float"}
                }
            },
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 0,
                "analysis": {
                    "analyzer": {
                        "audio_analyzer": {
                            "type": "custom",
                            "tokenizer": "standard",
                            "filter": ["lowercase", "stop"]
                        }
                    }
                }
            }
        }
        
        try:
            # Delete index if it exists
            if self.opensearch_client.indices.exists(index="audio_recordings"):
                self.opensearch_client.indices.delete(index="audio_recordings")
                print("  Deleted existing audio_recordings index")
            
            # Create new index
            self.opensearch_client.indices.create(index="audio_recordings", body=audio_mapping)
            print("  Created audio_recordings index")
            
            return True
        except Exception as e:
            print(f"Error creating OpenSearch indices: {e}")
            return False
    
    def index_audio_recordings(self, batch_size: int = 1000):
        """Index audio recordings from database to OpenSearch"""
        if not self.db_conn:
            if not self.connect_database():
                return False
        
        if not self.opensearch_client:
            if not self.connect_opensearch():
                return False
        
        print("Indexing audio recordings to OpenSearch...")
        
        with self.db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Get total count
            cursor.execute("SELECT COUNT(*) as count FROM audio_recordings")
            total_count = cursor.fetchone()['count']
            print(f"  Total recordings to index: {total_count}")
            
            # Process in batches
            offset = 0
            indexed_count = 0
            
            while offset < total_count:
                cursor.execute("""
                    SELECT 
                        id, title, description, duration_seconds, sample_rate, bit_depth, channels,
                        layout, format, file_size_bytes,
                        ST_Y(location) as latitude, ST_X(location) as longitude,
                        location_name, country, region, city,
                        recorded_at, uploaded_at, tags, genre, mood, environment,
                        status, is_public, license,
                        peak_amplitude, rms_amplitude, dynamic_range, signal_to_noise_ratio
                    FROM audio_recordings
                    ORDER BY created_at
                    LIMIT %s OFFSET %s
                """, (batch_size, offset))
                
                records = cursor.fetchall()
                if not records:
                    break
                
                # Prepare bulk index operations
                bulk_data = []
                for record in records:
                    doc = dict(record)
                    
                    # Convert location to geo_point format
                    if doc['latitude'] and doc['longitude']:
                        doc['location'] = {
                            'lat': doc['latitude'],
                            'lon': doc['longitude']
                        }
                    
                    # Remove individual lat/lon fields
                    doc.pop('latitude', None)
                    doc.pop('longitude', None)
                    
                    # Convert datetime objects to ISO format
                    for date_field in ['recorded_at', 'uploaded_at']:
                        if doc[date_field]:
                            doc[date_field] = doc[date_field].isoformat()
                    
                    bulk_data.append({
                        "index": {
                            "_index": "audio_recordings",
                            "_id": doc['id']
                        }
                    })
                    bulk_data.append(doc)
                
                # Bulk index
                try:
                    response = self.opensearch_client.bulk(body=bulk_data)
                    
                    # Check for errors
                    if response.get('errors'):
                        error_count = sum(1 for item in response['items'] if 'error' in item.get('index', {}))
                        print(f"    Batch had {error_count} errors")
                    
                    indexed_count += len(records)
                    print(f"    Indexed {indexed_count}/{total_count} recordings")
                    
                except Exception as e:
                    print(f"    Error indexing batch: {e}")
                
                offset += batch_size
        
        print(f"Indexing completed. {indexed_count} recordings indexed.")
        return True
    
    def reset_database(self):
        """Reset database by running seed script"""
        print("Resetting database...")
        
        try:
            result = subprocess.run([
                sys.executable, 'seed_database.py',
                '--users', '50',
                '--recordings', '10000',
                '--collections', '100'
            ], cwd=os.path.dirname(__file__), capture_output=True, text=True)
            
            if result.returncode == 0:
                print("Database reset successfully")
                return True
            else:
                print(f"Error resetting database: {result.stderr}")
                return False
        except Exception as e:
            print(f"Error running seed script: {e}")
            return False
    
    def reindex_all(self):
        """Recreate OpenSearch indices and reindex all data"""
        print("Reindexing all data...")
        
        if self.create_opensearch_indices():
            return self.index_audio_recordings()
        return False
    
    def get_stats(self):
        """Get database and search statistics"""
        if not self.db_conn:
            if not self.connect_database():
                return
        
        print("\n=== GSD Statistics ===")
        
        with self.db_conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Database stats
            stats_queries = [
                ("Users", "SELECT COUNT(*) as count FROM users"),
                ("Audio Recordings", "SELECT COUNT(*) as count FROM audio_recordings"),
                ("Collections", "SELECT COUNT(*) as count FROM collections"),
                ("Public Recordings", "SELECT COUNT(*) as count FROM audio_recordings WHERE is_public = true"),
                ("Total Audio Duration (hours)", "SELECT ROUND(SUM(duration_seconds)/3600, 2) as count FROM audio_recordings"),
                ("Total File Size (GB)", "SELECT ROUND(SUM(file_size_bytes)/1024/1024/1024, 2) as count FROM audio_recordings")
            ]
            
            for label, query in stats_queries:
                cursor.execute(query)
                result = cursor.fetchone()
                print(f"{label}: {result['count']}")
        
        # OpenSearch stats
        if self.opensearch_client or self.connect_opensearch():
            try:
                indices_stats = self.opensearch_client.indices.stats(index="audio_recordings")
                doc_count = indices_stats['indices']['audio_recordings']['total']['docs']['count']
                index_size = indices_stats['indices']['audio_recordings']['total']['store']['size_in_bytes']
                print(f"OpenSearch Documents: {doc_count}")
                print(f"OpenSearch Index Size (MB): {round(index_size/1024/1024, 2)}")
            except Exception as e:
                print(f"OpenSearch stats unavailable: {e}")

def main():
    parser = argparse.ArgumentParser(description='GSD Management Utilities')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Health check
    subparsers.add_parser('health', help='Check service health')
    
    # Database operations
    subparsers.add_parser('reset-db', help='Reset database with fresh seed data')
    
    # OpenSearch operations
    subparsers.add_parser('create-indices', help='Create OpenSearch indices')
    subparsers.add_parser('index-recordings', help='Index audio recordings to OpenSearch')
    subparsers.add_parser('reindex', help='Recreate indices and reindex all data')
    
    # Statistics
    subparsers.add_parser('stats', help='Show database and search statistics')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    manager = GSDManager()
    
    if args.command == 'health':
        manager.check_services()
    elif args.command == 'reset-db':
        manager.reset_database()
    elif args.command == 'create-indices':
        manager.create_opensearch_indices()
    elif args.command == 'index-recordings':
        manager.index_audio_recordings()
    elif args.command == 'reindex':
        manager.reindex_all()
    elif args.command == 'stats':
        manager.get_stats()

if __name__ == '__main__':
    main()