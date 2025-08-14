#!/usr/bin/env python3
"""
GSD Database Seeding Script
Generates synthetic audio metadata and populates the database with diverse geographical and temporal data.
"""

import os
import sys
import random
import json
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
import psycopg2
from psycopg2.extras import RealDictCursor
import numpy as np
from faker import Faker
from faker.providers import internet, person, date_time

# Configuration
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'gsd'),
    'user': os.getenv('DB_USER', 'gsd_user'),
    'password': os.getenv('DB_PASSWORD', 'gsd_password')
}

# Audio layouts and their channel counts
AUDIO_LAYOUTS = {
    'mono': 1,
    'stereo': 2,
    'quad': 4,
    'ambisonic_foa': 4,
    'mach1_8ch': 8
}

AUDIO_FORMATS = ['wav', 'flac', 'mp3', 'aac', 'ogg', 'aiff']

# Sample rates commonly used in audio production
SAMPLE_RATES = [44100, 48000, 96000, 192000, 22050, 88200]
BIT_DEPTHS = [16, 24, 32]

# Geographic regions with approximate coordinates
GEOGRAPHIC_REGIONS = [
    # North America
    {'region': 'North America', 'country': 'United States', 'cities': [
        {'name': 'New York', 'lat': 40.7128, 'lon': -74.0060},
        {'name': 'Los Angeles', 'lat': 34.0522, 'lon': -118.2437},
        {'name': 'Chicago', 'lat': 41.8781, 'lon': -87.6298},
        {'name': 'Austin', 'lat': 30.2672, 'lon': -97.7431},
        {'name': 'Seattle', 'lat': 47.6062, 'lon': -122.3321}
    ]},
    {'region': 'North America', 'country': 'Canada', 'cities': [
        {'name': 'Toronto', 'lat': 43.6532, 'lon': -79.3832},
        {'name': 'Vancouver', 'lat': 49.2827, 'lon': -123.1207},
        {'name': 'Montreal', 'lat': 45.5017, 'lon': -73.5673}
    ]},
    
    # Europe
    {'region': 'Europe', 'country': 'United Kingdom', 'cities': [
        {'name': 'London', 'lat': 51.5074, 'lon': -0.1278},
        {'name': 'Manchester', 'lat': 53.4808, 'lon': -2.2426},
        {'name': 'Edinburgh', 'lat': 55.9533, 'lon': -3.1883}
    ]},
    {'region': 'Europe', 'country': 'Germany', 'cities': [
        {'name': 'Berlin', 'lat': 52.5200, 'lon': 13.4050},
        {'name': 'Munich', 'lat': 48.1351, 'lon': 11.5820},
        {'name': 'Hamburg', 'lat': 53.5511, 'lon': 9.9937}
    ]},
    {'region': 'Europe', 'country': 'France', 'cities': [
        {'name': 'Paris', 'lat': 48.8566, 'lon': 2.3522},
        {'name': 'Lyon', 'lat': 45.7640, 'lon': 4.8357},
        {'name': 'Marseille', 'lat': 43.2965, 'lon': 5.3698}
    ]},
    
    # Asia
    {'region': 'Asia', 'country': 'Japan', 'cities': [
        {'name': 'Tokyo', 'lat': 35.6762, 'lon': 139.6503},
        {'name': 'Osaka', 'lat': 34.6937, 'lon': 135.5023},
        {'name': 'Kyoto', 'lat': 35.0116, 'lon': 135.7681}
    ]},
    {'region': 'Asia', 'country': 'South Korea', 'cities': [
        {'name': 'Seoul', 'lat': 37.5665, 'lon': 126.9780},
        {'name': 'Busan', 'lat': 35.1796, 'lon': 129.0756}
    ]},
    {'region': 'Asia', 'country': 'India', 'cities': [
        {'name': 'Mumbai', 'lat': 19.0760, 'lon': 72.8777},
        {'name': 'Delhi', 'lat': 28.7041, 'lon': 77.1025},
        {'name': 'Bangalore', 'lat': 12.9716, 'lon': 77.5946}
    ]},
    
    # Australia/Oceania
    {'region': 'Oceania', 'country': 'Australia', 'cities': [
        {'name': 'Sydney', 'lat': -33.8688, 'lon': 151.2093},
        {'name': 'Melbourne', 'lat': -37.8136, 'lon': 144.9631},
        {'name': 'Brisbane', 'lat': -27.4698, 'lon': 153.0251}
    ]},
    
    # South America
    {'region': 'South America', 'country': 'Brazil', 'cities': [
        {'name': 'São Paulo', 'lat': -23.5558, 'lon': -46.6396},
        {'name': 'Rio de Janeiro', 'lat': -22.9068, 'lon': -43.1729},
        {'name': 'Salvador', 'lat': -12.9714, 'lon': -38.5014}
    ]},
    {'region': 'South America', 'country': 'Argentina', 'cities': [
        {'name': 'Buenos Aires', 'lat': -34.6118, 'lon': -58.3960},
        {'name': 'Córdoba', 'lat': -31.4201, 'lon': -64.1888}
    ]},
    
    # Africa
    {'region': 'Africa', 'country': 'South Africa', 'cities': [
        {'name': 'Cape Town', 'lat': -33.9249, 'lon': 18.4241},
        {'name': 'Johannesburg', 'lat': -26.2041, 'lon': 28.0473}
    ]},
    {'region': 'Africa', 'country': 'Kenya', 'cities': [
        {'name': 'Nairobi', 'lat': -1.2921, 'lon': 36.8219}
    ]}
]

