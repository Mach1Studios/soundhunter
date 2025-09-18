# Soundhunter Project Makefile
# Variables
BUCKET_NAME = soundhunter-webapp-public
AWS_PROFILE = default
CLOUDFRONT_DISTRIBUTION_ID = E2LSIC7YTBBKJR

# Project directories
WEB_CLIENT_DIR = web-client
MOBILE_CLIENT_DIR = mobile-client
ADMIN_PORTAL_DIR = admin-portal
GSD_DIR = GSD

# Ports
WEB_CLIENT_PORT = 3003
ADMIN_PORTAL_PORT = 3002
MOBILE_CLIENT_PORT = 8081

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help install dev-web dev-mobile dev-admin dev-gsd dev-all build-web deploy-web clean check-aws check-cloudfront install-deps stop-all

# Default target
help:
	@echo "$(GREEN)Soundhunter Project Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Setup:$(NC)"
	@echo "  install     - Install dependencies for all components"
	@echo "  install-deps - Check and install system dependencies"
	@echo ""
	@echo "$(YELLOW)Development (Local):$(NC)"
	@echo "  dev-web     - Start web client (Next.js) on port $(WEB_CLIENT_PORT)"
	@echo "  dev-mobile  - Start mobile client (Expo) on port $(MOBILE_CLIENT_PORT)"
	@echo "  dev-admin   - Start admin portal (Next.js) on port $(ADMIN_PORTAL_PORT)"
	@echo "  dev-gsd     - Start GSD backend services (Docker)"
	@echo "  dev-all     - Start all services in parallel"
	@echo "  stop-all    - Stop all running services"
	@echo ""
	@echo "$(YELLOW)Build & Deploy:$(NC)"
	@echo "  build-web   - Build web client for production"
	@echo "  deploy-web  - Deploy web client to S3 and invalidate CloudFront"
	@echo "  check-aws   - Verify AWS CLI configuration"
	@echo "  check-cloudfront - Check CloudFront distribution configuration"
	@echo ""
	@echo "$(YELLOW)Maintenance:$(NC)"
	@echo "  clean       - Clean up temporary files and build artifacts"
	@echo ""
	@echo "$(BLUE)Quick Start:$(NC)"
	@echo "  1. Run 'make install' to set up dependencies"
	@echo "  2. Run 'make dev-all' to start all services"
	@echo "  3. Run 'make deploy-web' to deploy web client"

# Install dependencies for all components
install:
	@echo "$(GREEN)Installing dependencies for all components...$(NC)"
	@echo ""
	
	@echo "$(YELLOW)Installing web client dependencies...$(NC)"
	@cd $(WEB_CLIENT_DIR) && npm install
	
	@echo "$(YELLOW)Installing mobile client dependencies...$(NC)"
	@cd $(MOBILE_CLIENT_DIR) && npm install
	
	@echo "$(YELLOW)Installing admin portal dependencies...$(NC)"
	@cd $(ADMIN_PORTAL_DIR) && npm install
	
	@echo "$(YELLOW)Installing GSD backend dependencies...$(NC)"
	@cd $(GSD_DIR) && pip install -r requirements.txt
	
	@echo "$(GREEN)✓ All dependencies installed successfully!$(NC)"

# Start web client development server
dev-web:
	@echo "$(GREEN)Starting web client development server...$(NC)"
	@echo "$(YELLOW)Web client will be available at: http://localhost:$(WEB_CLIENT_PORT)$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop the server$(NC)"
	@echo ""
	@cd $(WEB_CLIENT_DIR) && npm run dev

# Start mobile client development server
dev-mobile:
	@echo "$(GREEN)Starting mobile client development server...$(NC)"
	@echo "$(YELLOW)Expo dev tools will be available at: http://localhost:$(MOBILE_CLIENT_PORT)$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop the server$(NC)"
	@echo ""
	@cd $(MOBILE_CLIENT_DIR) && npm start

# Start admin portal development server
dev-admin:
	@echo "$(GREEN)Starting admin portal development server...$(NC)"
	@echo "$(YELLOW)Admin portal will be available at: http://localhost:$(ADMIN_PORTAL_PORT)$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop the server$(NC)"
	@echo ""
	@cd $(ADMIN_PORTAL_DIR) && npm run dev

# Start GSD backend services
dev-gsd:
	@echo "$(GREEN)Starting GSD backend services...$(NC)"
	@echo "$(YELLOW)Starting Docker services...$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop the services$(NC)"
	@echo ""
	@cd $(GSD_DIR) && docker-compose up

