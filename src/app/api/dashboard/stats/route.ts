import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();

    // Get or create dashboard stats
    let stats = await db.collection('dashboard_stats').findOne({ key: 'global' });

    if (!stats) {
      // Initialize stats
      await db.collection('dashboard_stats').insertOne({
        key: 'global',
        totalConsultations: 24,
        totalAIInteractions: 156,
        totalSymptomChecks: 89,
        totalHealthInsights: 42,
        weeklyConsultations: 3,
        dailyInteractions: 12,
        updatedAt: new Date(),
      });
      stats = await db.collection('dashboard_stats').findOne({ key: 'global' });
    }

    // Get recent health records count
    const recentRecords = await db.collection('health_records').countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Get total users
    const totalUsers = await db.collection('users').countDocuments();

    // Get active alerts count
    const activeAlerts = await db.collection('alerts').countDocuments({ isActive: true });

    return NextResponse.json({
      stats: {
        consultations: {
          value: stats?.totalConsultations || 24,
          change: `+${stats?.weeklyConsultations || 3} this week`,
        },
        aiInteractions: {
          value: stats?.totalAIInteractions || 156,
          change: `+${stats?.dailyInteractions || 12} today`,
        },
        symptomChecks: {
          value: stats?.totalSymptomChecks || 89,
          change: 'Active monitoring',
        },
        healthInsights: {
          value: stats?.totalHealthInsights || 42,
          change: '+5 new insights',
        },
        totalUsers,
        activeAlerts,
        recentRecords,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
