import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const vaccineData = [
  {
    name: 'BCG (Bacillus Calmette-Guerin)',
    disease: 'Tuberculosis (TB)',
    schedule: 'At birth or as early as possible till 1 year of age.',
    purpose: 'Protects against severe forms of tuberculosis, especially in children.',
    ageGroup: 'Birth - 1 year',
    sideEffects: 'Small red bump at injection site, mild fever. Usually resolves within weeks.',
    importance: 'essential',
    order: 1,
  },
  {
    name: 'OPV (Oral Polio Vaccine)',
    disease: 'Poliomyelitis',
    schedule: 'Birth dose, then at 6, 10, and 14 weeks. Booster at 16-24 months.',
    purpose: 'Prevents polio, a disabling and life-threatening disease.',
    ageGroup: 'Birth - 24 months',
    sideEffects: 'Very rare. Occasional mild diarrhea.',
    importance: 'essential',
    order: 2,
  },
  {
    name: 'Hepatitis B Vaccine',
    disease: 'Hepatitis B',
    schedule: 'Birth dose (within 24 hours), then at 6 and 14 weeks.',
    purpose: 'Prevents Hepatitis B virus infection which can cause chronic liver disease and liver cancer.',
    ageGroup: 'Birth onwards',
    sideEffects: 'Soreness at injection site, mild fever.',
    importance: 'essential',
    order: 3,
  },
  {
    name: 'Pentavalent Vaccine (DPT + HepB + Hib)',
    disease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, and Haemophilus influenzae type b (Hib)',
    schedule: 'Three doses at 6, 10, and 14 weeks of age.',
    purpose: 'A combination vaccine that protects against five major childhood diseases in a single shot.',
    ageGroup: '6 weeks - 14 weeks',
    sideEffects: 'Mild fever, irritability, soreness at injection site. Rarely, high fever.',
    importance: 'essential',
    order: 4,
  },
  {
    name: 'Rotavirus Vaccine',
    disease: 'Rotavirus Diarrhea',
    schedule: 'Three doses at 6, 10, and 14 weeks of age.',
    purpose: 'Prevents severe diarrhea caused by rotavirus, which is a leading cause of death in children under 5.',
    ageGroup: '6 weeks - 14 weeks',
    sideEffects: 'Mild, temporary diarrhea or vomiting.',
    importance: 'essential',
    order: 5,
  },
  {
    name: 'IPV (Inactivated Polio Vaccine)',
    disease: 'Poliomyelitis',
    schedule: 'Two fractional doses at 6 and 14 weeks of age.',
    purpose: 'Provides additional protection against polio, used alongside OPV.',
    ageGroup: '6 weeks - 14 weeks',
    sideEffects: 'Redness or swelling at injection site.',
    importance: 'essential',
    order: 6,
  },
  {
    name: 'PCV (Pneumococcal Conjugate Vaccine)',
    disease: 'Pneumococcal Disease (Pneumonia, Meningitis)',
    schedule: 'Two doses at 6 and 14 weeks, booster at 9 months.',
    purpose: 'Protects against pneumococcal bacteria, a major cause of pneumonia and meningitis in children.',
    ageGroup: '6 weeks - 9 months',
    sideEffects: 'Mild fever, redness at injection site, fussiness.',
    importance: 'essential',
    order: 7,
  },
  {
    name: 'Measles-Rubella (MR) Vaccine',
    disease: 'Measles and Rubella',
    schedule: 'First dose at 9-12 months, second dose at 16-24 months.',
    purpose: 'Protects against measles (which can be fatal) and rubella (which causes birth defects).',
    ageGroup: '9 months - 24 months',
    sideEffects: 'Mild fever, rash. Very rarely, febrile seizures.',
    importance: 'essential',
    order: 8,
  },
  {
    name: 'JE (Japanese Encephalitis) Vaccine',
    disease: 'Japanese Encephalitis',
    schedule: 'Two doses: first at 9-12 months, second at 16-24 months.',
    purpose: 'Prevents Japanese Encephalitis, a serious brain infection spread by mosquitoes, prevalent in endemic districts.',
    ageGroup: '9 months - 24 months',
    sideEffects: 'Mild pain at injection site, low-grade fever.',
    importance: 'recommended',
    order: 9,
  },
  {
    name: 'DPT Booster',
    disease: 'Diphtheria, Pertussis, Tetanus',
    schedule: 'First booster at 16-24 months, second booster at 5-6 years.',
    purpose: 'Booster doses to maintain protection against diphtheria, pertussis (whooping cough), and tetanus.',
    ageGroup: '16 months - 6 years',
    sideEffects: 'Soreness at injection site, mild fever, temporary swelling.',
    importance: 'essential',
    order: 10,
  },
  {
    name: 'Vitamin A Supplementation',
    disease: 'Vitamin A Deficiency',
    schedule: 'First dose at 9 months with measles vaccine. Then every 6 months until age 5.',
    purpose: 'Prevents blindness and boosts immune function. Critical for child survival in developing countries.',
    ageGroup: '9 months - 5 years',
    sideEffects: 'Very rare. Occasional nausea if taken in excess.',
    importance: 'essential',
    order: 11,
  },
  {
    name: 'TT (Tetanus Toxoid)',
    disease: 'Tetanus',
    schedule: 'At 10 years and 16 years. For pregnant women: 2 doses during first pregnancy.',
    purpose: 'Prevents tetanus, a potentially fatal disease caused by bacteria entering through wounds.',
    ageGroup: '10 years onwards',
    sideEffects: 'Pain and swelling at injection site.',
    importance: 'essential',
    order: 12,
  },
  {
    name: 'Hepatitis A Vaccine',
    disease: 'Hepatitis A',
    schedule: 'Two doses, given at least 6 months apart, starting at age 1.',
    purpose: 'Protects against Hepatitis A, a liver infection caused by contaminated food and water.',
    ageGroup: '1 year onwards',
    sideEffects: 'Soreness at injection site, mild headache, low fever.',
    importance: 'recommended',
    order: 13,
  },
  {
    name: 'Typhoid Vaccine',
    disease: 'Typhoid Fever',
    schedule: 'One dose at 2 years, with a booster every 2-3 years for those in high-risk areas.',
    purpose: 'Helps prevent typhoid fever, a bacterial infection spread through contaminated food and water.',
    ageGroup: '2 years onwards',
    sideEffects: 'Pain at injection site, mild fever, headache.',
    importance: 'recommended',
    order: 14,
  },
  {
    name: 'Tdap (Tetanus, Diphtheria, Pertussis)',
    disease: 'Tetanus, Diphtheria, and Whooping Cough (Pertussis)',
    schedule: 'Recommended for adolescents (age 11-12) and adults, and during each pregnancy.',
    purpose: 'A booster vaccine to maintain protection against tetanus, diphtheria, and pertussis.',
    ageGroup: '11 years onwards',
    sideEffects: 'Pain at injection site, mild fever, body aches.',
    importance: 'recommended',
    order: 15,
  },
  {
    name: 'HPV (Human Papillomavirus) Vaccine',
    disease: 'Cervical Cancer, Genital Warts',
    schedule: 'Two or three doses between ages 9-14 (two doses) or 15-26 (three doses).',
    purpose: 'Prevents HPV infections that can lead to cervical cancer and other cancers.',
    ageGroup: '9-26 years',
    sideEffects: 'Pain at injection site, mild headache, dizziness.',
    importance: 'recommended',
    order: 16,
  },
  {
    name: 'COVID-19 Vaccine',
    disease: 'Coronavirus Disease 2019',
    schedule: 'Varies by vaccine type and age group. Typically includes a primary series and booster doses.',
    purpose: 'Reduces the risk of severe illness, hospitalization, and death from COVID-19.',
    ageGroup: '12 years onwards',
    sideEffects: 'Pain at injection site, fatigue, headache, muscle pain, fever. Usually resolve in 1-2 days.',
    importance: 'recommended',
    order: 17,
  },
  {
    name: 'Influenza (Flu) Vaccine',
    disease: 'Seasonal Influenza',
    schedule: 'Annual vaccination recommended, especially before flu season.',
    purpose: 'Reduces risk of flu illness and severe complications. Especially important for elderly and children.',
    ageGroup: '6 months onwards',
    sideEffects: 'Soreness at injection site, low-grade fever, body aches for 1-2 days.',
    importance: 'optional',
    order: 18,
  },
];

