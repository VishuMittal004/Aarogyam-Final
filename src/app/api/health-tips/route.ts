import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const tips = await db
      .collection('health_tips')
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    const formatted = tips.map((tip) => ({
      id: tip._id.toString(),
      title: tip.title,
      content: tip.content,
      category: tip.category,
      icon: tip.icon || '💡',
      createdAt: tip.createdAt,
    }));

    return NextResponse.json({ tips: formatted });
  } catch (error) {
    console.error('Get health tips error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
