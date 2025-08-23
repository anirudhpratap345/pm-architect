# PMArchitect.ai

An AI-driven decision intelligence platform built for modern product and engineering teams.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd pm-architect
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pmarchitect?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional for launch)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# App Configuration
NODE_ENV="development"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Demo Credentials

For testing without OAuth setup:
- **Email**: `demo@pmarchitect.ai`
- **Password**: `demo123`

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main dashboard
│   ├── decision/       # Decision management
│   ├── teams/          # Team collaboration
│   └── templates/      # Decision templates
├── components/         # Reusable UI components
├── lib/               # Utility functions and API clients
├── types/             # TypeScript type definitions
└── data/              # Mock data and archetypes
```

## 🚀 Features

### Core Functionality
- ✅ **Decision Management**: Create, view, and track decisions
- ✅ **Status Tracking**: Pending → Open → Resolved workflow
- ✅ **Comments & Collaboration**: Team discussion on decisions
- ✅ **Tag-based Filtering**: Organize decisions by categories
- ✅ **Team Management**: Create teams and invite members
- ✅ **Decision Templates**: Reusable frameworks for common decisions

### Decision Intelligence
- ✅ **Tradeoff Analysis**: Structured comparison of options
- ✅ **Constraint Management**: Track business and technical constraints
- ✅ **Priority System**: Critical, High, Medium, Low prioritization
- ✅ **Analytics Dashboard**: Decision metrics and insights

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run studio       # Open Prisma Studio
```

### Database Management
```bash
npx prisma studio    # Open database GUI
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma client
npx prisma db push        # Push schema changes
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:
- **Users**: Authentication and user profiles
- **Decisions**: Core decision records with metadata
- **Comments**: Discussion threads on decisions
- **Teams**: Team collaboration and permissions
- **Templates**: Reusable decision frameworks
- **Notifications**: User activity alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Email: hello@pmarchitect.ai
- Documentation: [docs.pmarchitect.ai](https://docs.pmarchitect.ai)

---

**PMArchitect.ai** - Making complex decisions simple and collaborative.
