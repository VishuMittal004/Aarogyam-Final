import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    const db = await getDb();

    let query = {};
    if (session) {
      query = { userId: session.userId };
    }

    const records = await db
      .collection('health_records')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const formatted = records.map((record) => ({
      id: record._id.toString(),
      symptoms: record.symptoms,
      possibleConditions: record.possibleConditions,
      recommendedActions: record.recommendedActions,
      severity: record.severity || 'moderate',
      createdAt: record.createdAt,
    }));

    return NextResponse.json({ records: formatted });
  } catch (error) {
    console.error('Get health records error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { symptoms, possibleConditions, recommendedActions } = body;

    if (!symptoms) {
      return NextResponse.json(
        { error: 'Symptoms are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection('health_records').insertOne({
      userId: session?.userId || 'anonymous',
      symptoms,
      possibleConditions: possibleConditions || '',
      recommendedActions: recommendedActions || '',
      severity: body.severity || 'moderate',
      createdAt: new Date(),
    });

    // Update dashboard stats
    await db.collection('dashboard_stats').updateOne(
      { key: 'global' },
      {
        $inc: {
          totalSymptomChecks: 1,
          totalConsultations: 1,
        },
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { message: 'Health record saved', id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create health record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
