/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    OPENSEARCH_URL: process.env.OPENSEARCH_URL || 'http://localhost:9200',
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost:9000',
  },
  images: {
    domains: ['localhost'],
    unoptimized: true, // Required for static export
  },
  // Enable static export for S3 deployment
  output: 'export',
  trailingSlash: true,
  // Disable image optimization for static export
  distDir: 'out',
}

module.exports = nextConfig