# Audio content categories
GENRES = [
    'ambient', 'classical', 'electronic', 'folk', 'jazz', 'rock', 'pop', 
    'world', 'experimental', 'field_recording', 'soundscape', 'nature',
    'urban', 'industrial', 'acoustic', 'orchestral', 'choral', 'solo'
]

MOODS = [
    'calm', 'energetic', 'melancholic', 'uplifting', 'mysterious', 'peaceful',
    'dramatic', 'playful', 'contemplative', 'intense', 'serene', 'nostalgic',
    'hopeful', 'dark', 'bright', 'ethereal', 'rhythmic', 'flowing'
]

ENVIRONMENTS = [
    'studio', 'concert_hall', 'church', 'outdoor', 'urban', 'nature', 
    'forest', 'beach', 'mountain', 'desert', 'cave', 'underwater',
    'street', 'park', 'home', 'club', 'theater', 'gallery'
]

TAGS_POOL = [
    'acoustic', 'electric', 'synthesized', 'vocal', 'instrumental', 'percussion',
    'strings', 'brass', 'woodwind', 'piano', 'guitar', 'drums', 'bass',
    'field_recording', 'binaural', 'stereo', 'surround', 'immersive',
    'live', 'studio', 'improvised', 'composed', 'traditional', 'contemporary',
    'experimental', 'minimal', 'complex', 'rhythmic', 'melodic', 'harmonic',
    'atonal', 'tonal', 'microtonal', 'processed', 'raw', 'clean', 'distorted'
]

