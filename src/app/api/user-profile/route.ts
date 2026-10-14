import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const dataFilePath = path.join(process.cwd(), 'data', 'profiles.json');

function readProfilesFile(): Record<string, any> {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.error('Error reading profiles.json:', err);
  }
  return {};
}

function writeProfilesFile(data: Record<string, any>) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing profiles.json:', err);
  }
}

// GET: fetch a specific user's child profile OR all profiles (for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const getAll = searchParams.get('all') === 'true';

    const profiles = readProfilesFile();

    if (getAll) {
      const allList = Object.values(profiles);
      return NextResponse.json({ profiles: allList, count: allList.length });
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const userProfile = profiles[userId] || null;

    // Optional Supabase lookup as secondary source
    if (!userProfile && supabase) {
      try {
        const { data: dbChild } = await supabase
          .from('children')
          .select('*, caregivers(*)')
          .eq('caregiver_id', userId)
          .single();
        if (dbChild) {
          return NextResponse.json({ profile: dbChild });
        }
      } catch (e) {
        // Fallback to local
      }
    }

    return NextResponse.json({ profile: userProfile });
  } catch (err: any) {
    console.error('GET /api/user-profile error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

// POST: store/update child questionnaire profile for a specific user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userEmail, profile } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const profiles = readProfilesFile();

    const record = {
      userId,
      userEmail: userEmail || '',
      updatedAt: new Date().toISOString(),
      profile: {
        ...profile,
        userId,
      },
    };

    profiles[userId] = record;
    writeProfilesFile(profiles);

    // Supabase persistence
    if (supabase) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
        
        let caregiverDbId: string | null = null;

        if (isUuid) {
          const { data: cData, error: cErr } = await supabase.from('caregivers').upsert({
            id: userId,
            email: userEmail || `user-${userId}@asd-oralcare.org`,
            name: profile?.caregiverName || profile?.demographics?.caregiverName || 'Caregiver',
          }).select('id').single();

          if (!cErr && cData) {
            caregiverDbId = cData.id;
          }
        } else {
          // For demo or custom user ID, upsert by email
          const safeEmail = userEmail || `user-${userId.replace(/[^a-zA-Z0-9]/g, '')}@asd-oralcare.org`;
          const { data: existing } = await supabase.from('caregivers').select('id').eq('email', safeEmail).single();
          
          if (existing?.id) {
            caregiverDbId = existing.id;
          } else {
            const { data: inserted } = await supabase.from('caregivers').insert({
              email: safeEmail,
              name: profile?.caregiverName || profile?.demographics?.caregiverName || 'Caregiver',
            }).select('id').single();
            if (inserted) caregiverDbId = inserted.id;
          }
        }

        if (caregiverDbId) {
          await supabase.from('children').upsert({
            caregiver_id: caregiverDbId,
            name: profile?.name || profile?.demographics?.childName || 'Child',
            age: Number(profile?.age || profile?.demographics?.age) || 6,
            gender: profile?.gender || profile?.demographics?.gender || 'Not specified',
            participant_code: profile?.code || `ASD-${userId.slice(-4).toUpperCase()}`,
            communication_level: profile?.communicationLevel || profile?.demographics?.communicationStyle || 'verbal',
            support_level: profile?.asdLevel || 'Level 1',
            food_selectivity: profile?.dietaryHabits?.foodHoldingInMouth ? 'moderate' : 'low',
            sensory_profile: {
              triggers: profile?.childBehaviour?.sensoryAversionTriggers || profile?.sensorySensitivities || [],
              details: profile?.rawQuestionnaire || {},
            },
            toothbrush_type: profile?.brushingHabits?.toothbrushType || 'Manual',
          });
        }
      } catch (dbErr) {
        console.warn('Supabase sync skipped/failed (using persistent file store):', dbErr);
      }
    }

    return NextResponse.json({ success: true, profile: record.profile });
  } catch (err: any) {
    console.error('POST /api/user-profile error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save profile' }, { status: 500 });
  }
}