# Start all services in parallel (background mode)
dev-all:
	@echo "$(GREEN)Starting all Soundhunter services...$(NC)"
	@echo ""
	@echo "$(YELLOW)Services will be available at:$(NC)"
	@echo "  Web Client:    http://localhost:$(WEB_CLIENT_PORT)"
	@echo "  Mobile Client: http://localhost:$(MOBILE_CLIENT_PORT)"
	@echo "  Admin Portal:  http://localhost:$(ADMIN_PORTAL_PORT)"
	@echo "  GSD Backend:   Docker services"
	@echo ""
	@echo "$(YELLOW)Use 'make stop-all' to stop all services$(NC)"
	@echo ""
	
	# Start services in background
	@cd $(GSD_DIR) && docker-compose up -d
	@cd $(WEB_CLIENT_DIR) && npm run dev > ../logs/web-client.log 2>&1 & echo $$! > ../logs/web-client.pid
	@cd $(MOBILE_CLIENT_DIR) && npm start > ../logs/mobile-client.log 2>&1 & echo $$! > ../logs/mobile-client.pid
	@cd $(ADMIN_PORTAL_DIR) && npm run dev > ../logs/admin-portal.log 2>&1 & echo $$! > ../logs/admin-portal.pid
	
	@mkdir -p logs
	@echo "$(GREEN)✓ All services started in background$(NC)"
	@echo "$(YELLOW)Check logs in ./logs/ directory$(NC)"

# Stop all running services
stop-all:
	@echo "$(GREEN)Stopping all Soundhunter services...$(NC)"
	
	# Stop Docker services
	@cd $(GSD_DIR) && docker-compose down
	
	# Stop Node.js services
	@if [ -f logs/web-client.pid ]; then \
		kill `cat logs/web-client.pid` 2>/dev/null || true; \
		rm logs/web-client.pid; \
	fi
	@if [ -f logs/mobile-client.pid ]; then \
		kill `cat logs/mobile-client.pid` 2>/dev/null || true; \
		rm logs/mobile-client.pid; \
	fi
	@if [ -f logs/admin-portal.pid ]; then \
		kill `cat logs/admin-portal.pid` 2>/dev/null || true; \
		rm logs/admin-portal.pid; \
	fi
	
	# Kill any remaining Node processes on our ports
	@lsof -ti:$(WEB_CLIENT_PORT) | xargs kill -9 2>/dev/null || true
	@lsof -ti:$(MOBILE_CLIENT_PORT) | xargs kill -9 2>/dev/null || true
	@lsof -ti:$(ADMIN_PORTAL_PORT) | xargs kill -9 2>/dev/null || true
	
	@echo "$(GREEN)✓ All services stopped$(NC)"

# Build web client for production
build-web:
	@echo "$(GREEN)Building web client for production...$(NC)"
	@cd $(WEB_CLIENT_DIR) && npm run build
	@echo "$(GREEN)✓ Web client build completed$(NC)"

# Check AWS CLI configuration
check-aws:
	@echo "$(GREEN)Checking AWS CLI configuration...$(NC)"
	@if ! command -v aws >/dev/null 2>&1; then \
		echo "$(RED)Error: AWS CLI is not installed$(NC)"; \
		echo "Please install AWS CLI: https://aws.amazon.com/cli/"; \
		exit 1; \
	fi
	@echo "$(YELLOW)AWS CLI version:$(NC)"
	@aws --version
	@echo ""
	@echo "$(YELLOW)Checking profile '$(AWS_PROFILE)':$(NC)"
	@if aws configure list --profile $(AWS_PROFILE) >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Profile '$(AWS_PROFILE)' is configured$(NC)"; \
		aws configure list --profile $(AWS_PROFILE); \
	else \
		echo "$(RED)✗ Profile '$(AWS_PROFILE)' is not configured$(NC)"; \
		echo "Please configure the profile with: aws configure --profile $(AWS_PROFILE)"; \
		exit 1; \
	fi
	@echo ""
	@echo "$(YELLOW)Testing S3 access to bucket '$(BUCKET_NAME)':$(NC)"
	@if aws s3 ls s3://$(BUCKET_NAME) --profile $(AWS_PROFILE) >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Successfully connected to S3 bucket$(NC)"; \
	else \
		echo "$(RED)✗ Cannot access S3 bucket '$(BUCKET_NAME)'$(NC)"; \
		echo "Please check bucket name and permissions"; \
		exit 1; \
	fi

# Check CloudFront configuration
check-cloudfront:
	@echo "$(GREEN)Checking CloudFront configuration...$(NC)"
	@if [ -z "$(CLOUDFRONT_DISTRIBUTION_ID)" ]; then \
		echo "$(YELLOW)⚠ CloudFront Distribution ID not set$(NC)"; \
		echo "Set CLOUDFRONT_DISTRIBUTION_ID in Makefile to enable cache invalidation"; \
		echo "Find your distribution ID in AWS Console > CloudFront"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Testing CloudFront distribution '$(CLOUDFRONT_DISTRIBUTION_ID)':$(NC)"
	@if aws cloudfront get-distribution --id $(CLOUDFRONT_DISTRIBUTION_ID) --profile $(AWS_PROFILE) >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Successfully connected to CloudFront distribution$(NC)"; \
	else \
		echo "$(RED)✗ Cannot access CloudFront distribution '$(CLOUDFRONT_DISTRIBUTION_ID)'$(NC)"; \
		echo "Please check distribution ID and permissions"; \
		exit 1; \
	fi

