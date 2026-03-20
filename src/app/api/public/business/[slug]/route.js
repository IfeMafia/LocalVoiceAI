import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    // Fetch public business data by slug
    // We only select public-facing fields and AI context fields
    const result = await db.query(
      `SELECT id, name, slug, description, category, assistant_tone, assistant_instructions, ai_summary, logo_url, is_live 
       FROM businesses 
       WHERE slug = $1`,
      [slug]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }

    const business = result.rows[0];

    // Optional: Check if the business has enabled public chat
    // For now, if it's live, it's chat-ready
    if (!business.is_live) {
      // In a real staging environment, we might want to allow this for testing
      // For now, let's keep it open for development
    }

    return NextResponse.json({ success: true, business });
  } catch (error) {
    console.error('Public Business Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