class DatabaseSeeder:
    def __init__(self):
        self.fake = Faker()
        self.fake.add_provider(internet)
        self.fake.add_provider(person)
        self.fake.add_provider(date_time)
        self.conn = None
        
    def connect_db(self):
        """Connect to PostgreSQL database"""
        try:
            self.conn = psycopg2.connect(**DATABASE_CONFIG)
            self.conn.autocommit = True
            print("Connected to database successfully")
        except Exception as e:
            print(f"Error connecting to database: {e}")
            sys.exit(1)
    
    def close_db(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
    
    def generate_random_vector(self, dimensions: int) -> List[float]:
        """Generate a random vector for audio features"""
        return [random.uniform(-1.0, 1.0) for _ in range(dimensions)]
    
    def generate_location_data(self) -> Dict[str, Any]:
        """Generate random location data from predefined regions"""
        region_data = random.choice(GEOGRAPHIC_REGIONS)
        city_data = random.choice(region_data['cities'])
        
        # Add some randomness to coordinates (within ~10km radius)
        lat_offset = random.uniform(-0.1, 0.1)
        lon_offset = random.uniform(-0.1, 0.1)
        
        return {
            'latitude': city_data['lat'] + lat_offset,
            'longitude': city_data['lon'] + lon_offset,
            'location_name': f"{city_data['name']}, {region_data['country']}",
            'country': region_data['country'],
            'region': region_data['region'],
            'city': city_data['name']
        }
    
    def generate_audio_metadata(self) -> Dict[str, Any]:
        """Generate synthetic audio recording metadata"""
        layout = random.choice(list(AUDIO_LAYOUTS.keys()))
        channels = AUDIO_LAYOUTS[layout]
        format_type = random.choice(AUDIO_FORMATS)
        sample_rate = random.choice(SAMPLE_RATES)
        bit_depth = random.choice(BIT_DEPTHS)
        
        # Generate realistic duration (30 seconds to 2 hours)
        duration = random.uniform(30, 7200)
        
        # Calculate approximate file size based on format and quality
        if format_type in ['wav', 'aiff']:
            # Uncompressed
            file_size = int(duration * sample_rate * channels * (bit_depth / 8))
        elif format_type == 'flac':
            # Lossless compression (~50-70% of original)
            file_size = int(duration * sample_rate * channels * (bit_depth / 8) * 0.6)
        else:
            # Lossy compression (mp3, aac, ogg)
            bitrate = random.choice([128, 192, 256, 320])  # kbps
            file_size = int(duration * bitrate * 1000 / 8)
        
        location_data = self.generate_location_data()
        
        # Generate random tags (2-8 tags per recording)
        num_tags = random.randint(2, 8)
        tags = random.sample(TAGS_POOL, num_tags)
        
        # Generate recorded timestamp (within last 5 years)
        recorded_at = self.fake.date_time_between(start_date='-5y', end_date='now')
        
        return {
            'id': str(uuid.uuid4()),
            'title': self.fake.sentence(nb_words=random.randint(2, 6)).rstrip('.'),
            'description': self.fake.text(max_nb_chars=random.randint(100, 500)),
            'duration_seconds': round(duration, 3),
            'sample_rate': sample_rate,
            'bit_depth': bit_depth,
            'channels': channels,
            'layout': layout,
            'format': format_type,
            'file_size_bytes': file_size,
            'original_path': f"gsd-originals/{uuid.uuid4()}.{format_type}",
            'proxy_path': f"gsd-proxies/{uuid.uuid4()}.mp3",
            'latitude': location_data['latitude'],
            'longitude': location_data['longitude'],
            'location_name': location_data['location_name'],
            'country': location_data['country'],
            'region': location_data['region'],
            'city': location_data['city'],
            'recorded_at': recorded_at,
            'mfcc_features': self.generate_random_vector(13),
            'spectral_features': self.generate_random_vector(8),
            'tempo_features': self.generate_random_vector(4),
            'peak_amplitude': round(random.uniform(0.1, 1.0), 3),
            'rms_amplitude': round(random.uniform(0.05, 0.5), 3),
            'dynamic_range': round(random.uniform(10, 60), 3),
            'signal_to_noise_ratio': round(random.uniform(20, 80), 3),
            'tags': tags,
            'genre': random.choice(GENRES),
            'mood': random.choice(MOODS),
            'environment': random.choice(ENVIRONMENTS),
            'status': random.choice(['completed', 'completed', 'completed', 'processing', 'pending']),  # Bias toward completed
            'is_public': random.choice([True, False]),
            'license': random.choice(['CC0', 'CC BY', 'CC BY-SA', 'CC BY-NC', 'All Rights Reserved', None])
        }
    
    def create_users(self, count: int = 50) -> List[str]:
        """Create synthetic users"""
        print(f"Creating {count} users...")
        user_ids = []
        
        with self.conn.cursor() as cursor:
            for i in range(count):
                user_data = {
                    'id': str(uuid.uuid4()),
                    'username': self.fake.user_name() + str(random.randint(1, 9999)),
                    'email': self.fake.email(),
                    'password_hash': self.fake.sha256(),
                    'first_name': self.fake.first_name(),
                    'last_name': self.fake.last_name(),
                    'is_admin': i < 5,  # First 5 users are admins
                    'is_active': random.choice([True, True, True, False])  # Bias toward active
                }
                
                cursor.execute("""
                    INSERT INTO users (id, username, email, password_hash, first_name, last_name, is_admin, is_active)
                    VALUES (%(id)s, %(username)s, %(email)s, %(password_hash)s, %(first_name)s, %(last_name)s, %(is_admin)s, %(is_active)s)
                """, user_data)
                
                user_ids.append(user_data['id'])
                
                if (i + 1) % 10 == 0:
                    print(f"  Created {i + 1} users")
        
        print(f"Successfully created {count} users")
        return user_ids
    
    def create_audio_recordings(self, count: int = 10000, user_ids: List[str] = None):
        """Create synthetic audio recordings"""
        print(f"Creating {count} audio recordings...")
        
        if not user_ids:
            # Get existing user IDs
            with self.conn.cursor() as cursor:
                cursor.execute("SELECT id FROM users")
                user_ids = [row[0] for row in cursor.fetchall()]
        
        with self.conn.cursor() as cursor:
            for i in range(count):
                audio_data = self.generate_audio_metadata()
                audio_data['uploaded_by'] = random.choice(user_ids) if user_ids else None
                
                cursor.execute("""
                    INSERT INTO audio_recordings (
                        id, title, description, duration_seconds, sample_rate, bit_depth, channels,
                        layout, format, file_size_bytes, original_path, proxy_path,
                        location, location_name, country, region, city, recorded_at,
                        mfcc_features, spectral_features, tempo_features,
                        peak_amplitude, rms_amplitude, dynamic_range, signal_to_noise_ratio,
                        tags, genre, mood, environment, status, uploaded_by, is_public, license
                    ) VALUES (
                        %(id)s, %(title)s, %(description)s, %(duration_seconds)s, %(sample_rate)s, %(bit_depth)s, %(channels)s,
                        %(layout)s, %(format)s, %(file_size_bytes)s, %(original_path)s, %(proxy_path)s,
                        ST_SetSRID(ST_MakePoint(%(longitude)s, %(latitude)s), 4326), %(location_name)s, %(country)s, %(region)s, %(city)s, %(recorded_at)s,
                        %(mfcc_features)s, %(spectral_features)s, %(tempo_features)s,
                        %(peak_amplitude)s, %(rms_amplitude)s, %(dynamic_range)s, %(signal_to_noise_ratio)s,
                        %(tags)s, %(genre)s, %(mood)s, %(environment)s, %(status)s, %(uploaded_by)s, %(is_public)s, %(license)s
                    )
                """, audio_data)
                
                if (i + 1) % 1000 == 0:
                    print(f"  Created {i + 1} recordings")
        
        print(f"Successfully created {count} audio recordings")
    
    def create_collections(self, count: int = 100, user_ids: List[str] = None):
        """Create synthetic collections"""
        print(f"Creating {count} collections...")
        
        if not user_ids:
            with self.conn.cursor() as cursor:
                cursor.execute("SELECT id FROM users")
                user_ids = [row[0] for row in cursor.fetchall()]
        
        # Get recording IDs for adding to collections
        with self.conn.cursor() as cursor:
            cursor.execute("SELECT id FROM audio_recordings LIMIT 5000")
            recording_ids = [row[0] for row in cursor.fetchall()]
        
        collection_ids = []
        
        with self.conn.cursor() as cursor:
            for i in range(count):
                collection_data = {
                    'id': str(uuid.uuid4()),
                    'name': self.fake.sentence(nb_words=random.randint(2, 4)).rstrip('.'),
                    'description': self.fake.text(max_nb_chars=random.randint(50, 300)),
                    'created_by': random.choice(user_ids) if user_ids else None,
                    'is_public': random.choice([True, False])
                }
                
                cursor.execute("""
                    INSERT INTO collections (id, name, description, created_by, is_public)
                    VALUES (%(id)s, %(name)s, %(description)s, %(created_by)s, %(is_public)s)
                """, collection_data)
                
                collection_ids.append(collection_data['id'])
                
                # Add random recordings to collection (5-50 recordings per collection)
                num_recordings = random.randint(5, min(50, len(recording_ids)))
                selected_recordings = random.sample(recording_ids, num_recordings)
                
                for recording_id in selected_recordings:
                    cursor.execute("""
                        INSERT INTO collection_recordings (collection_id, recording_id)
                        VALUES (%s, %s)
                        ON CONFLICT DO NOTHING
                    """, (collection_data['id'], recording_id))
                
                if (i + 1) % 20 == 0:
                    print(f"  Created {i + 1} collections")
        
        print(f"Successfully created {count} collections")
        return collection_ids
    
    def clear_database(self):
        """Clear all data from tables"""
        print("Clearing existing data...")
        
        with self.conn.cursor() as cursor:
            cursor.execute("TRUNCATE TABLE collection_recordings CASCADE")
            cursor.execute("TRUNCATE TABLE analysis_jobs CASCADE")
            cursor.execute("TRUNCATE TABLE collections CASCADE")
            cursor.execute("TRUNCATE TABLE audio_recordings CASCADE")
            cursor.execute("TRUNCATE TABLE users CASCADE")
        
        print("Database cleared successfully")
    
    def seed_database(self, users_count: int = 50, recordings_count: int = 10000, collections_count: int = 100, clear_first: bool = True):
        """Main seeding function"""
        print("Starting database seeding...")
        print(f"Target: {users_count} users, {recordings_count} recordings, {collections_count} collections")
        
        if clear_first:
            self.clear_database()
        
        # Create users first
        user_ids = self.create_users(users_count)
        
        # Create audio recordings
        self.create_audio_recordings(recordings_count, user_ids)
        
        # Create collections
        self.create_collections(collections_count, user_ids)
        
        print("Database seeding completed successfully!")
        
        # Print summary statistics
        self.print_statistics()
    
    def print_statistics(self):
        """Print database statistics"""
        print("\n=== Database Statistics ===")
        
        with self.conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Users
            cursor.execute("SELECT COUNT(*) as count FROM users")
            user_count = cursor.fetchone()['count']
            print(f"Users: {user_count}")
            
            # Recordings
            cursor.execute("SELECT COUNT(*) as count FROM audio_recordings")
            recording_count = cursor.fetchone()['count']
            print(f"Audio Recordings: {recording_count}")
            
            # Collections
            cursor.execute("SELECT COUNT(*) as count FROM collections")
            collection_count = cursor.fetchone()['count']
            print(f"Collections: {collection_count}")
            
            # Geographic distribution
            cursor.execute("""
                SELECT country, COUNT(*) as count 
                FROM audio_recordings 
                GROUP BY country 
                ORDER BY count DESC 
                LIMIT 10
            """)
            print("\nTop 10 Countries by Recording Count:")
            for row in cursor.fetchall():
                print(f"  {row['country']}: {row['count']}")
            
            # Layout distribution
            cursor.execute("""
                SELECT layout, COUNT(*) as count 
                FROM audio_recordings 
                GROUP BY layout 
                ORDER BY count DESC
            """)
            print("\nAudio Layout Distribution:")
            for row in cursor.fetchall():
                print(f"  {row['layout']}: {row['count']}")
            
            # Format distribution
            cursor.execute("""
                SELECT format, COUNT(*) as count 
                FROM audio_recordings 
                GROUP BY format 
                ORDER BY count DESC
            """)
            print("\nAudio Format Distribution:")
            for row in cursor.fetchall():
                print(f"  {row['format']}: {row['count']}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Seed GSD database with synthetic data')
    parser.add_argument('--users', type=int, default=50, help='Number of users to create')
    parser.add_argument('--recordings', type=int, default=10000, help='Number of audio recordings to create')
    parser.add_argument('--collections', type=int, default=100, help='Number of collections to create')
    parser.add_argument('--no-clear', action='store_true', help='Do not clear existing data')
    
    args = parser.parse_args()
    
    seeder = DatabaseSeeder()
    seeder.connect_db()
    
    try:
        seeder.seed_database(
            users_count=args.users,
            recordings_count=args.recordings,
            collections_count=args.collections,
            clear_first=not args.no_clear
        )
    finally:
        seeder.close_db()

if __name__ == '__main__':
    main()