import { NextResponse } from 'next/server';
import axios from 'axios';
import { sanitizeText } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const formKey = process.env.FORM_KEY || process.env.NEXT_PUBLIC_FORM_KEY;
    if (!formKey) {
      return NextResponse.json(
        { error: 'Contact form service is not configured. Please email shinkhalsinha@gmail.com directly.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { name, email, subject, message } = body || {};

    const cleanName = sanitizeText(name).slice(0, 100);
    const cleanEmail = sanitizeText(email).slice(0, 100);
    const cleanSubject = sanitizeText(subject || 'MovieQuest Inquiry').slice(0, 200);
    const cleanMessage = sanitizeText(message).slice(0, 2000);

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Valid name is required.' }, { status: 400 });
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      return NextResponse.json({ error: 'Message must be at least 5 characters.' }, { status: 400 });
    }

    const response = await axios.post('https://api.web3forms.com/submit', {
      access_key: formKey,
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.data?.success) {
      return NextResponse.json({ success: true, message: 'Your message has been sent successfully!' });
    }

    return NextResponse.json(
      { error: response.data?.message || 'Failed to send message. Please email shinkhalsinha@gmail.com directly.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Contact form submission error:', error?.response?.data || error);
    return NextResponse.json(
      { error: 'Failed to deliver message. Please reach out directly to shinkhalsinha@gmail.com' },
      { status: 500 }
    );
  }
}
