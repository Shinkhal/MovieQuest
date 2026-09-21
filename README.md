# 🎬 MovieQuest

MovieQuest is a modern, responsive, and high-performance movie discovery platform built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4. It empowers film enthusiasts with cinematic discovery, Google OAuth authentication, cloud-synced watchlists backed by MongoDB, community reviews, and shareable Cinephile Passports.

---

## 🚀 Live Demo

👉 **[moviequests.vercel.app](https://moviequests.vercel.app)**

---

## 🌟 Key Features

- 🔍 **Real-Time Movie Discovery**: Search by title, explore trending blockbusters, and filter by 19+ curated genres.
- 🔐 **Auth.js (NextAuth v5) Authentication**: Secure sign-in with Google OAuth and Guest Cinephile fallback access.
- 🗄️ **MongoDB Cloud Watchlist**: Synchronize your saved movies across devices in real-time.
- 🌟 **Cinephile Passports & Profiles (`/profile`)**:
  - Holographic glassmorphic passport card showcasing avatar, verified badge, top genres, and all-time favorite movie.
  - Dynamic Cinephile Ranks (*Novice Filmgoer* ➔ *Dedicated Cinephile* ➔ *Cinema Connoisseur* ➔ *Cinema Virtuoso*).
  - Public profile and watchlist sharing (`/profile/[id]`) with one-click social sharing to X (Twitter).
- ⭐ **Movie Ratings & Reviews**: Post star ratings and film critiques across movie detail pages.
- 🎥 **Rich Movie Details**: Cast & crew carousels, official YouTube trailers, streaming/rental provider feeds, and financial trivia.
- 🌓 **Theme Customization**: Fluid dark and light mode toggle with system preference detection.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **API & Data Fetching:** [TMDB API](https://www.themoviedb.org/documentation/api), [TanStack React Query](https://tanstack.com/query/latest), [Axios](https://axios-http.com/)
- **Icons & UI:** [Lucide Icons](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/), [Sonner Toasts](https://sonner.emilkowal.ski/)
- **Deployment:** [Vercel](https://vercel.com)

---

## 📦 Environment Variables

Create a `.env.local` file by copying the included template, then fill in your credentials:

```bash
cp .env.example .env.local
```

```env
# TMDB API (Server-only; kept secure on server side)
TMDB_API_KEY=your_tmdb_api_key

# MongoDB Database Connection (Server-only; MUST NOT be prefixed with NEXT_PUBLIC_)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/moviequest?retryWrites=true&w=majority

# Auth.js / NextAuth Configuration (Required in production — generate with: openssl rand -base64 32)
AUTH_SECRET=your_generated_auth_secret_key
AUTH_URL=https://moviequests.vercel.app

# Google OAuth Credentials (optional — guest login works without these)
AUTH_GOOGLE_ID=your_google_oauth_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

# Web3Forms Contact Form Key (server-side delivery)
FORM_KEY=your_web3forms_access_key

# Optional Application URL
NEXT_PUBLIC_APP_URL=https://moviequests.vercel.app
```

---

## 🔑 Google OAuth Setup Guide

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web Application).
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `https://moviequests.vercel.app`
4. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://moviequests.vercel.app/api/auth/callback/google`
5. Copy your Client ID and Client Secret into your `.env.local` or Vercel Environment Variables.

---

## 🧪 Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/Shinkhal/MovieQuest.git
cd MovieQuest

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Connect with Me

Created with 💙 by [Shinkhal Sinha](https://shinkhal-sinha.online)
