# TabTrail — Visual AI Browser Activity Tracker

TabTrail is a production-ready Visual AI agent that tracks your browsing activity and automatically analyzes screenshots using the Groq Vision API to generate meaningful insights about your workflow, UI elements, and page context.

## 🚀 Features

### 🤖 AI-Powered Screenshot Analysis
- **Groq Vision API** integration with `llava-v1.5-7b-4096-preview` model
- Automatic analysis of every captured screenshot
- Extracts UI elements (buttons, forms, dialogs, menus)
- Detects workflow context (coding, shopping, reading, social media)
- Categorizes pages automatically
- **Tesseract OCR fallback** when API unavailable

### 🎯 Browser Activity Tracking
- Tab changes and navigation events
- Click tracking with element detection
- Scroll depth monitoring
- Automatic screenshots every 30 seconds
- **Privacy-first**: Never captures password fields or sensitive inputs

### 📊 Premium SaaS Dashboard
- Real-time activity timeline with filters
- AI-generated summaries for each screenshot
- Domain analytics with interactive charts
- Screenshot gallery with modal preview
- Search and advanced filtering
- Responsive dark/light theme
- Loading states and error handling

### 🔄 Offline-First Architecture
- IndexedDB-backed queue for offline resilience
- Automatic sync when connection restored
- Exponential backoff retry logic
- Chrome alarms for background sync

## 📋 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | FastAPI, Motor (async MongoDB), Structlog, Pydantic v2 |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, React Query |
| **Extension** | Chrome Manifest V3, TypeScript, IndexedDB (idb), Webpack |
| **AI** | Groq API (Vision), OpenAI SDK, Tesseract OCR |
| **Database** | MongoDB 7.0 (Atlas Free Tier compatible) |
| **Infrastructure** | Docker Compose, Uvicorn |

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** 20+
- **Python** 3.11+
- **MongoDB** 7.0+ (or MongoDB Atlas)
- **Docker** and Docker Compose (optional)
- **Groq API Key** (get free at https://console.groq.com)
- **Tesseract OCR** (optional fallback): `apt-get install tesseract-ocr` (Linux) or `brew install tesseract` (Mac)

### 1. Clone and Setup

```bash
git clone <your-repo-url> TabTrail
cd TabTrail
```

### 2. Backend Setup

```bash
cd backend

# Create Python virtual environment
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
GROQ_API_KEY=gsk_your_actual_key_here
GROQ_VISION_MODEL=llava-v1.5-7b-4096-preview
```

**Start Backend:**
```bash
# Option 1: With Docker Compose (includes MongoDB)
docker compose up -d

# Option 2: Local development
mongod  # Start MongoDB locally
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed (default points to localhost:8000)

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
1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `extension/dist` folder
5. Click the TabTrail extension icon
6. Click **"Start Monitoring"** to begin tracking

## 🎯 Usage

### Starting the System

1. **Start Backend:**
   ```bash
   cd backend
   docker compose up -d  # or uvicorn app.main:app --reload
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Load Extension:**
   - Open `chrome://extensions`
   - Click the TabTrail icon
   - Click "Start Monitoring"

4. **View Dashboard:**
   - Open http://localhost:5173
   - See real-time activity, AI summaries, and analytics

### How AI Analysis Works

1. Extension captures screenshot every 30s
2. Screenshot uploaded to backend via `/screenshots/batch`
3. Backend calls Groq Vision API automatically
4. AI analyzes screenshot and extracts:
   - **Summary**: One-sentence page description
   - **UI Elements**: Buttons, forms, dialogs, menus
   - **Workflow Context**: User's likely task (coding, shopping, etc.)
   - **Page Category**: Coding, social, finance, productivity, etc.
5. Results stored in MongoDB with screenshot
6. Dashboard displays AI insights alongside activity timeline

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/activities/batch` | Ingest activity batch |
| GET | `/api/v1/activities` | List activities (paginated) |
| GET | `/api/v1/activities/{id}` | Get single activity |
| DELETE | `/api/v1/activities/{id}` | Delete activity |
| GET | `/api/v1/activities/stats` | Aggregated stats |
| POST | `/api/v1/screenshots/batch` | Ingest screenshots |
| GET | `/api/v1/screenshots` | List screenshots (no base64) |
| GET | `/api/v1/screenshots/{id}` | Get screenshot with base64 |
| POST | `/api/v1/screenshots/{id}/analyze` | Re-analyze screenshot |
| DELETE | `/api/v1/screenshots/{id}` | Delete screenshot |

## 🔒 Privacy & Security

- **No cloud storage**: All data stays on your infrastructure
- **Sensitive input filtering**: Automatically excludes password fields, credit cards, tokens
- **Explicit consent**: Extension only tracks when you click "Start Monitoring"
- **Local-first**: Offline queue ensures functionality without backend
- **MongoDB security**: Configure authentication for production use

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest -v
```

### Frontend Type Check
```bash
cd frontend
npm run typecheck
```

### Extension Build
```bash
cd extension
npm run build
```

## 📚 Project Structure

```
TabTrail/
├── backend/           # FastAPI backend with Groq Vision AI
│   ├── app/
│   │   ├── core/      # Config, database, logging, exceptions
│   │   ├── models/    # Pydantic models for validation
│   │   ├── repositories/  # MongoDB data access layer
│   │   ├── services/  # Business logic + AI analysis
│   │   ├── routers/   # REST API endpoints
│   ├── tests/         # Pytest test suite
│   └── Dockerfile
├── frontend/          # React + TypeScript dashboard
│   ├── src/
│   │   ├── api/       # API client and hooks
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/     # React Query hooks
│   │   ├── pages/     # Route pages
│   │   └── lib/       # Utilities
├── extension/         # Chrome Manifest V3 extension
│   ├── src/
│   │   ├── background/ # Service worker, tracking, screenshots
│   │   ├── content/   # Content script for clicks/scrolls
│   │   ├── popup/     # Extension popup UI
│   │   └── lib/       # Offline queue, API client, types
└── docs/              # Additional documentation
```

## 🚀 Production Deployment

### MongoDB Atlas
1. Create free MongoDB Atlas cluster
2. Update `MONGODB_URI` in backend `.env`
3. Whitelist your IP address
4. Configure database user

### Backend Deployment
- Use `backend/Dockerfile` for containerization
- Configure `CORS_ORIGINS` for production domain
- Set `APP_ENV=production` in `.env`
- Use environment variable management (AWS Secrets Manager, etc.)

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel, Netlify, or CloudFlare Pages
```

### Extension Distribution
- Publish to Chrome Web Store
- Update `backend URL` in extension settings
- Provide setup instructions to users

## 🐛 Troubleshooting

### Extension not tracking
- Check if monitoring is started (green badge in popup)
- Open `chrome://extensions` → Service Worker → Console
- Verify backend is running and accessible

### AI analysis not working
- Verify `GROQ_API_KEY` is set in backend `.env`
- Check backend logs: `docker compose logs backend`
- Test endpoint: `POST /api/v1/screenshots/{id}/analyze`
- OCR fallback will activate if API unavailable

### MongoDB connection failed
- Verify MongoDB is running: `mongosh`
- Check `MONGODB_URI` in `.env`
- For Atlas: verify IP whitelist and credentials

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Groq** for fast vision API inference
- **FastAPI** for modern Python backend framework
- **React Query** for powerful data fetching
- **Recharts** for beautiful charts
- **Tailwind CSS** for utility-first styling

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check API documentation at `/docs` (FastAPI auto-generated)
- Review backend logs for debugging

---

**Built with ❤️ using Groq Vision AI** • Production-ready • Privacy-first • Offline-capable