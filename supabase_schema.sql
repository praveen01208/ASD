-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Caregivers Table
create table caregivers (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Children Table
create table children (
  id uuid primary key default uuid_generate_v4(),
  caregiver_id uuid references caregivers(id) on delete cascade,
  name text not null,
  age integer not null,
  gender text,
  participant_code text unique not null, -- e.g., ASD-001
  communication_level text not null, -- verbal, nonverbal, limited
  support_level text,
  motor_difficulty text, -- mild, moderate, severe
  sensory_profile jsonb not null default '{"taste": "low", "touch": "low", "sound": "low", "visual": "low"}'::jsonb,
  food_selectivity text not null, -- low, moderate, high
  preferred_texture text,
  reinforcement_type text,
  toothbrush_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Daily Logs Table
create table daily_logs (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade,
  date date not null,
  
  -- Brushing
  brushed boolean not null default false,
  brush_duration_seconds integer default 0,
  fluoridated_toothpaste boolean default false,
  assistance_level text, -- full, partial, independent
  tolerance text, -- poor, fair, good
  brushing_resistance text, -- low, moderate, high
  sensory_difficulty text, -- low, moderate, high
  prompting_level text, -- low, moderate, high
  
  -- Diet
  meals_count integer default 0,
  snacks_count integer default 0,
  sugary_snacks_count integer default 0,
  sugary_drinks_count integer default 0,
  water_intake text, -- poor, fair, good
  food_refusal_episodes integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (child_id, date)
);

-- AI Assessments Table
create table ai_assessments (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade,
  date date not null,
  
  oral_hygiene_score integer not null, -- 0-100
  dietary_risk_score integer not null, -- 0-100
  sensory_difficulty_score integer not null, -- 0-100
  independence_score integer not null, -- 0-100
  priorities jsonb not null default '[]'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (child_id, date)
);

-- Care Plans Table
create table care_plans (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade,
  date date not null,
  
  oral_intervention jsonb not null, -- { target, reason, steps }
  dietary_intervention jsonb not null, -- { target, suggestion }
  status text default 'active',
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat Messages Table
create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade,
  role text not null, -- 'user' or 'assistant'
  content text not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clinical Visits Table
create table clinical_visits (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade,
  date date not null,
  
  plaque_index numeric,
  gingival_index numeric,
  dmft_score integer,
  notes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup basic Row Level Security (RLS)
alter table caregivers enable row level security;
alter table children enable row level security;
alter table daily_logs enable row level security;
alter table ai_assessments enable row level security;
alter table care_plans enable row level security;
alter table chat_messages enable row level security;
alter table clinical_visits enable row level security;

-- (Policies are kept completely open for prototype purposes. In production, policies should verify auth.uid() = caregivers.auth_user_id)
create policy "Allow all operations for prototype" on caregivers for all using (true);
create policy "Allow all operations for prototype" on children for all using (true);
create policy "Allow all operations for prototype" on daily_logs for all using (true);
create policy "Allow all operations for prototype" on ai_assessments for all using (true);
create policy "Allow all operations for prototype" on care_plans for all using (true);
create policy "Allow all operations for prototype" on chat_messages for all using (true);
create policy "Allow all operations for prototype" on clinical_visits for all using (true);
