# 🎓 StudentBuddy — AI-Powered Educational Ecosystem

[![Flutter](https://img.shields.io/badge/Flutter-3.10%2B-blue?logo=flutter)](https://flutter.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini-orange?logo=google)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**StudentBuddy** is a comprehensive, AI-powered educational ecosystem designed to bridge productivity, mentorship, and assessment. It serves as a 24/7 personalized tutor, dynamic assessment engine, and central hub for student academic growth.

Drawing UI/UX inspiration from premium, high-engagement consumer platforms like Zomato and Instamart, StudentBuddy incorporates rich color gradients, glassmorphism UI elements, smooth micro-animations, and shimmer loading states.

---

## ✨ Key Features

- 🤖 **AI Mentor Chat (Core Feature)**
  - Powered by Google Gemini AI & specialized backend microservices.
  - Supports text queries and OCR image analysis for homework verification and math solving.
- 🎯 **Interactive Test Arena**
  - Distraction-free assessment environment equipped with anti-cheat measures.
  - Automatic test evaluation and instant score generation.
- 📊 **Real-time Analytics & Insights**
  - Interactive radar graphs and line charts (via `fl_chart`) tracking subject performance, streaks, and focus areas.
- 🗺️ **Immersive Learning Roadmap**
  - Database-synced interactive progression system adapting to student level and goals.
- 🔐 **Role-Based Experience**
  - Tailored experience for **Students**, **Admins** (test creation, student monitoring), and **SuperAdmins** (system configuration).
- 🔔 **Supabase Realtime Notifications**
  - Live test announcements and updates broadcasted directly to student dashboards.

---

## 🛠️ Technology Stack

| Layer | Technologies & Packages |
| :--- | :--- |
| **Frontend Framework** | Flutter (Dart SDK `>=3.10.4`), Cross-Platform (Android, iOS, Web) |
| **State & Navigation** | `provider` for state management, `go_router` for role-based routing |
| **UI & Graphics** | `flutter_animate`, `lottie`, `google_fonts`, `fl_chart` for data visualization |
| **Backend & Database** | **Supabase** (PostgreSQL database with 17+ tables, Supabase Auth, Realtime engine) |
| **Authentication** | Supabase Auth + `google_sign_in` for OAuth social sign-in |
| **AI Integration** | Google Generative AI (Gemini API) & Python microservices |
| **Data & Utilities** | `excel` (CSV/Excel import), `syncfusion_flutter_pdf` (Report generation), `image_picker` |

---

## 📁 Repository Structure

```
StudentBuddy/
├── android/                 # Android platform specific configurations
├── assets/                  # Images, lottie animations, and static assets
├── lib/                     # Application source code
│   ├── main.dart            # Main entry point & app initialization
│   ├── models/              # Data models & Supabase schemas
│   ├── providers/           # State management providers
│   ├── screens/             # UI Screens (Auth, Dashboard, Test Arena, Mentor, Analytics)
│   ├── services/            # Supabase & AI API service integrations
│   └── widgets/             # Reusable UI components & custom widgets
├── supabase_schema.sql      # Main PostgreSQL database schema
├── add_app_config.sql       # Application configuration setup script
├── luck_card_schema.sql     # Gaming & engagement module database schema
├── optimize_dashboard.sql   # SQL optimization queries for dashboard analytics
├── analysis_options.yaml    # Dart linter configurations
├── pubspec.yaml             # Project dependencies and asset declarations
└── README.md                # Project documentation
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites

Ensure your development environment meets the following requirements:
1. **Flutter SDK:** Version `3.10.4` or higher installed and added to `PATH`.
2. **Dart SDK:** Version `^3.10.4`.
3. **Android Studio / VS Code:** Configured with Flutter & Dart extensions.
4. **Android Emulator / Physical Device:** Android API level 21 (Lollipop) or higher.

### 1. Clone the Repository

```bash
git clone https://github.com/Induja-2103/StudentBuddy.git
cd StudentBuddy
```

### 2. Install Dependencies

Run package resolution:

```bash
flutter pub get
```

### 3. Environment Variables Configuration

Create a `.env` file in the root directory of the project and add your API keys:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anonymous-key
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENROUTER_KEY=your-openrouter-api-key
```

> **Note:** Never commit your `.env` file containing confidential API keys to version control.

### 4. Database Setup

1. Create a project on [Supabase](https://supabase.com/).
2. Open the SQL Editor in your Supabase Dashboard.
3. Execute `supabase_schema.sql` to initialize the database tables, policies, and roles.
4. Optionally run `add_app_config.sql`, `luck_card_schema.sql`, and `optimize_dashboard.sql` for additional configuration and optimizations.

### 5. Run the Application

```bash
flutter run
```

---

## 📦 Compiling Release Builds

To build an Android APK for distribution:

```bash
flutter build apk --release
```

The compiled APK will be located at:
`build/app/outputs/flutter-apk/app-release.apk`

---

## 📄 License

This project is maintained for educational and platform demonstration purposes.
