# Deployment Guide - Focused Room Website

Complete guide for deploying the Focused Room Flask application to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Docker Development](#local-docker-development)
- [Render.com Deployment](#rendercom-deployment)
- [Railway Deployment](#railway-deployment)
- [Environment Variables](#environment-variables)
- [Health Monitoring](#health-monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker and Docker Compose installed
- Git repository access
- Render.com or Railway account (for production deployment)
- Environment variables configured

## Local Docker Development

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t focusedroom-web .

# Run the container
docker run -p 5000:5000 --env-file .env focusedroom-web

# Access the application
open http://localhost:5000
```

### Using Docker Compose

```bash
# Start all services (web + database)
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up --build
```

### Health Check

```bash
# Check application health
curl http://localhost:5000/health
```

## Render.com Deployment

### Automatic Deployment

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically

2. **Configure Environment Variables**
   ```bash
   # Required variables (set in Render dashboard)
   SECRET_KEY=<generated-automatically>
   FLASK_ENV=production
   DATABASE_URL=<provided-by-render>

   # Optional variables
   MAIL_SERVER=smtp.sendgrid.net
   MAIL_PORT=587
   MAIL_USERNAME=apikey
   MAIL_PASSWORD=<your-sendgrid-api-key>
   MAIL_DEFAULT_SENDER=noreply@focusedroom.com
   GEMINI_API_KEY=<your-gemini-api-key>
   ```

3. **Deploy**
   - Click "Apply" to create services
   - Render will build and deploy automatically
   - Monitor deployment logs in the dashboard

### Manual Deployment

```bash
# Install Render CLI
npm install -g render-cli

# Login to Render
render login

# Deploy from render.yaml
render blueprint launch
```

## Railway Deployment

### Quick Deploy

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set SECRET_KEY=<your-secret-key>
   railway variables set FLASK_ENV=production
   railway variables set GEMINI_API_KEY=<your-api-key>
   ```

5. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Flask secret key (auto-generated in production) | `<random-string>` |
| `FLASK_ENV` | Environment | `production` |
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host/db` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MAIL_SERVER` | Email server | `smtp.sendgrid.net` |
| `MAIL_PORT` | Email port | `587` |
| `MAIL_USERNAME` | Email username | `apikey` |
| `MAIL_PASSWORD` | Email password/API key | - |
| `MAIL_DEFAULT_SENDER` | Default sender email | `noreply@focusedroom.com` |
| `GEMINI_API_KEY` | Gemini AI API key | - |

## Health Monitoring

### Health Check Endpoint

```bash
GET /health
```

**Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-02T12:00:00",
  "database": "healthy",
  "version": "1.5.0",
  "environment": "production"
}
```

**Response (Degraded):**
```json
{
  "status": "degraded",
  "timestamp": "2025-10-02T12:00:00",
  "database": "unhealthy: connection refused",
  "version": "1.5.0",
  "environment": "production"
}
```

### Monitoring Setup

**Render.com:**
- Health checks run automatically
- Configure alerts in dashboard

**Railway:**
- Add custom health check monitor
- Set up notifications

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs <container-id>

# Verify environment variables
docker exec <container-id> env

# Test database connection
docker exec <container-id> python -c "from app import db; db.session.execute('SELECT 1')"
```

### Database Connection Issues

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT 1"
```

### Build Failures

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t focusedroom-web .
```

### Performance Issues

```bash
# Increase gunicorn workers
gunicorn --workers 8 --bind 0.0.0.0:5000 run:app

# Add worker timeout
gunicorn --timeout 180 --bind 0.0.0.0:5000 run:app
```

## Production Checklist

- [ ] SECRET_KEY is strong and unique
- [ ] DATABASE_URL points to production database
- [ ] FLASK_ENV is set to "production"
- [ ] All sensitive credentials are in environment variables
- [ ] Health check endpoint is accessible
- [ ] Database migrations are up to date
- [ ] Static files are served correctly
- [ ] HTTPS is configured
- [ ] Error monitoring is set up
- [ ] Backup strategy is in place

## Support

For issues or questions, contact: support@focusedroom.com

---

**Last Updated**: October 2, 2025  
**Version**: 1.5.0
