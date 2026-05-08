import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const hospitals = await db
      .collection('emergency_services')
      .find({})
      .sort({ name: 1 })
      .toArray();

    const formatted = hospitals.map((h) => ({
      id: h._id.toString(),
      name: h.name,
      type: h.type,
      address: h.address,
      phone: h.phone,
      emergency: h.emergency || '',
      specialties: h.specialties || [],
      rating: h.rating || 0,
      distance: h.distance || '',
      openHours: h.openHours || '24/7',
    }));

    return NextResponse.json({ services: formatted });
  } catch (error) {
    console.error('Get emergency services error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