const alertData = [
  {
    title: 'Dengue Outbreak Warning',
    date: 'May 5, 2026',
    location: 'Mumbai, Maharashtra',
    content: 'Increased cases of Dengue fever reported across Mumbai and surrounding areas. Take precautions against mosquito bites. Eliminate stagnant water, use mosquito nets, and apply repellent. Seek medical attention if you experience high fever, severe headache, or joint pain.',
    severity: 'high',
    category: 'outbreak',
    isActive: true,
  },
  {
    title: 'Heatwave Advisory - Extreme Temperatures Expected',
    date: 'May 3, 2026',
    location: 'Delhi NCR, Rajasthan, Uttar Pradesh',
    content: 'Severe heatwave conditions predicted for the next 5 days with temperatures exceeding 45°C. Stay hydrated with ORS and water. Avoid direct sun exposure between 11 AM and 4 PM. Watch for signs of heatstroke: dizziness, nausea, rapid heartbeat. Seek immediate medical help if symptoms appear.',
    severity: 'critical',
    category: 'weather',
    isActive: true,
  },
  {
    title: 'Cholera Cases Reported in Flood-Affected Areas',
    date: 'May 1, 2026',
    location: 'Kolkata, West Bengal',
    content: 'Multiple cases of Cholera identified in flood-affected areas. Drink only boiled or purified water. Avoid raw food and street food. Wash hands thoroughly before eating. Report any cases of severe diarrhea to the nearest health center immediately.',
    severity: 'high',
    category: 'outbreak',
    isActive: true,
  },
  {
    title: 'Free Vaccination Camp - MMR & Polio Boosters',
    date: 'May 8, 2026',
    location: 'All Primary Health Centers, India',
    content: 'National vaccination drive for MMR and Polio boosters. All children aged 9 months to 5 years are eligible. Visit your nearest Primary Health Center (PHC) or Anganwadi center. Carry your child\'s vaccination card. Vaccines are completely free of charge.',
    severity: 'info',
    category: 'vaccination',
    isActive: true,
  },
  {
    title: 'Malaria Prevention During Monsoon Season',
    date: 'April 28, 2026',
    location: 'Odisha, Chhattisgarh, Jharkhand',
    content: 'Monsoon season increases malaria risk. Use insecticide-treated bed nets. Clear stagnant water from around your home. If you experience fever with chills, get tested for malaria at your nearest health facility. Free testing and treatment available at government hospitals.',
    severity: 'medium',
    category: 'seasonal',
    isActive: true,
  },
  {
    title: 'Air Quality Alert - Hazardous Levels',
    date: 'April 25, 2026',
    location: 'Delhi, Haryana, Punjab',
    content: 'AQI levels have crossed 400 (Severe category) in several areas. Avoid outdoor activities, especially exercise. Use N95 masks when going outside. Keep windows and doors closed. Use air purifiers if available. People with asthma and respiratory conditions should keep inhalers handy.',
    severity: 'high',
    category: 'environmental',
    isActive: true,
  },
  {
    title: 'Diarrhea Prevention Advisory',
    date: 'April 22, 2026',
    location: 'Bihar, Jharkhand, Assam',
    content: 'Rising cases of acute diarrhea in rural areas. Ensure safe drinking water — boil or use chlorine tablets. Use ORS (Oral Rehydration Solution) at first signs of diarrhea. Zinc supplements are available free at PHCs for children. Practice hand washing with soap before meals.',
    severity: 'medium',
    category: 'outbreak',
    isActive: true,
  },
  {
    title: 'COVID-19 Booster Dose Available',
    date: 'April 20, 2026',
    location: 'All India',
    content: 'Updated COVID-19 booster doses are now available for all adults at government and private hospitals. Especially recommended for elderly, healthcare workers, and people with comorbidities. Free at government centers. Visit CoWIN portal or walk into your nearest vaccination center.',
    severity: 'info',
    category: 'vaccination',
    isActive: true,
  },
];

