import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  role: String,
  feedback: String,
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
