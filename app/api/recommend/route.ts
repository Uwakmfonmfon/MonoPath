import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { analyzeUserStats } from '@/lib/recommendation-engine';

export async function GET() {
  try {
    // Mock user ID
    const userId = 'user_1';
    const user = await db.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const recommendations = analyzeUserStats(user);

    return NextResponse.json({
      userId,
      recommendations
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