const emergencyServicesData = [
  {
    name: 'AIIMS (All India Institute of Medical Sciences)',
    type: 'Government Hospital',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi - 110029',
    phone: '011-26588500',
    emergency: '011-26588700',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Trauma', 'Pediatrics', 'Emergency Medicine'],
    rating: 4.5,
    distance: '5.2 km',
    openHours: '24/7',
  },
  {
    name: 'Safdarjung Hospital',
    type: 'Government Hospital',
    address: 'Ansari Nagar West, New Delhi - 110029',
    phone: '011-26707437',
    emergency: '011-26730000',
    specialties: ['Emergency Medicine', 'Surgery', 'Orthopedics', 'Gynecology', 'Pediatrics'],
    rating: 4.0,
    distance: '4.8 km',
    openHours: '24/7',
  },
  {
    name: 'Ram Manohar Lohia Hospital',
    type: 'Government Hospital',
    address: 'Baba Kharak Singh Marg, New Delhi - 110001',
    phone: '011-23365525',
    emergency: '011-23404346',
    specialties: ['Emergency Medicine', 'General Medicine', 'Surgery', 'ENT', 'Ophthalmology'],
    rating: 3.8,
    distance: '3.1 km',
    openHours: '24/7',
  },
  {
    name: 'Apollo Hospital',
    type: 'Private Hospital',
    address: 'Sarita Vihar, Delhi-Mathura Road, New Delhi - 110076',
    phone: '011-71791090',
    emergency: '011-26825858',
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Transplants', 'Robotic Surgery'],
    rating: 4.6,
    distance: '12.5 km',
    openHours: '24/7',
  },
  {
    name: 'Max Super Speciality Hospital',
    type: 'Private Hospital',
    address: '1, 2, Press Enclave Road, Saket, New Delhi - 110017',
    phone: '011-26515050',
    emergency: '011-26515050',
    specialties: ['Cardiology', 'Oncology', 'Neurosciences', 'Orthopedics', 'Liver Transplant'],
    rating: 4.4,
    distance: '8.3 km',
    openHours: '24/7',
  },
  {
    name: 'Primary Health Center (PHC) - Model',
    type: 'Primary Health Center',
    address: 'Village Health Center, Various Locations',
    phone: '1800-180-1104 (Toll Free)',
    emergency: '108 (Ambulance)',
    specialties: ['General Medicine', 'Maternal Health', 'Child Health', 'Immunization', 'First Aid'],
    rating: 3.5,
    distance: '1.5 km',
    openHours: '8:00 AM - 8:00 PM',
  },
  {
    name: 'Community Health Center (CHC)',
    type: 'Community Health Center',
    address: 'Block Level Health Center, Various Locations',
    phone: '1800-180-1104 (Toll Free)',
    emergency: '108 (Ambulance)',
    specialties: ['General Medicine', 'Surgery', 'Gynecology', 'Pediatrics', 'Dental'],
    rating: 3.7,
    distance: '5.0 km',
    openHours: '24/7',
  },
];

