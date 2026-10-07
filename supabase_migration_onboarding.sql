-- =============================================
-- Migration: Add Oral Health Onboarding System
-- =============================================

-- 1. Add onboarding fields to caregivers
ALTER TABLE caregivers
  ADD COLUMN IF NOT EXISTS relationship_to_child text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS preferred_contact text DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS clerk_user_id text UNIQUE;

-- 2. Add date_of_birth to children (currently only has integer age)
ALTER TABLE children
  ADD COLUMN IF NOT EXISTS date_of_birth date;

-- 3. Oral Health Assessments Table (20-question questionnaire)
CREATE TABLE IF NOT EXISTS oral_health_assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,

  -- Brushing Habits (Q1-Q5)
  brush_frequency text NOT NULL,          -- 'never', 'once_daily', 'twice_daily'
  brush_duration text NOT NULL,           -- 'less_than_1_min', '1_to_2_min', '3_min'
  toothbrush_type text NOT NULL,          -- 'manual', 'electric', 'other'
  toothbrush_other text,                  -- specified if type='other'
  toothpaste text,                        -- free text
  brushes_all_surfaces text NOT NULL,     -- 'yes', 'no', 'not_sure'

  -- Dietary Habits (Q6-Q10)
  sugary_food_frequency text NOT NULL,    -- 'never', '1_to_2_daily', 'more_than_2_daily'
  healthy_food_frequency text NOT NULL,   -- 'daily', '3_to_4_weekly', '1_to_2_weekly'
  preferred_food text NOT NULL,           -- 'sweet', 'home_cooked', 'fruits', 'vegetables'
  keeps_food_in_mouth text NOT NULL,      -- 'never', 'sometimes', 'often'
  frequently_asks_for_food text NOT NULL, -- 'yes', 'no'

  -- Medical & Dental History (Q11-Q15)
  regular_medication text NOT NULL,       -- 'yes', 'no'
  medication_details text,                -- specified if medication='yes'
  gum_bleeding text NOT NULL,             -- 'yes', 'no'
  tooth_spots_or_cavities text NOT NULL,  -- 'yes', 'no'
  bad_breath text NOT NULL,               -- 'yes', 'no'
  last_dental_visit text NOT NULL,        -- '1_to_2_months', '6_to_12_months', 'never'

  -- Behavioral & Sensory-Motor Skills (Q16-Q20)
  new_situation_response text NOT NULL,       -- 'adapts_easily', 'needs_reassurance', 'requires_support'
  allows_caregiver_brushing text NOT NULL,    -- 'yes', 'no'
  difficulty_opening_mouth text NOT NULL,     -- 'yes', 'no'
  toothbrush_sensory_dislike text NOT NULL,   -- 'yes', 'no'
  cooperation_method text NOT NULL,           -- 'verbal', 'pictures_video', 'demonstration', 'other'
  cooperation_other text,                     -- specified if method='other'

  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Daily Oral Hygiene Logs (separate from existing daily_logs)
CREATE TABLE IF NOT EXISTS daily_oral_hygiene_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,

  -- Brushing
  morning_brushing boolean DEFAULT false,
  night_brushing boolean DEFAULT false,

  -- Diet
  ate_fruits_vegetables boolean DEFAULT false,
  sugary_snacks_or_drinks boolean DEFAULT false,
  snacked_between_meals boolean DEFAULT false,

  -- Behaviour
  brushes_independently boolean DEFAULT false,
  cooperated_with_brushing boolean DEFAULT false,
  showed_resistance boolean DEFAULT false,

  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  UNIQUE (child_id, date)
);

-- 5. Enable RLS on new tables
ALTER TABLE oral_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_oral_hygiene_logs ENABLE ROW LEVEL SECURITY;

-- 6. Prototype RLS policies (open for now, same as existing tables)
CREATE POLICY "Allow all operations for prototype" ON oral_health_assessments FOR ALL USING (true);
CREATE POLICY "Allow all operations for prototype" ON daily_oral_hygiene_logs FOR ALL USING (true);
