import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    userEmail: { type: String },
    movies: [
      {
        id: { type: Number, required: true },
        title: { type: String, required: true },
        poster_path: { type: String },
        backdrop_path: { type: String },
        vote_average: { type: Number },
        overview: { type: String },
        release_date: { type: String },
        genre_ids: [Number],
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Watchlist || mongoose.model("Watchlist", WatchlistSchema);