const healthTipsData = [
  {
    title: 'Stay Hydrated This Summer',
    content: 'Drink at least 8-10 glasses of water daily. Add lemon, cucumber, or mint for flavor. Avoid sugary drinks and excessive tea/coffee as they can dehydrate you.',
    category: 'nutrition',
    icon: '💧',
    createdAt: new Date(),
  },
  {
    title: 'Wash Hands Properly',
    content: 'Wash your hands with soap for at least 20 seconds before eating, after using the toilet, and after touching surfaces. This simple habit prevents 80% of common infections.',
    category: 'hygiene',
    icon: '🧼',
    createdAt: new Date(),
  },
  {
    title: 'Walk 30 Minutes Daily',
    content: 'A daily 30-minute walk reduces risk of heart disease by 35%, diabetes by 40%, and improves mental health. Walk briskly in the morning or evening for best results.',
    category: 'exercise',
    icon: '🚶',
    createdAt: new Date(),
  },
  {
    title: 'Eat Seasonal Fruits & Vegetables',
    content: 'Seasonal produce is more nutritious and affordable. Include green leafy vegetables, local fruits, and whole grains in every meal for balanced nutrition.',
    category: 'nutrition',
    icon: '🥗',
    createdAt: new Date(),
  },
  {
    title: 'Protect Against Mosquitoes',
    content: 'Use mosquito nets while sleeping, apply natural repellents like neem oil, and eliminate stagnant water around your home. This prevents dengue, malaria, and chikungunya.',
    category: 'seasonal',
    icon: '🦟',
    createdAt: new Date(),
  },
  {
    title: 'Mental Health Matters',
    content: 'Take 10 minutes daily for deep breathing or meditation. Talk to family or friends about your worries. Adequate sleep (7-8 hours) is essential for mental well-being.',
    category: 'mental-health',
    icon: '🧠',
    createdAt: new Date(),
  },
  {
    title: 'Keep Your Child\'s Vaccination Up to Date',
    content: 'Follow the National Immunization Schedule. Missed a dose? Visit your nearest PHC — catch-up vaccination is available for free. Vaccines protect your child from 12+ serious diseases.',
    category: 'general',
    icon: '💉',
    createdAt: new Date(),
  },
  {
    title: 'Safe Drinking Water',
    content: 'Always boil water for at least 1 minute before drinking if you\'re unsure of its purity. Store boiled water in clean, covered containers. This prevents cholera, typhoid, and diarrhea.',
    category: 'hygiene',
    icon: '🚰',
    createdAt: new Date(),
  },
  {
    title: 'Manage Diabetes Naturally',
    content: 'Include bitter gourd (karela), fenugreek (methi), and whole grains in your diet. Exercise regularly and monitor blood sugar levels. Reduce sugar and refined carbs.',
    category: 'nutrition',
    icon: '🩺',
    createdAt: new Date(),
  },
  {
    title: 'Yoga for Better Health',
    content: 'Practice Surya Namaskar (Sun Salutation) for 15 minutes daily. It improves flexibility, strengthens muscles, and boosts immunity. Start with 5 rounds and gradually increase.',
    category: 'exercise',
    icon: '🧘',
    createdAt: new Date(),
  },
  {
    title: 'Oral Hygiene is Health Hygiene',
    content: 'Brush teeth twice daily with fluoride toothpaste. Replace your toothbrush every 3 months. Poor oral health is linked to heart disease and diabetes.',
    category: 'hygiene',
    icon: '🦷',
    createdAt: new Date(),
  },
  {
    title: 'Iron-Rich Foods for Anemia Prevention',
    content: 'Eat iron-rich foods like spinach, jaggery (gur), dates, and ragi. Combine with vitamin C sources like lemon or amla for better absorption. Anemia is common but preventable.',
    category: 'nutrition',
    icon: '🫀',
    createdAt: new Date(),
  },
];

