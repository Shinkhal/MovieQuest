import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String },
    image: { type: String },
    bio: { type: String, default: "Passionate film explorer and cinephile." },
    favoriteMovie: { type: String, default: "Interstellar (2014)" },
    favoriteGenres: { type: [String], default: ["Sci-Fi", "Drama", "Mystery"] },
    rankBadge: { type: String, default: "Dedicated Cinephile" },
    twitterUsername: { type: String, default: "" },
    letterboxdUsername: { type: String, default: "" },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.UserProfile || mongoose.model("UserProfile", UserProfileSchema);
