📘 PingRobot - README.md
markdown
<div align="center">
  
  <img src="public/android-chrome-512x512.png" alt="PingRobot Logo" width="120" height="120" />
  
  # 🔥 PingRobot
  
  ### Aggressive URL Monitoring & Wake-Up Tool
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)
  [![Neon PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E5BE.svg)](https://neon.tech/)
  [![NextAuth](https://img.shields.io/badge/NextAuth.js-Auth-000000.svg)](https://next-auth.js.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://pingrobot-seven.vercel.app/)
  [![GitHub](https://img.shields.io/badge/GitHub-sancy1/pingrobot-181717.svg)](https://github.com/sancy1/pingrobot)
  
  <p align="center">
    <strong>Keep your cloud services awake with 60-second timeout + 3 retry attempts.</strong><br />
    Perfect for Render, Heroku, Railway, and Fly.io free tiers.
  </p>
  
  [Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 **Table of Contents**

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [API Documentation](#-api-documentation)
- [External API Consumption](#-external-api-consumption)
- [PWA & Mobile Installation](#-pwa--mobile-installation)
- [Deployment](#-deployment)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 **Overview**

**PingRobot** is a professional, production-ready URL monitoring and wake-up tool designed specifically for cloud platforms with free tiers that put services to sleep after periods of inactivity (Render, Heroku, Railway, Fly.io).

Unlike standard uptime monitors that simply report downtime, PingRobot actively wakes sleeping services using aggressive timeout and retry strategies, ensuring your applications stay responsive 24/7.

### **The Problem We Solve**

| Platform | Free Tier Behavior | PingRobot Solution |
|----------|-------------------|---------------------|
| **Render** | Spins down after 15 minutes | 60s timeout + 3 retries wakes it up |
| **Heroku** | Idles after 30 minutes | Aggressive pinging prevents idle |
| **Railway** | Sleeps after inactivity | Wake-up detection + automatic retry |
| **Fly.io** | Scales to zero | Keep-alive pings prevent cold starts |

---

## ✨ **Features**

### **Core Monitoring**

| Feature | Description |
|---------|-------------|
| 🔍 **Aggressive Wake-Up Detection** | 60-second timeout + 3 retry attempts with exponential backoff (3s, 9s, 27s) |
| 🌙 **Cold Start Detection** | Automatically identifies wake-ups (responses > 5 seconds) |
| 📊 **Real-time Status Dashboard** | Live view of all monitored endpoints |
| 📈 **Uptime Percentage Tracking** | Historical uptime statistics per monitor |
| ⏱️ **Response Time Metrics** | Average, min, and max response times |
| 🔄 **Automatic Scheduled Pings** | Cron-based checking every minute |

### **Advanced Features**

| Feature | Description |
|---------|-------------|
| 🔐 **OAuth Authentication** | Google + GitHub login with session management |
| 📱 **PWA Support** | Install as app on mobile devices |
| 📦 **JSON Response Viewer** | View and explore API JSON responses |
| 🔒 **SSL Certificate Monitoring** | Track expiry dates with warnings |
| ⏸️ **Pause/Resume Monitoring** | Temporarily stop monitoring any endpoint |
| 🎨 **Dark Theme UI** | Modern dark interface with neon glow effects |
| 🔍 **Search & Filter** | Client-side search and multi-status filtering |
| 📤 **Sort Options** | Sort by status, name, uptime, or response time |

### **API & Integration**

| Feature | Description |
|---------|-------------|
| 🔑 **API Key Authentication** | Secure external access with X-API-Key header |
| 🌐 **CORS Enabled** | Cross-origin requests allowed for external services |
| 📚 **Complete REST API** | Full CRUD operations for monitors |
| 🏥 **Health Check Endpoint** | Database connection monitoring |
| 📊 **Ping History API** | Retrieve historical ping results |

### **Developer Experience**

| Feature | Description |
|---------|-------------|
| 🛡️ **TypeScript** | Fully typed codebase |
| 🎨 **shadcn/ui Components** | Beautiful, accessible UI components |
| 📱 **Responsive Design** | Works perfectly on desktop, tablet, and mobile |
| 🚀 **Serverless Ready** | Deploys to Vercel, Render, or any Node.js host |
| 🔄 **Auto-reconnecting Database** | Aggressive connection manager with 6 retries |

---

## 🛠️ **Tech Stack**

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 15 (App Router) | React framework with server-side rendering |
| **Language** | TypeScript | Type-safe JavaScript |
| **Database** | Neon PostgreSQL | Serverless Postgres with connection pooling |
| **ORM** | Drizzle ORM | Type-safe SQL query builder |
| **Authentication** | NextAuth.js (Auth.js) | OAuth for Google & GitHub |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS + pre-built components |
| **Icons** | Lucide React | Beautiful, consistent icons |
| **PWA** | Next.js Metadata + Manifest | Mobile app installation support |
| **Deployment** | Vercel | Serverless hosting + Cron Jobs |

---

## 🏗️ **Architecture**

```mermaid
flowchart TD

    %% Client Layer
    subgraph CLIENT["Client Layer"]
        UI1["Dashboard"]
        UI2["Add Monitor"]
        UI3["Monitor Detail / Edit"]
    end

    %% API Layer
    subgraph API["API Layer (Next.js Routes)"]
        A1["/api/auth"]
        A2["/api/monitors"]
        A3["/api/pings"]
        A4["/api/cron"]
        A5["/api/health"]
    end

    %% Worker Layer
    subgraph WORKER["Ping Processing Engine"]
        W1["60s Timeout"]
        W2["Retry Strategy"]
        W3["Wake-Up Detection"]
        W4["JSON Capture"]
        W5["SSL Validation"]
    end

    %% Database Layer
    subgraph DB["Neon PostgreSQL"]
        D1["monitors"]
        D2["ping_results"]
        D3["health_metrics"]
        D4["alerts"]
    end

    CLIENT --> API
    API --> WORKER
    WORKER --> DB
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ or Bun 1.0+
- pnpm (recommended) or npm
- Neon PostgreSQL account (free tier works)
- Google Cloud Console account (for OAuth)
- GitHub Developer account (for OAuth)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/sancy1/pingrobot.git
cd pingrobot

# Install dependencies
pnpm install
# or
npm install

# Copy environment variables
cp .env.example .env.local

# Set up environment variables (see below)
# Run database migrations
pnpm drizzle-kit push
# or
npx drizzle-kit push

# Start development server
pnpm dev
# or
npm run dev
Access the App
Open http://localhost:3000

Click "Continue with Google" or "Continue with GitHub"

Create your first monitor

Watch it ping automatically every minute!

🔐 Environment Variables
Create a .env.local file in the root directory:

bash
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# ============================================
# NEXT AUTH (AUTHENTICATION)
# ============================================
# Local Development
NEXTAUTH_URL=http://localhost:3000
# Production (uncomment for deployment)
# NEXTAUTH_URL=https://your-domain.vercel.app

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars

# ============================================
# GOOGLE OAUTH
# ============================================
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ============================================
# GITHUB OAUTH
# ============================================
# Get from: https://github.com/settings/developers
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# ============================================
# PING ENGINE CONFIGURATION
# ============================================
PING_TIMEOUT_MS=60000      # 60 seconds
MAX_RETRIES=3              # 3 retry attempts
RETRY_BACKOFF_MS=3000      # 3 seconds base backoff
WAKEUP_THRESHOLD_MS=5000   # 5 seconds = wake-up detection

# ============================================
# API & CRON SECURITY
# ============================================
EXTERNAL_API_KEY=your-api-key-for-external-services
CRON_SECRET=your-cron-secret-for-scheduled-jobs

# ============================================
# PUBLIC KEYS (Client-side accessible)
# ============================================
NEXT_PUBLIC_EXTERNAL_API_KEY=your-api-key
OAuth Setup Instructions
<details> <summary><b>Google OAuth Setup (Click to expand)</b></summary>
Go to Google Cloud Console

Create a new project or select existing

Enable Google+ API

Create OAuth 2.0 Client ID → Web application

Set Authorized redirect URIs:

http://localhost:3000/api/auth/callback/google

https://your-domain.vercel.app/api/auth/callback/google

Copy Client ID and Client Secret to .env.local

</details><details> <summary><b>GitHub OAuth Setup (Click to expand)</b></summary>
Go to GitHub Developer Settings

Click New OAuth App

Fill in:

Application name: PingRobot

Homepage URL: http://localhost:3000 (or production URL)

Authorization callback URL: http://localhost:3000/api/auth/callback/github

Register and copy Client ID & Client Secret

Add production callback URL: https://your-domain.vercel.app/api/auth/callback/github

</details>
🗄️ Database Schema
Monitors Table
sql
CREATE TABLE monitors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    description TEXT,
    monitor_type VARCHAR(50) DEFAULT 'http',
    method VARCHAR(10) DEFAULT 'GET',
    interval_seconds INTEGER DEFAULT 300,
    region VARCHAR(50) DEFAULT 'auto',
    timeout_ms INTEGER DEFAULT 60000,
    custom_headers JSONB DEFAULT '{}',
    request_body TEXT,
    expected_status_codes JSONB DEFAULT '[200,201,202,204]',
    ssl_enabled BOOLEAN DEFAULT FALSE,
    ssl_expiry_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'pending',
    user_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_ping_at TIMESTAMP,
    next_ping_at TIMESTAMP,
    uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
    total_pings INTEGER DEFAULT 0,
    successful_pings INTEGER DEFAULT 0,
    average_response_ms INTEGER DEFAULT 0
);
Ping Results Table
sql
CREATE TABLE ping_results (
    id SERIAL PRIMARY KEY,
    monitor_id INTEGER REFERENCES monitors(id) ON DELETE CASCADE,
    status_code INTEGER,
    response_time_ms INTEGER,
    success BOOLEAN NOT NULL,
    is_wake_up BOOLEAN DEFAULT FALSE,
    error_message VARCHAR(500),
    error_type VARCHAR(50),
    response_preview VARCHAR(500),
    json_response JSONB,
    ssl_valid BOOLEAN,
    ssl_expiry_days INTEGER,
    ping_region VARCHAR(50),
    ping_latency_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
🔑 Authentication
PingRobot uses NextAuth.js (Auth.js) for authentication with Google and GitHub providers.

How It Works
User clicks "Continue with Google" or "Continue with GitHub"

OAuth flow redirects to provider

Provider returns user email and profile data

Session is created with JWT token

User email is linked to monitors (ownership)

Protected Routes
Route	Authentication Required
/dashboard	✅ Yes
/add-monitor	✅ Yes
/monitors/[id]	✅ Yes
/monitors/[id]/edit	✅ Yes
/api/monitors	✅ Yes (API key also works)
/api/pings	✅ Yes (API key also works)
/api/cron	✅ Yes (CRON_SECRET)
/ (landing)	❌ No
Session Management
typescript
// Get session in client components
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
console.log(session?.user?.email);
typescript
// Get session in server components / API routes
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
📡 API Documentation
Base URL
Environment	Base URL
Local Development	http://localhost:3000/api
Production (Vercel)	https://pingrobot-seven.vercel.app/api
Authentication Headers
All API endpoints require one of:

Header	Value	Used For
X-API-Key	Your API key	External service access
Session Cookie	(auto from browser)	Browser access
Authorization: Bearer {CRON_SECRET}	Cron secret	/api/cron endpoint only
Endpoints
Monitors
Method	Endpoint	Description
GET	/api/monitors	List all monitors (filtered by user)
POST	/api/monitors	Create a new monitor
GET	/api/monitors/{id}	Get monitor details
PUT	/api/monitors/{id}	Update monitor configuration
DELETE	/api/monitors/{id}	Delete monitor
POST	/api/monitors/{id}/ping	Trigger manual ping
Pings
Method	Endpoint	Description
GET	/api/pings?monitorId={id}&limit=50	Get ping history
Health
Method	Endpoint	Description
GET	/api/health/db	Database connection status
Cron
Method	Endpoint	Description
GET/POST	/api/cron	Trigger scheduled pings (protected with CRON_SECRET)
API Examples
<details> <summary><b>Create a Monitor (cURL)</b></summary>
bash
curl -X POST "https://pingrobot-seven.vercel.app/api/monitors" \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API",
    "url": "https://api.example.com/health",
    "intervalSeconds": 300,
    "timeoutMs": 60000
  }'
</details><details> <summary><b>Get All Monitors (JavaScript)</b></summary>
javascript
const response = await fetch('https://pingrobot-seven.vercel.app/api/monitors', {
  headers: { 'X-API-Key': 'your-api-key' }
});
const data = await response.json();
console.log(data.monitors);
</details><details> <summary><b>Trigger Manual Ping (Python)</b></summary>
python
import requests

response = requests.post(
    'https://pingrobot-seven.vercel.app/api/monitors/1/ping',
    headers={'X-API-Key': 'your-api-key'}
)
print(response.json())
</details>
🔌 External API Consumption
PingRobot is designed to be consumed by external services, CI/CD pipelines, and other applications.

Use Cases
Use Case	Example
CI/CD Pipeline	Trigger ping after deployment to verify service is awake
Monitoring as a Service	Integrate PingRobot into your own monitoring platform
Slack/Discord Bots	Fetch monitor status for notifications
Internal Dashboards	Display uptime data in your company dashboard
Authentication for External Services
bash
# Set your API key in environment
export PINGROBOT_API_KEY="your-api-key"

# Use in requests
curl -X GET "https://pingrobot-seven.vercel.app/api/monitors" \
  -H "X-API-Key: $PINGROBOT_API_KEY"
Response Format
All API responses follow this structure:

json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
Error Handling
Status Code	Meaning
200	Success
201	Created
400	Bad Request (validation error)
401	Unauthorized (invalid API key)
404	Not Found
409	Conflict (duplicate URL)
500	Internal Server Error
📱 PWA & Mobile Installation
PingRobot is a Progressive Web App (PWA) that can be installed on mobile devices.

Installation Instructions
Android (Chrome)
Open PingRobot in Chrome

Tap the three dots menu (⋮)

Tap "Install App" or "Add to Home Screen"

Confirm installation

App icon appears on home screen, opens in standalone mode (no browser UI)

iOS (Safari)
Open PingRobot in Safari

Tap the Share button (□ with arrow up)

Scroll down and tap "Add to Home Screen"

Name the app and tap "Add"

App icon appears on home screen

PWA Features
Feature	Status
Offline fallback	✅ Basic
Push notifications	⏳ Planned
Background sync	⏳ Planned
Install prompt	✅ Enabled
Standalone mode	✅ Enabled
Splash screen	✅ Enabled
🚢 Deployment
Vercel (Recommended)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Environment Variables on Vercel
Add these in Vercel Dashboard → Project → Settings → Environment Variables:

Key	Value
DATABASE_URL	Your Neon connection string
NEXTAUTH_URL	https://your-domain.vercel.app
NEXTAUTH_SECRET	Generated secret
GOOGLE_CLIENT_ID	From Google Console
GOOGLE_CLIENT_SECRET	From Google Console
GITHUB_CLIENT_ID	From GitHub Developer
GITHUB_CLIENT_SECRET	From GitHub Developer
EXTERNAL_API_KEY	Your API key
CRON_SECRET	Your cron secret
Cron Jobs on Vercel
Vercel automatically reads vercel.json and sets up cron jobs:

json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "* * * * *"
    }
  ]
}
Manual Deployment
bash
# Build the application
pnpm build

# Start production server
pnpm start
💻 Development
Scripts
bash
# Development
pnpm dev              # Start dev server with hot reload

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema changes to database
pnpm db:generate      # Generate migration files
pnpm db:studio        # Open Drizzle Studio

# Linting & Type Checking
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler

# Testing (coming soon)
pnpm test             # Run tests
Project Structure
text
pingrobot/
├── app/
│   ├── add-monitor/           # Add monitor page
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth endpoints
│   │   ├── cron/               # Cron job endpoint
│   │   ├── health/             # Health check
│   │   ├── monitors/           # Monitor CRUD
│   │   └── pings/              # Ping history
│   ├── dashboard/              # Dashboard page
│   ├── monitors/               # Monitor detail + edit
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── header.tsx              # Header with user menu
│   ├── monitor-list.tsx        # Monitor list with filters
│   ├── sidebar.tsx             # Collapsible sidebar
│   ├── status-summary.tsx      # Status summary widget
│   └── theme-provider.tsx      # Dark/light theme
├── lib/
│   ├── db/                     # Database connection + schema
│   ├── ping-engine/            # Ping worker + SSL monitor
│   ├── scheduler/              # Unified cron scheduler
│   └── auth.ts                 # NextAuth configuration
├── public/                     # Static assets + PWA icons
├── scripts/                    # Utility scripts
├── middleware.ts               # Route protection
├── drizzle.config.ts           # Drizzle ORM config
├── next.config.mjs             # Next.js config
├── tailwind.config.ts          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── vercel.json                 # Vercel deployment config
🔧 Troubleshooting
Common Issues
<details> <summary><b>Database Connection Issues</b></summary>
Error: DATABASE_URL is not set

Solution: Ensure .env.local has DATABASE_URL or set in Vercel environment variables.

Error: Connection timeout

Solution: Your Neon database may be sleeping. The connection manager will auto-retry up to 6 times.

</details><details> <summary><b>OAuth Login Issues</b></summary>
Error: redirect_uri is not associated with this application

Solution: Add the correct callback URLs to your OAuth apps:

Google: https://your-domain.vercel.app/api/auth/callback/google

GitHub: https://your-domain.vercel.app/api/auth/callback/github

Error: NEXTAUTH_URL is not set

Solution: Set NEXTAUTH_URL to your production URL in Vercel environment variables.

</details><details> <summary><b>Monitors Not Pinging Automatically</b></summary>
Error: No monitors due for ping at this time

Solution: Run this SQL to reset stuck monitors:

sql
UPDATE monitors SET next_ping_at = NULL WHERE is_active = true;
Error: Cron job not running on Vercel

Solution: Check that vercel.json has cron configuration and that cron jobs are enabled in Vercel dashboard.

</details>
🗺️ Roadmap
Feature	Status	ETA
Email notifications	⏳ Planned	Q3 2024
Slack/Discord webhooks	⏳ Planned	Q3 2024
Multi-region ping (paid)	⏳ Planned	Q4 2024
Public status pages	⏳ Planned	Q4 2024
Team/organization support	⏳ Planned	Q1 2025
Custom metrics dashboard	⏳ Planned	Q1 2025
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/amazing)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing)

Open a Pull Request

Development Guidelines
Follow TypeScript best practices

Write meaningful commit messages

Update documentation when adding features

Test changes locally before submitting

📄 License
This project is licensed under the MIT License.

text
MIT License

Copyright (c) 2024 PingRobot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
🙏 Acknowledgments
Next.js - React framework

Neon - Serverless PostgreSQL

Drizzle ORM - Type-safe ORM

shadcn/ui - UI components

Tailwind CSS - Utility CSS framework

Lucide Icons - Beautiful icons

📞 Contact & Support
Channel	Link
GitHub Issues	github.com/sancy1/pingrobot/issues
Live Demo	pingrobot-seven.vercel.app
Email	support@pingrobot.com
