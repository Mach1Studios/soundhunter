-- GSD Database Schema
-- Global Sound Database for storing audio metadata with geospatial and vector support

-- Audio layout types enum
CREATE TYPE audio_layout AS ENUM (
    'mono',
    'stereo',
    'lcr',
    'ortf',
    'quad',
    'ACNSN3DO1A',
    'ACNSN3DO2A',
    'ACNSN3DO3A',
    'ACNSN3DO4A',
    'ACNSN3DO5A',
    'ACNSN3DO6A',
    'ACNSN3DO7A',
    'Mach1Spatial-4',
    'Mach1Spatial-8',
    'Mach1Spatial-14',
    'A-Format',
    'ambeo',
    'tetra-mic',
    'SPS-200',
    'NT-SF1',
    'CoreSound-OctoMic',
    'ZM-1'
);

-- Audio format enum
CREATE TYPE audio_format AS ENUM (
    'wav',
    'flac',
    'mp3',
    'aac',
    'ogg',
    'aiff'
);

-- Processing status enum
CREATE TYPE processing_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'archived'
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio recordings table
CREATE TABLE audio_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic metadata
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_seconds DECIMAL(10,3) NOT NULL,
    sample_rate INTEGER NOT NULL,
    bit_depth INTEGER NOT NULL,
    channels INTEGER NOT NULL,
    layout audio_layout NOT NULL,
    format audio_format NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    
    -- Storage paths
    original_path VARCHAR(500) NOT NULL, -- S3/MinIO path
    proxy_path VARCHAR(500), -- Compressed version path
    
    -- Geospatial data
    location GEOMETRY(POINT, 4326), -- WGS84 coordinates
    location_name VARCHAR(255),
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    
    -- Temporal data
    recorded_at TIMESTAMP WITH TIME ZONE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Audio analysis vectors (for similarity search)
    mfcc_features VECTOR(13), -- Mel-frequency cepstral coefficients
    spectral_features VECTOR(8), -- Spectral centroid, rolloff, etc.
    tempo_features VECTOR(4), -- Tempo, rhythm features
    
    -- Technical metadata
    peak_amplitude DECIMAL(5,3),
    rms_amplitude DECIMAL(5,3),
    dynamic_range DECIMAL(5,3),
    signal_to_noise_ratio DECIMAL(5,3),
    
    -- Categorization
    tags TEXT[], -- Array of tags
    genre VARCHAR(100), -- optional
    mood VARCHAR(100), -- optional
    environment VARCHAR(100), -- indoor, outdoor, urban, nature, etc.
    
    -- Processing status
    status processing_status DEFAULT 'pending',
    processing_notes TEXT,
    
    -- Ownership and permissions
    uploaded_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT FALSE,
    license VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio collections/playlists
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Many-to-many relationship between recordings and collections
CREATE TABLE collection_recordings (
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    recording_id UUID REFERENCES audio_recordings(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (collection_id, recording_id)
);

-- Audio analysis jobs table
CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recording_id UUID REFERENCES audio_recordings(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- 'feature_extraction', 'transcription', etc.
    status processing_status DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    result_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audio_recordings_location ON audio_recordings USING GIST (location);
CREATE INDEX idx_audio_recordings_recorded_at ON audio_recordings (recorded_at);
CREATE INDEX idx_audio_recordings_uploaded_at ON audio_recordings (uploaded_at);
CREATE INDEX idx_audio_recordings_layout ON audio_recordings (layout);
CREATE INDEX idx_audio_recordings_format ON audio_recordings (format);
CREATE INDEX idx_audio_recordings_tags ON audio_recordings USING GIN (tags);
CREATE INDEX idx_audio_recordings_status ON audio_recordings (status);
CREATE INDEX idx_audio_recordings_uploaded_by ON audio_recordings (uploaded_by);
CREATE INDEX idx_audio_recordings_is_public ON audio_recordings (is_public);

-- Vector similarity search indexes
CREATE INDEX idx_audio_recordings_mfcc ON audio_recordings USING ivfflat (mfcc_features vector_cosine_ops);
CREATE INDEX idx_audio_recordings_spectral ON audio_recordings USING ivfflat (spectral_features vector_cosine_ops);
CREATE INDEX idx_audio_recordings_tempo ON audio_recordings USING ivfflat (tempo_features vector_cosine_ops);

-- Full-text search indexes
CREATE INDEX idx_audio_recordings_title_fts ON audio_recordings USING GIN (to_tsvector('english', title));
CREATE INDEX idx_audio_recordings_description_fts ON audio_recordings USING GIN (to_tsvector('english', description));

-- Spatial indexes
CREATE INDEX idx_audio_recordings_country ON audio_recordings (country);
CREATE INDEX idx_audio_recordings_region ON audio_recordings (region);
CREATE INDEX idx_audio_recordings_city ON audio_recordings (city);

-- Collection indexes
CREATE INDEX idx_collections_created_by ON collections (created_by);
CREATE INDEX idx_collections_is_public ON collections (is_public);
CREATE INDEX idx_collection_recordings_collection_id ON collection_recordings (collection_id);
CREATE INDEX idx_collection_recordings_recording_id ON collection_recordings (recording_id);

-- Analysis jobs indexes
CREATE INDEX idx_analysis_jobs_recording_id ON analysis_jobs (recording_id);
CREATE INDEX idx_analysis_jobs_status ON analysis_jobs (status);
CREATE INDEX idx_analysis_jobs_job_type ON analysis_jobs (job_type);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audio_recordings_updated_at BEFORE UPDATE ON audio_recordings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();