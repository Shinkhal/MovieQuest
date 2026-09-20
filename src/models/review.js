import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true, index: true },
    movieTitle: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    userEmail: { type: String },
    role: { type: String, default: 'Cinephile' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
