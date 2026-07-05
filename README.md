# 🌾 AgriScan AI — Smart Crop Disease Detection & Farm Management

<div align="center">

**AI-powered crop disease detection and smart farming platform built to help farmers identify plant diseases, receive treatment recommendations, and manage their farms more efficiently.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Free APIs Used](#-free-apis-used)
- [Project Architecture](#-project-architecture)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
- [Folder Structure](#-folder-structure)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🌍 Project Overview

**AgriScan AI** is an intelligent farming assistant that empowers farmers — especially smallholder and rural farmers — to detect crop diseases early, receive actionable treatment plans, and make data-driven farming decisions.

Upload a photo of a plant leaf, and the AI engine will:
- Identify the crop type automatically
- Detect diseases with a confidence score
- Estimate severity and potential yield loss
- Recommend treatments, pesticides, and prevention strategies

Beyond disease detection, the platform provides a full-suite farm management dashboard including weather monitoring, soil analysis, fertilizer guidance, pest alerts, irrigation scheduling, market prices, and more — all in **multiple languages**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔬 **Plant Disease Detection** | Upload a leaf image for AI-powered disease identification with confidence scoring |
| 🌱 **AI Crop Analysis** | Automatic crop type detection from uploaded images |
| 💊 **Treatment Recommendations** | Detailed pesticide, organic, and preventive treatment plans |
| 📉 **Yield Loss Prediction** | Estimates potential crop yield loss based on disease severity |
| 📝 **Field Data Recording** | Record crop name, acreage, plant age, leaf conditions, and more |
| 🌦️ **Weather Risk Alerts** | Real-time weather data with farming risk assessments |
| 🛰️ **Satellite Crop Monitoring** | Interactive map with NDVI vegetation health overlays |
| 🧪 **Fertilizer Guidance** | NPK recommendations based on soil type and crop needs |
| 🐛 **Pest Monitoring** | Track pest risk levels with seasonal alerts |
| 📅 **Smart Farming Calendar** | Activity scheduling with crop-specific task recommendations |
| 💰 **Market Price Checker** | Current commodity prices and market trends |
| 🤖 **AI Farmer Assistant** | Voice-enabled chatbot for farming queries (Web Speech API) |
| 📊 **Scan History & Analytics** | Dashboard with charts showing scan trends, disease distribution, and crop health |
| 📥 **Excel Report Export** | Export individual or bulk scan reports to `.xlsx` files |
| 📧 **Email Report Delivery** | Send scan reports via email (requires backend integration) |
| 🌐 **Multi-Language Support** | English, Hindi, Telugu, and Tamil |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with component-based architecture |
| **Vite 5** | Fast build tool and dev server |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Shadcn UI** | Accessible, customizable component library |
| **Framer Motion** | Smooth animations and transitions |

### Data & Visualization
| Technology | Purpose |
|---|---|
| **Recharts** | Analytics charts and data visualization |
| **Leaflet.js** | Interactive maps with satellite overlays |
| **SheetJS (XLSX)** | Excel file generation and export |

### APIs & Integrations
| Technology | Purpose |
|---|---|
| **Open-Meteo API** | Weather forecasts and historical data |
| **SoilGrids API** | Soil composition analysis |
| **Web Speech API** | Voice input for the AI assistant |

### Backend (Optional — via Lovable Cloud / Supabase)
| Technology | Purpose |
|---|---|
| **Supabase (PostgreSQL)** | Database for scan records and user data |
| **Supabase Auth** | User authentication and session management |
| **Supabase Storage** | Image and file storage |
| **Edge Functions** | Server-side logic for emails and API integrations |

### Deployment
| Platform | Purpose |
|---|---|
| **Lovable** | One-click publish from the editor |
| **Vercel / Netlify** | Alternative static hosting via GitHub |

---

## 🌐 Free APIs Used

| API | URL | Purpose |
|---|---|---|
| **Open-Meteo** | `https://api.open-meteo.com` | Real-time weather data, forecasts, and farming risk alerts — no API key required |
| **SoilGrids** | `https://rest.isric.org/soilgrids` | Soil nutrient composition (NPK, pH, organic carbon) for fertilizer recommendations |
| **Sentinel / NDVI** | Via open satellite tile layers | Vegetation health index overlays on the interactive map |
| **Public Ag Datasets** | Various open sources | Market commodity pricing and crop reference data |

All APIs listed above are **free** and require **no API key** for basic usage.

---

## 🏗️ Project Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User        │────▶│  Upload Image    │────▶│  AI Detection   │
│  (Browser)   │     │  + Field Data    │     │  Engine          │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  Disease Result  │
                                              │  + Confidence    │
                                              │  + Severity      │
                                              │  + Treatment     │
                                              └────────┬────────┘
                                                       │
                              ┌─────────────────────────┼──────────────────┐
                              ▼                         ▼                  ▼
                    ┌──────────────┐          ┌──────────────┐   ┌──────────────┐
                    │  Dashboard   │          │  Excel Export │   │  Email Report│
                    │  Analytics   │          │  (.xlsx)      │   │  (optional)  │
                    └──────────────┘          └──────────────┘   └──────────────┘
```

**Flow:**
1. **User uploads** a plant leaf image with optional field parameters
2. **AI engine** auto-detects crop type and analyzes the image
3. **Disease detection** runs with confidence scoring and severity assessment
4. **Treatment plan** is generated with pesticide, organic, and preventive recommendations
5. **Results are stored** in scan history (localStorage or database)
6. **Reports** can be exported to Excel or emailed to the farmer

---

## 🚀 Installation Guide

### Prerequisites
- **Node.js** ≥ 18.x — [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** package manager

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/agriscan-ai.git

# 2. Navigate to project directory
cd agriscan-ai

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Other Commands

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

---

## 🔑 Environment Variables

The project works **out of the box** with no environment variables required — all APIs used are free and keyless.

If you enable **Lovable Cloud / Supabase** for backend features, the following will be auto-configured:

| Variable | Description | Where to Obtain |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Auto-provided by Lovable Cloud |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Auto-provided by Lovable Cloud |
| `RESEND_API_KEY` | Email delivery service key | [resend.com](https://resend.com) — free tier available |

> **Note:** Lovable projects do not use `.env` files. Secrets are managed through Lovable Cloud's built-in secrets manager.

---

## 🚢 Deployment Guide

### Option 1: Lovable (Recommended)
1. Open your project in [Lovable](https://lovable.dev)
2. Click **Share → Publish**
3. Your app is live with a shareable URL
4. Optionally connect a [custom domain](https://docs.lovable.dev/features/custom-domain)

### Option 2: Vercel
1. Push code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set framework preset to **Vite**
4. Add environment variables if using Supabase
5. Click **Deploy**

### Option 3: Netlify
1. Push code to GitHub
2. Connect the repo on [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

---

## 📁 Folder Structure

```
agriscan-ai/
├── public/                  # Static assets (favicon, robots.txt)
├── src/
│   ├── assets/              # Images and media
│   ├── components/
│   │   ├── ui/              # Shadcn UI components (Button, Card, etc.)
│   │   ├── AppLayout.tsx    # Main layout with sidebar
│   │   ├── AppSidebar.tsx   # Navigation sidebar
│   │   └── NavLink.tsx      # Navigation link component
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── farmer-data.ts   # Crop data, translations, and constants
│   │   ├── language-context.tsx  # Multi-language context provider
│   │   ├── mock-ai.ts       # AI detection engine and data management
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── Index.tsx         # Landing / home page
│   │   ├── UploadPage.tsx    # Image upload and field data form
│   │   ├── ResultPage.tsx    # Disease detection results
│   │   ├── DashboardPage.tsx # Analytics dashboard
│   │   ├── WeatherPage.tsx   # Weather monitoring
│   │   ├── MapPage.tsx       # Satellite map viewer
│   │   ├── AssistantPage.tsx # AI chatbot assistant
│   │   ├── DatasetPage.tsx   # Scan history and exports
│   │   ├── YieldPage.tsx     # Yield analysis
│   │   ├── CropRecommendPage.tsx  # Crop recommendations
│   │   ├── FertilizerPage.tsx     # Fertilizer guidance
│   │   ├── PestMonitorPage.tsx    # Pest monitoring
│   │   ├── FarmCalendarPage.tsx   # Farming calendar
│   │   ├── IrrigationPage.tsx     # Irrigation scheduling
│   │   ├── MarketPricePage.tsx    # Market prices
│   │   └── SettingsPage.tsx       # App settings
│   ├── App.tsx              # Root app with routing
│   └── main.tsx             # Entry point
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 🔮 Future Improvements

- 📱 **Mobile App** — React Native or PWA for offline field usage
- 🚁 **Drone Monitoring** — Aerial crop health scanning integration
- 🧠 **Advanced ML Models** — TensorFlow.js or cloud-based models for higher accuracy
- 📡 **Offline Mode** — Cache-first architecture for areas with poor connectivity
- 🔐 **User Authentication** — Secure login with scan history per user
- 📧 **Automated Email Reports** — Scheduled scan summaries sent to farmers
- 🗣️ **More Languages** — Kannada, Marathi, Bengali, and more regional languages
- 📸 **Real-time Camera Scan** — Live camera feed disease detection
- 🤝 **Community Forum** — Farmer-to-farmer knowledge sharing
- 📈 **Predictive Analytics** — ML-based yield forecasting and disease outbreak prediction

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for farmers worldwide**

🌾 AgriScan AI — Empowering Agriculture with Artificial Intelligence

</div>
