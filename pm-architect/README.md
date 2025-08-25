# PMArchitect.ai 🏗️

**AI-driven decision intelligence platform for modern product and engineering teams**

PMArchitect bridges the gap between Product Managers and Engineers by providing a structured approach to making informed technical decisions. Create, track, and collaborate on architectural decisions with AI-powered insights and comprehensive tradeoff analysis.

![PMArchitect Platform](https://img.shields.io/badge/Platform-Web%20App-blue)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Next.js%20%7C%20React%20%7C%20TypeScript%20%7C%20Prisma%20%7C%20PostgreSQL-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 What is PMArchitect?

PMArchitect is a collaborative decision-making platform that helps product and engineering teams:

- **Create structured architectural decisions** with proven frameworks and templates
- **Compare model options and tradeoffs** with visual analysis tools
- **Collaborate effectively** through real-time commenting and team management
- **Track decision outcomes** and learn from past choices
- **Make informed technical choices** under tight deadlines

## ✨ Key Features

### 🏗️ Decision Management
- **Structured Decision Framework**: Create decisions with context, options, constraints, and metrics
- **Template System**: Use proven decision-making frameworks or create custom templates
- **Priority & Status Tracking**: Manage decision lifecycle from pending to resolved

### 🔍 Tradeoff Analysis
- **Visual Comparison Tools**: Compare different technical approaches side-by-side
- **Risk Assessment**: Evaluate risk levels, costs, and time estimates for each option
- **Impact Analysis**: Understand positive, negative, and neutral impacts of decisions

### 👥 Team Collaboration
- **Real-time Comments**: Discuss decisions with threaded conversations and mentions
- **Team Management**: Organize teams with role-based access control
- **Notification System**: Stay updated on decision changes and team activities

### 📊 Analytics & Insights
- **Decision History**: Track outcomes and learn from past choices
- **Team Performance**: Monitor decision velocity and quality metrics
- **Template Usage**: Understand which frameworks work best for your team

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pm-architect.git
   cd pm-architect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp production.env.template .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pmarchitect"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run studio       # Open Prisma Studio
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS v4, Framer Motion
- **Deployment**: Vercel-ready with Docker support

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API endpoints
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main dashboard
│   ├── decision/       # Decision management
│   ├── teams/          # Team management
│   └── templates/      # Decision templates
├── components/         # Reusable React components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── data/              # Mock data and constants
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t pmarchitect .

# Run the container
docker run -p 3000:3000 pmarchitect
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out
- `GET /api/auth/session` - Get current session

### Decisions
- `GET /api/decisions` - List all decisions
- `POST /api/decisions` - Create new decision
- `GET /api/decisions/[id]` - Get decision details
- `PUT /api/decisions/[id]` - Update decision
- `DELETE /api/decisions/[id]` - Delete decision

### Teams
- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create new team
- `GET /api/teams/[id]` - Get team details
- `POST /api/teams/[id]/invite` - Invite team member

### Templates
- `GET /api/templates` - List decision templates
- `POST /api/templates` - Create new template

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Yes | - |
| `NEXTAUTH_URL` | Base URL for authentication | Yes | - |
| `NODE_ENV` | Environment mode | No | `development` |

### Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: Authentication and user profiles
- **Decision**: Core decision records with metadata
- **Team**: Team organization and membership
- **Template**: Reusable decision frameworks
- **Comment**: Discussion threads on decisions

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Self-hosted

1. Build the application: `npm run build:prod`
2. Set production environment variables
3. Start the server: `npm run start:prod`

### Docker Production

```bash
# Build production image
docker build -f Dockerfile -t pmarchitect:prod .

# Run with production environment
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="your-db-url" \
  pmarchitect:prod
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.pmarchitect.ai](https://docs.pmarchitect.ai)
- **Issues**: [GitHub Issues](https://github.com/yourusername/pm-architect/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/pm-architect/discussions)
- **Email**: support@pmarchitect.ai

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Database powered by [Prisma](https://www.prisma.io/) and [PostgreSQL](https://www.postgresql.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

**Made with ❤️ for product and engineering teams everywhere**

*PMArchitect - Where great decisions meet great execution*
