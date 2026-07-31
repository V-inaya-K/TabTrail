# TabTrail — Visual AI Browser Activity Tracker

TabTrail monitors your browsing activity and captures periodic screenshots — with your explicit permission — to help you understand how you spend time online. All data stays on your infrastructure.

## Architecture

```
extension (Chrome MV3)  →  backend (FastAPI + MongoDB)  →  frontend (React dashboard)
      ↑ captures                    ↑ stores/serves              ↑ visualizes
  tabs, clicks,              activities & screenshots       timeline, gallery,
  scrolls, screenshots                                      stats, search
```

## Quick Start

```bash
# Start backend + MongoDB
docker compose up -d

# Start frontend dev server
cd frontend && npm install && npm run dev

# Load extension in Chrome
# 1. Go to chrome://extensions
# 2. Enable "Developer mode"
# 3. "Load unpacked" → select extension/src folder
```

## Project Structure

| Folder | Purpose |
|---------|---------|
| `backend/` | FastAPI REST API with Motor/MongoDB |
| `frontend/` | React + TypeScript dashboard (Vite) |
| `extension/` | Chrome Manifest V3 extension |
| `docs/` | Architecture and API documentation |
| `scripts/` | Dev utilities, seed data |

## API

Base: `http://localhost:8000/api/v1`

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `POST /activities/batch` | Ingest activity batch |
| `GET /activities` | List activities (paginated) |
| `GET /activities/{id}` | Get one activity |
| `DELETE /activities/{id}` | Delete activity |
| `GET /activities/stats` | Aggregated stats |
| `POST /screenshots/batch` | Ingest screenshots |
| `GET /screenshots` | List screenshots (no base64) |
| `GET /screenshots/{id}` | Get screenshot with base64 |
| `DELETE /screenshots/{id}` | Delete screenshot |

## Privacy

The extension:
- Does NOT start recording until you explicitly click "Start Monitoring"
- Never captures password fields or sensitive form inputs
- Stores data on your own server
- Lets you delete all data at any time