import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const dailyLogsFilePath = path.join(process.cwd(), 'data', 'daily_logs.json');

function readDailyLogsFile(): Record<string, any[]> {
  try {
    if (fs.existsSync(dailyLogsFilePath)) {
      const content = fs.readFileSync(dailyLogsFilePath, 'utf8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.error('Error reading daily_logs.json:', err);
  }
  return {};
}

function writeDailyLogsFile(data: Record<string, any[]>) {
  try {
    const dir = path.dirname(dailyLogsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dailyLogsFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing daily_logs.json:', err);
  }
}

// GET: fetch daily logs history for a child or user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId') || 'default';
    const userId = searchParams.get('userId');

    const logsMap = readDailyLogsFile();
    const key = childId || (userId ? `user_${userId}` : 'default');
    const childLogs = logsMap[key] || logsMap['default'] || [];

    // Optional Supabase query fallback
    if (supabase && childId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(childId)) {
      try {
        const { data: dbLogs } = await supabase
          .from('daily_logs')
          .select('*')
          .eq('child_id', childId)
          .order('date', { ascending: false })
          .limit(30);

        if (dbLogs && dbLogs.length > 0) {
          return NextResponse.json({ logs: dbLogs, count: dbLogs.length });
        }
      } catch (e) {
        // Fall back to file logs
      }
    }

    return NextResponse.json({ logs: childLogs, count: childLogs.length });
  } catch (err: any) {
    console.error('GET /api/daily-logs error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

// POST: save or update daily log entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { childId, userId, log } = body;

    if (!log || !log.date) {
      return NextResponse.json({ error: 'Valid log data with date is required' }, { status: 400 });
    }

    const logsMap = readDailyLogsFile();
    const key = childId || (userId ? `user_${userId}` : 'default');
    const existingList = logsMap[key] || [];

    // Filter out existing record for this date to update idempotently
    const updatedList = existingList.filter((item: any) => item.date !== log.date);
    const newRecord = {
      ...log,
      childId: childId || 'default',
      userId: userId || null,
      savedAt: new Date().toISOString(),
    };
    updatedList.unshift(newRecord);
    logsMap[key] = updatedList;

    // Also mirror to 'default' if custom child key
    if (key !== 'default') {
      const defExisting = (logsMap['default'] || []).filter((item: any) => item.date !== log.date);
      defExisting.unshift(newRecord);
      logsMap['default'] = defExisting;
    }

    writeDailyLogsFile(logsMap);

    // Sync to Supabase if configured and valid UUID
    if (supabase) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(childId);
        if (isUuid) {
          await supabase.from('daily_logs').upsert({
            child_id: childId,
            date: log.date,
            brushed: Boolean(log.brushedMorning || log.brushedNight),
            fluoridated_toothpaste: true,
            assistance_level: log.brushesIndependently ? 'independent' : 'partial',
            tolerance: log.showResistanceOrCrying ? 'poor' : 'good',
            brushing_resistance: log.showResistanceOrCrying ? 'high' : 'low',
            meals_count: (log.healthyBreakfast ? 1 : 0) + (log.healthyLunch ? 1 : 0) + (log.healthyDinner ? 1 : 0),
            snacks_count: log.consumedSnacksBetweenMeals ? 2 : 0,
            sugary_snacks_count: (log.consumedSugarySnacksDrinks ? 1 : 0) + (log.consumedStickyFood ? 1 : 0),
            water_intake: log.drankSufficientWater ? 'good' : 'poor',
          }, { onConflict: 'child_id,date' });
        }
      } catch (dbErr) {
        console.warn('Supabase daily log sync skipped (using file store):', dbErr);
      }
    }

    return NextResponse.json({ success: true, log: newRecord });
  } catch (err: any) {
    console.error('POST /api/daily-logs error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save daily log' }, { status: 500 });
  }
}
