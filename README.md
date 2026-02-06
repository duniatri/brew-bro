# Brew Bro ☕

<p align="center">
  <img src="https://cdn.abacus.ai/images/bbd26985-b3c0-4be8-a0de-e3056001dee7.jpg" alt="Brew Bro Logo" width="200"/>
</p>

<p align="center">
  <strong>Coffee roast analyzer and Aeropress brewing assistant</strong>
</p>

---

## ✨ Features

- 📸 **Camera Capture** - Snap a photo of your coffee beans for instant analysis
- 🤖 **AI-Powered Roast Detection** - Automatically identifies roast levels:
  - Light
  - Light-Medium
  - Medium
  - Medium-Dark
  - Dark
- 🌡️ **Water Temperature Recommendations** - Optimal temperatures for Aeropress brewing based on roast level
- ⏱️ **Brewing Timer** - Built-in timer with presets for perfect brews
- 📊 **History Tracking** - Keep track of your brewing sessions

## 📱 Screenshots

<!-- Add screenshots here -->
| Home | Camera Analysis | Timer | History |
|:----:|:---------------:|:-----:|:-------:|
| *Coming soon* | *Coming soon* | *Coming soon* | *Coming soon* |

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development and build tooling
- **TypeScript** - Type-safe JavaScript
- **react-native-paper** - Material Design components

### Backend
- **Node.js** - JavaScript runtime
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript

### AI
- **Abacus.AI RouteLLM** - GPT-4o vision for roast analysis

## 📁 Project Structure

```
brew_bro/
├── nodejs_space/          # Backend NestJS API
│   ├── src/
│   │   ├── roast-analyzer/   # Roast analysis module
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── react_native_space/    # Frontend React Native app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── navigation/       # Navigation setup
│   │   ├── screens/          # App screens
│   │   ├── services/         # API services
│   │   ├── theme/            # Styling theme
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   └── package.json
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Yarn
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

```bash
# Navigate to backend directory
cd nodejs_space

# Install dependencies
yarn install

# Create .env file with required variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
yarn start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd react_native_space

# Install dependencies
yarn install

# Start Expo development server
yarn start
```

Scan the QR code with Expo Go app or run on simulator.

## 📡 API Documentation

### Analyze Roast

**POST** `/api/analyze-roast`

Analyzes a coffee bean image and returns the roast level with brewing recommendations.

#### Request

```json
{
  "image": "base64_encoded_image_string"
}
```

#### Response

```json
{
  "roastLevel": "medium",
  "confidence": 0.92,
  "waterTemperature": {
    "celsius": 85,
    "fahrenheit": 185
  },
  "description": "Medium roast with balanced acidity and body"
}
```

Full API documentation available at `/api-docs` when the server is running.

## 🌡️ Water Temperature Guide

| Roast Level | Temperature (°C) | Temperature (°F) | Notes |
|:------------|:----------------:|:----------------:|:------|
| Light | 90-96 | 194-205 | Higher temp extracts more flavor from dense beans |
| Light-Medium | 88-93 | 190-199 | Slightly lower to balance extraction |
| Medium | 82-88 | 180-190 | Classic Aeropress range |
| Medium-Dark | 79-85 | 174-185 | Lower temp prevents over-extraction |
| Dark | 75-82 | 167-180 | Coolest water for most soluble beans |

## 📄 License

MIT License

Copyright (c) 2026 Brew Bro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
