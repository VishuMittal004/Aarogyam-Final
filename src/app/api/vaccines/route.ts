import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const vaccines = await db
      .collection('vaccines')
      .find({})
      .sort({ order: 1 })
      .toArray();

    const formatted = vaccines.map((vaccine) => ({
      id: vaccine._id.toString(),
      name: vaccine.name,
      disease: vaccine.disease,
      schedule: vaccine.schedule,
      purpose: vaccine.purpose,
      ageGroup: vaccine.ageGroup || '',
      sideEffects: vaccine.sideEffects || '',
      importance: vaccine.importance || 'recommended',
    }));

    return NextResponse.json({ vaccines: formatted });
  } catch (error) {
    console.error('Get vaccines error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
