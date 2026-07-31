# TabTrail — Visual AI Browser Activity Tracker

<div align="center">

![TabTrail Logo](https://via.placeholder.com/800x200/1e293b/3b82f6?text=TabTrail+%7C+Visual+AI+Browser+Activity+Tracker)

**A production-ready SaaS application that transforms browsing activity into AI-powered insights**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/Groq-FF6B6B?style=flat&logo=groq&logoColor=white)](https://groq.com/)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 🎯 Overview

TabTrail is an enterprise-grade Visual AI agent that automatically tracks browser activity and uses **Groq Vision API** to analyze screenshots, extract UI elements, detect workflows, and generate intelligent summaries. Perfect for productivity analysis, workflow optimization, and research documentation.

### Why TabTrail?

- 🤖 **AI-Powered Analysis**: Groq Vision API automatically analyzes every screenshot
- 🔒 **Privacy-First**: All data stays on your infrastructure
- ⚡ **Offline-Ready**: IndexedDB queue ensures tracking works without backend
- 📊 **Premium Dashboard**: SaaS-quality React interface with real-time analytics
- 🎨 **Modern UX**: Smooth animations, toast notifications, skeleton loaders
- 🔐 **Secure**: Sensitive input filtering, CORS protection, MongoDB authentication ready

---

## ✨ Features

### 🤖 AI-Powered Screenshot Analysis
- **Groq Vision API** integration with `llava-v1.5-7b-4096-preview` model
- Automatic analysis of every captured screenshot
- **Extracts UI elements**: Buttons, forms, dialogs, menus, links
- **Detects workflow context**: "coding", "shopping", "reading", "social media"
- **Categorizes pages**: Coding, Shopping, Reading, Social, Finance, Productivity, Entertainment
- **Tesseract OCR fallback**: Continues working when API unavailable

### 🎯 Browser Activity Tracking
- Tab changes and navigation events
- Click tracking with element detection (tagName, text, class, ID, coordinates)
- Scroll depth monitoring with percentage tracked
- Automatic screenshots every 30 seconds (configurable)
- **Privacy filters**: Never captures password fields, credit cards, SSNs, tokens, auth keys

### 📊 Premium SaaS Dashboard
- **Dashboard**: Stats cards, domain charts, recent activity timeline
- **Timeline**: Infinite scroll activity list with advanced filters
- **Screenshots**: Grid gallery with modal preview and AI summaries
- **Settings**: Extension setup, privacy controls, backend configuration
- **Toast Notifications**: Success/error/info/warning feedback
- **Skeleton Loaders**: Smooth loading states throughout
- **Responsive Design**: Works beautifully on desktop, tablet, mobile
- **Dark Theme**: Eye-friendly dark mode as default

### 🔄 Offline-First Architecture
- **IndexedDB queue** using `idb` library
- Automatic sync when connection restored
- Exponential backoff retry logic (1s → 2s → 4s → ... max 60s)
- Chrome alarms for background sync every 1 minute
- Queue size indicator in extension popup

### 🛡️ Security & Privacy
- Sensitive input filtering (passwords, credit cards, tokens, SSNs)
- CORS protection with configurable origins
- MongoDB authentication support
- Extension only tracks when explicitly started
- No third-party data collection

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Node.js 20+
- Python 3.11+
- MongoDB 7.0+ (or MongoDB Atlas free tier)
- Groq API Key (free at https://console.groq.com)

# Optional (for OCR fallback)
- Tesseract OCR: apt-get install tesseract-ocr (Linux) or brew install tesseract (Mac)
```

### 1. Clone Repository

```bash
git clone <your-repo-url> TabTrail
cd TabTrail
```

### 2. Backend Setup (FastAPI + MongoDB)

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

**Backend `.env` Configuration:**

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=tabtrail
APP_ENV=development
LOG_LEVEL=DEBUG
API_V1_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:5173
MAX_BATCH_SIZE=100
MAX_SCREENSHOT_BASE64_BYTES=1048576

# Groq Vision API (REQUIRED for AI analysis)
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_VISION_MODEL=llava-v1.5-7b-4096-preview
```

**Start Backend:**

```bash
# Option 1: Docker Compose (includes MongoDB)
docker compose up -d

# Option 2: Local development
mongod  # Start MongoDB in another terminal
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at http://localhost:8000
API Docs: http://localhost:8000/docs

### 3. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional, default works)
cp .env.example .env

# Start development server
npm run dev
```

Frontend will be available at http://localhost:5173

### 4. Chrome Extension Setup

```bash
cd extension

# Install dependencies
npm install

# Build extension
npm run build
```

**Load Extension in Chrome:**

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select `extension/dist` folder
5. Click TabTrail icon → **"Start Monitoring"**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Chrome Extension                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Service     │  │   Content    │  │   Popup UI         │   │
│  │  Worker      │  │   Scripts    │  │ (Start/Stop/Stats) │   │
│  └──────┬───────┘  └──────┬───────┘  └────────────────────┘   │
│         │                  │                                     │
│         │        ┌─────────▼──────────┐                        │
│         └────────►  IndexedDB Queue   │                        │
│                   └─────────┬──────────┘                        │
└─────────────────────────────┼──────────────────────────────────┘
                              │ HTTP POST (batch)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       FastAPI Backend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Routers    │──►   Services   │──►   Repositories     │   │
│  └──────────────┘  └──────┬───────┘  └─────────┬──────────┘   │
│                            │                     │               │
│                    ┌───────▼──────────┐  ┌──────▼──────────┐   │
│                    │  AI Analysis     │  │    MongoDB      │   │
│                    │  (Groq Vision)   │  │    (Motor)      │   │
│                    └──────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     React Dashboard                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Dashboard   │  │   Timeline   │  │   Screenshots      │   │
│  │  (Stats)     │  │ (Activities) │  │   (Gallery)        │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│                    React Query + Axios                           │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User browses web → Extension captures events (tabs, clicks, scrolls)
2. Screenshot taken every 30s → Compressed to JPEG quality 60
3. Events queued in IndexedDB → Batch sent to backend API
4. Backend receives screenshot → Calls Groq Vision API
5. AI extracts UI elements + workflow context → Stored in MongoDB
6. Dashboard polls API → Displays activities + AI summaries
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
Currently no authentication (add JWT/API keys for production)

### Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "tabtrail-backend"
}
```

#### Activities

**Create Activity Batch**
```http
POST /api/v1/activities/batch
Content-Type: application/json

{
  "userId": "user_123",
  "clientId": "ext_abc",
  "activities": [
    {
      "type": "tab_change",
      "url": "https://github.com",
      "domain": "github.com",
      "title": "GitHub",
      "tabId": 1,
      "windowId": 1,
      "metadata": {},
      "recordedAt": "2026-07-31T18:00:00Z"
    }
  ]
}
```

**List Activities**
```http
GET /api/v1/activities?userId=user_123&page=1&pageSize=50&type=tab_change&domain=github.com
```

**Response:**
```json
{
  "items": [...],
  "total": 1523,
  "page": 1,
  "pageSize": 50,
  "pages": 31
}
```

**Get Activity Stats**
```http
GET /api/v1/activities/stats?userId=user_123
```

**Response:**
```json
{
  "totalActivities": 5000,
  "topDomains": [
    {"domain": "github.com", "count": 1200},
    {"domain": "stackoverflow.com", "count": 800}
  ],
  "activityByHour": [
    {"hour": 9, "count": 300},
    {"hour": 10, "count": 450}
  ],
  "typeBreakdown": {
    "tab_change": 2000,
    "click": 1500,
    "scroll": 1000,
    "navigation": 500
  }
}
```

#### Screenshots

**Create Screenshot Batch**
```http
POST /api/v1/screenshots/batch
Content-Type: application/json

{
  "userId": "user_123",
  "clientId": "ext_abc",
  "screenshots": [
    {
      "url": "https://github.com",
      "domain": "github.com",
      "tabId": 1,
      "imageBase64": "base64_string_here",
      "imageWidth": 1280,
      "imageHeight": 720,
      "fileSizeBytes": 150000,
      "recordedAt": "2026-07-31T18:00:00Z"
    }
  ]
}
```

**List Screenshots** (no base64)
```http
GET /api/v1/screenshots?userId=user_123&page=1&pageSize=48
```

**Get Screenshot with Image**
```http
GET /api/v1/screenshots/{screenshot_id}
```

**Analyze Screenshot** (trigger AI analysis)
```http
POST /api/v1/screenshots/{screenshot_id}/analyze
```

**Response:**
```json
{
  "id": "...",
  "summary": "GitHub repository page showing code files and README",
  "uiElements": ["Clone button", "Code tab", "Issues tab", "Pull requests tab", "README.md"],
  "workflowContext": "browsing source code repository",
  "pageCategory": "coding"
}
```

---

---

## 🚀 Deployment

### Backend (Production)

**Option 1: Docker**

```bash
# Build production image
cd backend
docker build -f Dockerfile -t tabtrail-backend:latest .

# Run container
docker run -d \
  -p 8000:8000 \
  -e MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net" \
  -e GROQ_API_KEY="your_key" \
  -e APP_ENV="production" \
  -e CORS_ORIGINS="https://yourdomain.com" \
  tabtrail-backend:latest
```

**Option 2: Cloud Platforms**

- **Railway**: Connect GitHub, auto-deploy on push
- **Render**: Add `render.yaml` for one-click deploy
- **Fly.io**: `flyctl launch` for instant deployment
- **AWS ECS**: Use provided Dockerfile

### Frontend (Production)

```bash
cd frontend
npm run build
# Deploy dist/ folder to:
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod
# - CloudFlare Pages: wrangler pages publish dist
```

**Update .env for production:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### MongoDB Atlas (Free Tier)

1. Create account at https://cloud.mongodb.com
2. Create free M0 cluster
3. Add database user
4. Whitelist IP: `0.0.0.0/0` (or specific IPs)
5. Get connection string
6. Update `MONGODB_URI` in backend .env

### Chrome Extension Distribution

**Option 1: Chrome Web Store**
1. Create developer account ($5 one-time fee)
2. Zip `extension/dist` folder
3. Upload to Chrome Web Store Developer Dashboard
4. Complete store listing with screenshots
5. Submit for review (usually 1-3 days)

**Option 2: Enterprise Distribution**
- Use Chrome Enterprise policies for internal deployment
- Load unpacked extension on each machine

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest -v

# With coverage
pytest --cov=app --cov-report=html
```

### Frontend Type Check

```bash
cd frontend
npm run typecheck

# Build test
npm run build
```

### Extension Build

```bash
cd extension
npm run build
```

---

## 🐛 Troubleshooting

### Extension Not Tracking

**Symptoms**: No activities showing in dashboard

**Solutions**:
1. Check if monitoring is started (green "Recording" badge in popup)
2. Open `chrome://extensions` → TabTrail → Service Worker → Console
3. Look for errors in console
4. Verify backend is running: `curl http://localhost:8000/health`
5. Check IndexedDB queue: DevTools → Application → IndexedDB → tabtrail-queue

### AI Analysis Not Working

**Symptoms**: Screenshots have no AI summaries

**Solutions**:
1. Verify `GROQ_API_KEY` is set in backend `.env`
2. Check backend logs: `docker compose logs backend -f`
3. Test API directly: `POST /api/v1/screenshots/{id}/analyze`
4. Check Groq API status: https://status.groq.com
5. OCR fallback activates automatically if API unavailable

### MongoDB Connection Failed

**Symptoms**: Backend crashes on startup

**Solutions**:
1. Verify MongoDB is running: `mongosh` or check Docker: `docker ps`
2. Check `MONGODB_URI` format in `.env`
3. For Atlas: verify IP whitelist includes your IP
4. For Atlas: verify username/password are correct
5. Check MongoDB logs: `docker compose logs mongodb`

### Frontend API Errors

**Symptoms**: Dashboard shows loading state forever

**Solutions**:
1. Check CORS configuration in backend `.env`: `CORS_ORIGINS=http://localhost:5173`
2. Verify backend is accessible: Open http://localhost:8000/docs
3. Check browser console for errors (F12)
4. Verify API base URL in `frontend/.env`

### Screenshots Not Capturing

**Symptoms**: No screenshots in gallery

**Solutions**:
1. Extension needs `activeTab` permission (check manifest)
2. Screenshots won't work on `chrome://` pages (Chrome restriction)
3. Check screenshot alarm: Extension → Service Worker → `chrome.alarms.getAll()`
4. Verify screenshot interval in popup settings

---

## 📊 Performance & Limits

### MongoDB

- **Activities**: ~1KB per document → 1M activities = ~1GB
- **Screenshots**: ~150KB per screenshot → 1000 screenshots = ~150MB
- **Indexes**: Ensure indexes exist for query performance
- **TTL**: Consider adding TTL indexes to auto-delete old data after 90 days

### Extension

- **Screenshot frequency**: Default 30s, configurable
- **IndexedDB quota**: ~50-100MB typical, up to 60% disk space
- **Batch size**: 50 activities or 10 screenshots per sync
- **Memory**: ~20-30MB service worker memory usage

### Backend

- **Concurrent requests**: Uvicorn handles ~1000 req/s with gunicorn workers
- **Groq API rate limits**: Check your Groq plan (free tier: 30 req/min)
- **MongoDB connection pooling**: Motor defaults to 100 connections

## 🗺️ Future Roadmap

### Phase 1: Enhanced AI (v1.1)
- [ ] Session replay with playback controls
- [ ] AI-powered daily summaries
- [ ] Smart search with natural language queries
- [ ] Export sessions (PDF/CSV/JSON)
- [ ] Privacy dashboard with excluded websites

### Phase 2: Collaboration (v1.2)
- [ ] Team workspaces with shared analytics
- [ ] Activity sharing via public links
- [ ] Real-time collaboration dashboard
- [ ] Slack/Discord notifications integration

### Phase 3: Advanced Analytics (v1.3)
- [ ] Productivity scoring algorithm
- [ ] Focus time vs distraction time tracking
- [ ] Website category recommendations
- [ ] Weekly/monthly reports with insights
- [ ] Chrome extension for Firefox support

### Phase 4: Enterprise (v2.0)
- [ ] SSO authentication (Google, Microsoft, Okta)
- [ ] Role-based access control (RBAC)
- [ ] Audit logs for compliance
- [ ] On-premise deployment option
- [ ] API webhooks for integrations

---

## 🙏 Acknowledgments

- **Groq** for blazing-fast vision API inference
- **FastAPI** for elegant Python backend framework
- **React Query** for powerful data synchronization
- **Recharts** for beautiful chart visualizations
- **Tailwind CSS** for utility-first styling
- **MongoDB** for flexible document storage
- **Chrome Extensions API** for browser integration
- **IndexedDB** for offline-first architecture

---

<div align="center">

**Built with ❤️ using Groq Vision AI**

Production-Ready • Privacy-First • Offline-Capable • Portfolio-Quality

⭐ Star this repo if you find it useful!

</div>
