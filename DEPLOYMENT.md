# PMArchitect.ai Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL 15+
- Docker (optional, for containerized deployment)
- Domain name and SSL certificate

### 1. Environment Setup

1. Copy the production environment template:
   ```bash
   cp production.env.template .env.production
   ```

2. Fill in your production values in `.env.production`:
   - Database connection string
   - OAuth provider credentials
   - NextAuth secret
   - Your domain URL

### 2. Database Setup

1. Create a production PostgreSQL database
2. Run the production setup script:
   ```bash
   chmod +x scripts/setup-production.sh
   ./scripts/setup-production.sh
   ```

### 3. Build and Deploy

#### Option A: Traditional Deployment
```bash
# Install dependencies
npm ci --only=production

# Build the application
npm run build:prod

# Start the production server
npm run start:prod
```

#### Option B: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t pmarchitect .
docker run -p 3000:3000 --env-file .env.production pmarchitect
```

### 4. Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] OAuth providers configured
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Performance monitoring enabled

### 5. Platform-Specific Deployment

#### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Railway will auto-deploy

#### DigitalOcean App Platform
1. Connect your GitHub repository
2. Configure environment variables
3. Set build command: `npm run build:prod`
4. Set run command: `npm start`

#### AWS/GCP/Azure
Use the Docker deployment option with your preferred container orchestration service.

### 6. Monitoring and Maintenance

#### Health Checks
- `/api/test-db` - Database connectivity
- `/api/auth/providers` - Authentication status

#### Logs
- Application logs: Check your hosting platform's log viewer
- Database logs: Monitor PostgreSQL logs
- Error tracking: Consider integrating Sentry or similar

#### Performance
- Monitor response times
- Check database query performance
- Monitor memory and CPU usage

### 7. Security Considerations

- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] OAuth providers properly configured
- [ ] Database access restricted
- [ ] Regular security updates
- [ ] Backup encryption

### 8. Troubleshooting

#### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall rules

2. **Authentication Errors**
   - Verify OAuth provider credentials
   - Check NEXTAUTH_URL matches your domain
   - Ensure NEXTAUTH_SECRET is set

3. **Build Failures**
   - Check Node.js version (18+)
   - Clear .next directory and rebuild
   - Verify all dependencies are installed

#### Support
- Check the logs for detailed error messages
- Verify environment variables are set correctly
- Test locally with production environment variables

## 🎯 Next Steps

After successful deployment:
1. Test all core features
2. Set up monitoring and alerting
3. Configure automated backups
4. Plan scaling strategy
5. Document operational procedures

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Production Setup](https://next-auth.js.org/configuration/production)