const dashboardStatsData = {
  key: 'global',
  totalConsultations: 248,
  totalAIInteractions: 1567,
  totalSymptomChecks: 892,
  totalHealthInsights: 423,
  weeklyConsultations: 34,
  dailyInteractions: 67,
  updatedAt: new Date(),
};

export async function POST() {
  try {
    const db = await getDb();

    // Seed vaccines
    const existingVaccines = await db.collection('vaccines').countDocuments();
    if (existingVaccines === 0) {
      await db.collection('vaccines').insertMany(vaccineData);
    }

    // Seed alerts
    const existingAlerts = await db.collection('alerts').countDocuments();
    if (existingAlerts === 0) {
      await db.collection('alerts').insertMany(
        alertData.map((a) => ({ ...a, createdAt: new Date() }))
      );
    }

    // Seed emergency services
    const existingServices = await db.collection('emergency_services').countDocuments();
    if (existingServices === 0) {
      await db.collection('emergency_services').insertMany(
        emergencyServicesData.map((s) => ({ ...s, createdAt: new Date() }))
      );
    }

    // Seed health tips
    const existingTips = await db.collection('health_tips').countDocuments();
    if (existingTips === 0) {
      await db.collection('health_tips').insertMany(healthTipsData);
    }

    // Seed dashboard stats
    const existingStats = await db.collection('dashboard_stats').countDocuments();
    if (existingStats === 0) {
      await db.collection('dashboard_stats').insertOne(dashboardStatsData);
    }

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('alerts').createIndex({ date: -1 });
    await db.collection('alerts').createIndex({ severity: 1 });
    await db.collection('vaccines').createIndex({ order: 1 });
    await db.collection('health_records').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('chat_history').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('health_tips').createIndex({ category: 1 });

    return NextResponse.json({
      message: 'Database seeded successfully',
      seeded: {
        vaccines: existingVaccines === 0 ? vaccineData.length : 'already exists',
        alerts: existingAlerts === 0 ? alertData.length : 'already exists',
        emergencyServices: existingServices === 0 ? emergencyServicesData.length : 'already exists',
        healthTips: existingTips === 0 ? healthTipsData.length : 'already exists',
        dashboardStats: existingStats === 0 ? 'created' : 'already exists',
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    );
  }
}
