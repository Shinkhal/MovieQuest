
# 🎬 MovieQuest

MovieQuest is a modern, responsive, and high-performance movie discovery platform built with Next.js and TypeScript. It uses the TMDB API to let users explore movies by genre, popularity, trending status, and ratings — all in a sleek dark-themed UI.

![image](https://github.com/user-attachments/assets/9fef2873-d5ee-48f6-880f-4b97c4c01a4e)


## 🚀 Live Demo

👉 [movies-quest.vercel.app](https://movies-quest.vercel.app)

---

## 🌟 Features

- 🔍 **Search Movies** by title with autocomplete support
- 📊 **Filter** by Trending, Popular, and Top Rated
- 🎭 **Browse by Genre** dynamically
- 🎥 **Detailed Movie Pages** with ratings, overviews, release date, and more
- 💡 **Responsive Design** optimized for mobile, tablet, and desktop
- ⚙️ **Performance Optimized** with lazy loading, code splitting, and image optimization
- 🧩 **Error Handling** for API and routing edge cases

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **API:** [TMDB API](https://www.themoviedb.org/documentation/api)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide](https://lucide.dev/)
- **Font Optimization:** `next/font`
- **Deployment:** [Vercel](https://vercel.com)

---

## 📁 Folder Structure

```

MovieQuest/
├── public/             # Static assets
├── src/
│   ├── app/            # App Router pages
│   ├── components/     # Reusable UI components
│   ├── lib/            # API utilities, constants
├── next.config.ts      # Next.js config
├── postcss.config.mjs  # Tailwind/PostCSS config
├── tsconfig.json       # TypeScript config

````

---

## 🧪 Getting Started

To run the project locally:

```bash
# Clone the repo
git clone https://github.com/Shinkhal/MovieQuest.git
cd MovieQuest

# Install dependencies
npm install

# Add your TMDB API key in environment variables
touch .env.local
# Add: NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here

# Run the app
npm run dev

# Open http://localhost:3000 in your browser
````

---

## 📦 Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

Get your API key from [The Movie Database](https://www.themoviedb.org/documentation/api).

---

## ✨ Future Improvements

* 🔐 Add user authentication (favorites, watchlist)
* 📽️ Integrate trailers with YouTube embeds
* 📱 Convert to PWA for offline support
* 🧠 Add AI-powered recommendations

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Connect with Me

Created with 💙 by [Shinkhal Sinha](https://shinkhal-sinha.online)


