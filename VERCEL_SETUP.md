# 🚀 Vercel Deployment Setup Guide

## ✅ Prisma Client Generation - FIXED!

Your project is now configured to automatically generate Prisma Client during Vercel builds. The following changes were made:

- ✅ **Package.json**: Added `vercel-build` script that runs `prisma generate && next build`
- ✅ **Vercel.json**: Configured to use the custom build command
- ✅ **Postinstall**: Added `postinstall` script to regenerate Prisma Client after `npm install`

## Required Environment Variables

To deploy PMArchitect.ai on Vercel, you need to configure the following environment variables in your Vercel dashboard:

### 1. Database Configuration (REQUIRED)
```
DATABASE_URL=postgresql://username:password@your-db-host:5432/database_name
```

**Where to set this in Vercel:**
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add `DATABASE_URL` with your PostgreSQL connection string
4. Set environment to **Production** (and optionally Preview/Development)

### 2. NextAuth Configuration (REQUIRED)
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
# On Windows PowerShell:
[System.Web.Security.Membership]::GeneratePassword(32, 10)

# Or use an online generator (less secure but convenient)
# https://generate-secret.vercel.app/32
```

### 3. OAuth Providers (OPTIONAL - but recommended)

#### Google OAuth
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### GitHub OAuth
```
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

**Note**: The variable names in your code are `GITHUB_ID` and `GITHUB_SECRET`, not `GITHUB_CLIENT_ID`.

## Setting Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the appropriate environment:
   - **Production**: Your live site
   - **Preview**: Pull request deployments
   - **Development**: Local development

### Method 2: Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add GITHUB_ID production
vercel env add GITHUB_SECRET production
```

## Database Setup Options

### Option 1: Vercel Postgres (Easiest)
```bash
vercel add postgres
```
This will automatically:
- Create a PostgreSQL database
- Set the `DATABASE_URL` environment variable
- Handle connection pooling and optimization

### Option 2: External PostgreSQL Services
Use services like:
- **Neon** (recommended for serverless) - [neon.tech](https://neon.tech)
- **Supabase** - [supabase.com](https://supabase.com)
- **Railway** - [railway.app](https://railway.app)
- **PlanetScale** - [planetscale.com](https://planetscale.com)

## OAuth Provider Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. **Create Credentials** → **OAuth 2.0 Client IDs**
4. **Application type**: Web application
5. **Authorized JavaScript origins**: `https://your-domain.vercel.app`
6. **Authorized redirect URIs**: `https://your-domain.vercel.app/api/auth/callback/google`

### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. **OAuth Apps** → **New OAuth App**
3. **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`

## Deployment Steps

1. **Push your updated code to GitHub**:
   ```bash
   git add .
   git commit -m "Fix Prisma Client generation for Vercel deployment"
   git push origin main
   ```

2. **Import Project in Vercel** (if not already done):
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**:
   - Add all required environment variables in Vercel dashboard
   - **Start with DATABASE_URL and NEXTAUTH_SECRET** (these are required)
   - Add OAuth providers later if needed

4. **Deploy**:
   - Vercel will automatically deploy using your custom build command
   - Check build logs to ensure Prisma Client generation succeeds

## Testing Your Deployment

After deployment, test these endpoints:
- `https://your-domain.vercel.app` - Homepage
- `https://your-domain.vercel.app/api/test-db` - Database connectivity
- `https://your-domain.vercel.app/api/auth/providers` - Auth providers
- `https://your-domain.vercel.app/auth/signin` - Sign in page

## Current Status

✅ **Prisma Client Generation**: Fixed and tested locally
✅ **Build Scripts**: Updated for Vercel compatibility
✅ **Environment Variables**: Guide provided
✅ **OAuth Setup**: Instructions included

## Next Steps

1. **Set DATABASE_URL** in Vercel dashboard (this is critical)
2. **Set NEXTAUTH_SECRET** in Vercel dashboard
3. **Deploy** and verify the build succeeds
4. **Add OAuth providers** if you want social login
5. **Test** all functionality

---

**Ready to deploy?** Your Prisma Client generation issue is now fixed! 🚀

**Estimated time to launch**: 15-30 minutes (after setting environment variables)
