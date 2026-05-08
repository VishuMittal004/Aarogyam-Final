import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ history: [] });
    }

    const db = await getDb();
    const history = await db
      .collection('chat_history')
      .find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const formatted = history.map((msg) => ({
      id: msg._id.toString(),
      role: msg.role,
      content: msg.content,
      language: msg.language,
      createdAt: msg.createdAt,
    }));

    return NextResponse.json({ history: formatted });
  } catch (error) {
    console.error('Get chat history error:', error);
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
    const { messages, language } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const docs = messages.map((msg: { role: string; content: string }) => ({
      userId: session?.userId || 'anonymous',
      role: msg.role,
      content: msg.content,
      language: language || 'english',
      createdAt: new Date(),
    }));

    await db.collection('chat_history').insertMany(docs);

    // Update AI interactions count
    await db.collection('dashboard_stats').updateOne(
      { key: 'global' },
      {
        $inc: {
          totalAIInteractions: messages.length,
          dailyInteractions: messages.length,
        },
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Chat history saved' }, { status: 201 });
  } catch (error) {
    console.error('Save chat history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
