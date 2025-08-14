/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://gsd_user:gsd_password@localhost:5432/gsd',
    OPENSEARCH_URL: process.env.OPENSEARCH_URL || 'http://localhost:9200',
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost:9000',
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin123',
  },
}

module.exports = nextConfig