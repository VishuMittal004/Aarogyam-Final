import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const alerts = await db
      .collection('alerts')
      .find({})
      .sort({ date: -1, severity: -1 })
      .toArray();

    const formatted = alerts.map((alert) => ({
      id: alert._id.toString(),
      title: alert.title,
      date: alert.date,
      location: alert.location,
      content: alert.content,
      severity: alert.severity || 'info',
      category: alert.category || 'general',
      isActive: alert.isActive !== false,
    }));

    return NextResponse.json({ alerts: formatted });
  } catch (error) {
    console.error('Get alerts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, date, location, content, severity, category } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection('alerts').insertOne({
      title,
      date: date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      location: location || 'India',
      content,
      severity: severity || 'info',
      category: category || 'general',
      isActive: true,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Alert created', id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create alert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