# Deploy web client to AWS S3 with CloudFront invalidation
deploy-web: check-aws build-web
	@echo "$(GREEN)Deploying web client to S3 bucket: $(BUCKET_NAME)$(NC)"
	@echo "$(YELLOW)Using AWS profile: $(AWS_PROFILE)$(NC)"
	@echo ""
	
	# Sync files to S3 with cache control headers
	@echo "$(YELLOW)Syncing web client files to S3...$(NC)"
	@aws s3 sync $(WEB_CLIENT_DIR)/out s3://$(BUCKET_NAME) \
		--profile $(AWS_PROFILE) \
		--exclude ".git/*" \
		--exclude ".gitignore" \
		--exclude "*.log" \
		--exclude "node_modules/*" \
		--exclude ".env*" \
		--exclude "README.md" \
		--exclude "package*.json" \
		--exclude "tsconfig.json" \
		--exclude "next.config.js" \
		--exclude "tailwind.config.js" \
		--exclude "postcss.config.js" \
		--cache-control "public, max-age=31536000" \
		--delete
	
	# Set no cache for HTML files
	@echo "$(YELLOW)Setting cache headers for HTML files...$(NC)"
	@aws s3 cp s3://$(BUCKET_NAME)/index.html s3://$(BUCKET_NAME)/index.html \
		--profile $(AWS_PROFILE) \
		--cache-control no-cache \
		--content-type "text/html" \
		--metadata-directive REPLACE 2>/dev/null || true
	
	@echo "$(GREEN)✓ S3 sync completed$(NC)"
	
	# Invalidate CloudFront cache if distribution ID is set
	@if [ -n "$(CLOUDFRONT_DISTRIBUTION_ID)" ]; then \
		echo "$(YELLOW)Invalidating CloudFront cache...$(NC)"; \
		INVALIDATION_ID=$$(aws cloudfront create-invalidation \
			--distribution-id $(CLOUDFRONT_DISTRIBUTION_ID) \
			--paths "/*" \
			--profile $(AWS_PROFILE) \
			--query 'Invalidation.Id' \
			--output text); \
		echo "$(GREEN)✓ CloudFront invalidation created: $$INVALIDATION_ID$(NC)"; \
		echo "$(YELLOW)Cache invalidation may take 5-15 minutes to complete$(NC)"; \
	else \
		echo "$(YELLOW)⚠ Skipping CloudFront invalidation (CLOUDFRONT_DISTRIBUTION_ID not set)$(NC)"; \
		echo "Set CLOUDFRONT_DISTRIBUTION_ID in Makefile to enable automatic cache invalidation"; \
	fi
	
	@echo ""
	@echo "$(GREEN)✓ Web client deployment completed successfully!$(NC)"
	@echo ""
	@if [ -n "$(CLOUDFRONT_DISTRIBUTION_ID)" ]; then \
		echo "$(YELLOW)Your website will be updated within 5-15 minutes$(NC)"; \
	else \
		echo "$(YELLOW)If using CloudFront, manually invalidate cache or set CLOUDFRONT_DISTRIBUTION_ID$(NC)"; \
	fi

# Clean up temporary files and build artifacts
clean:
	@echo "$(GREEN)Cleaning up temporary files and build artifacts...$(NC)"
	
	# Clean Node.js artifacts
	@find . -name "node_modules" -type d -prune -o -name "*.log" -delete 2>/dev/null || true
	@find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "out" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name ".expo" -type d -exec rm -rf {} + 2>/dev/null || true
	
	# Clean Python artifacts
	@find . -name "*.pyc" -delete 2>/dev/null || true
	@find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	
	# Clean system artifacts
	@find . -name ".DS_Store" -delete 2>/dev/null || true
	
	# Clean logs directory
	@rm -rf logs 2>/dev/null || true
	
	# Clean Docker artifacts
	@cd $(GSD_DIR) && docker-compose down --volumes --remove-orphans 2>/dev/null || true
	
	@echo "$(GREEN)✓ Cleanup completed$(NC)"

