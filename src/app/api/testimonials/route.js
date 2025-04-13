import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/testimonial";

export async function GET() {
  await connectToDatabase();
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  return Response.json({ testimonials });
}

export async function POST(request) {
  await connectToDatabase();
  const { name, avatar, role, feedback } = await request.json();

  if (!name || !feedback) {
    return Response.json({ message: "Name and feedback are required." }, { status: 400 });
  }

  const newTestimonial = await Testimonial.create({ name, avatar, role, feedback });
  return Response.json(newTestimonial, { status: 201 });
}
