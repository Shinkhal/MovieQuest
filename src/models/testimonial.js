import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    avatar: { type: String, default: "U" },
    role: { type: String, default: "Film Lover", maxlength: 50 },
    feedback: { type: String, required: true, maxlength: 500 },
    userEmail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