# Install required system dependencies
install-deps:
	@echo "$(GREEN)Checking system dependencies...$(NC)"
	@echo ""
	
	# Check Node.js
	@if command -v node >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Node.js is installed$(NC)"; \
		node --version; \
	else \
		echo "$(RED)✗ Node.js is not installed$(NC)"; \
		echo "Please install Node.js from https://nodejs.org"; \
	fi
	
	@echo ""
	
	# Check npm
	@if command -v npm >/dev/null 2>&1; then \
		echo "$(GREEN)✓ npm is installed$(NC)"; \
		npm --version; \
	else \
		echo "$(RED)✗ npm is not installed$(NC)"; \
		echo "npm should come with Node.js installation"; \
	fi
	
	@echo ""
	
	# Check Python
	@if command -v python3 >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Python 3 is installed$(NC)"; \
		python3 --version; \
	elif command -v python >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Python is installed$(NC)"; \
		python --version; \
	else \
		echo "$(RED)✗ Python is not installed$(NC)"; \
		echo "Please install Python 3 from https://python.org"; \
	fi
	
	@echo ""
	
	# Check Docker
	@if command -v docker >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Docker is installed$(NC)"; \
		docker --version; \
	else \
		echo "$(RED)✗ Docker is not installed$(NC)"; \
		echo "Please install Docker from https://docker.com"; \
	fi
	
	@echo ""
	
	# Check Docker Compose
	@if command -v docker-compose >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Docker Compose is installed$(NC)"; \
		docker-compose --version; \
	else \
		echo "$(RED)✗ Docker Compose is not installed$(NC)"; \
		echo "Please install Docker Compose"; \
	fi
	
	@echo ""
	
	# Check AWS CLI
	@if command -v aws >/dev/null 2>&1; then \
		echo "$(GREEN)✓ AWS CLI is installed$(NC)"; \
		aws --version; \
	else \
		echo "$(RED)✗ AWS CLI is not installed$(NC)"; \
		echo "Install with: pip install awscli"; \
		echo "Or visit: https://aws.amazon.com/cli/"; \
	fi
	
	@echo ""
	@echo "$(YELLOW)Manual setup required:$(NC)"
	@echo "1. Configure AWS profile: aws configure --profile $(AWS_PROFILE)"
	@echo "2. Ensure S3 bucket '$(BUCKET_NAME)' exists and is accessible"
	@echo "3. Set CLOUDFRONT_DISTRIBUTION_ID in Makefile for cache invalidation"
	@echo "4. Copy GSD/.env.example to GSD/.env and configure environment variables"

# Development workflow shortcuts
dev: dev-all
build: build-web
deploy: deploy-web

# Show current configuration
config:
	@echo "$(GREEN)Current Soundhunter Configuration:$(NC)"
	@echo "  S3 Bucket Name: $(BUCKET_NAME)"
	@echo "  AWS Profile: $(AWS_PROFILE)"
	@echo "  CloudFront Distribution ID: $(if $(CLOUDFRONT_DISTRIBUTION_ID),$(CLOUDFRONT_DISTRIBUTION_ID),Not set)"
	@echo ""
	@echo "  Web Client Port: $(WEB_CLIENT_PORT)"
	@echo "  Mobile Client Port: $(MOBILE_CLIENT_PORT)"
	@echo "  Admin Portal Port: $(ADMIN_PORTAL_PORT)"
	@echo ""
	@echo "  Project Directories:"
	@echo "    Web Client: $(WEB_CLIENT_DIR)/"
	@echo "    Mobile Client: $(MOBILE_CLIENT_DIR)/"
	@echo "    Admin Portal: $(ADMIN_PORTAL_DIR)/"
	@echo "    GSD Backend: $(GSD_DIR)/"

# Status check for all services
status:
	@echo "$(GREEN)Soundhunter Services Status:$(NC)"
	@echo ""
	
	@echo "$(YELLOW)Web Client (port $(WEB_CLIENT_PORT)):$(NC)"
	@if lsof -i:$(WEB_CLIENT_PORT) >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Running$(NC)"; \
	else \
		echo "$(RED)✗ Not running$(NC)"; \
	fi
	
	@echo "$(YELLOW)Mobile Client (port $(MOBILE_CLIENT_PORT)):$(NC)"
	@if lsof -i:$(MOBILE_CLIENT_PORT) >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Running$(NC)"; \
	else \
		echo "$(RED)✗ Not running$(NC)"; \
	fi
	
	@echo "$(YELLOW)Admin Portal (port $(ADMIN_PORTAL_PORT)):$(NC)"
	@if lsof -i:$(ADMIN_PORTAL_PORT) >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Running$(NC)"; \
	else \
		echo "$(RED)✗ Not running$(NC)"; \
	fi
	
	@echo "$(YELLOW)GSD Backend (Docker):$(NC)"
	@cd $(GSD_DIR) && if docker-compose ps | grep -q "Up"; then \
		echo "$(GREEN)✓ Running$(NC)"; \
		docker-compose ps; \
	else \
		echo "$(RED)✗ Not running$(NC)"; \
	fi
