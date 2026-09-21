import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Testimonial from '@/models/testimonial';
import { sanitizeText } from '@/lib/utils';

export async function GET() {
  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ testimonials }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json({ testimonials: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required to submit testimonials.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, role, feedback } = body || {};

    const cleanName = sanitizeText(name || session.user.name).slice(0, 50);
    const cleanRole = sanitizeText(role || 'Film Lover').slice(0, 50);
    const cleanFeedback = sanitizeText(feedback).slice(0, 500);

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Valid name is required (min 2 chars).' }, { status: 400 });
    }

    if (!cleanFeedback || cleanFeedback.length < 5) {
      return NextResponse.json({ error: 'Valid feedback is required (min 5 chars, max 500).' }, { status: 400 });
    }

    const avatarInitial = cleanName.charAt(0).toUpperCase() || 'U';

    await connectToDatabase();

    const newTestimonial = await Testimonial.create({
      name: cleanName,
      avatar: avatarInitial,
      role: cleanRole,
      feedback: cleanFeedback,
      userEmail: session.user.email || '',
    });

    return NextResponse.json({ success: true, testimonial: newTestimonial }, { status: 201 });
  } catch (error) {
    console.error('Failed to submit testimonial:', error);
    return NextResponse.json({ error: 'Failed to submit testimonial.' }, { status: 500 });
  }
}
