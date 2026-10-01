-- K.N.S.K Security Co., Ltd. - Supabase PostgreSQL Database Schema
-- Run this SQL in your Supabase SQL Editor to initialize all tables, RLS policies, and triggers.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. QUOTATION REQUESTS
CREATE TABLE IF NOT EXISTS public.quotation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  province TEXT NOT NULL,
  facility_type TEXT NOT NULL CHECK (facility_type IN ('commercial', 'industrial', 'residential', 'bank', 'event', 'embassy')),
  guard_count INTEGER NOT NULL DEFAULT 1,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('24_7', 'day_only', 'night_only', 'custom')),
  extra_services TEXT[] DEFAULT '{}',
  estimated_monthly_cost_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONTACTED', 'APPROVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. RECRUITMENT APPLICATIONS
CREATE TABLE IF NOT EXISTS public.recruitment_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  province_of_origin TEXT NOT NULL,
  preferred_work_province TEXT NOT NULL,
  military_or_police_exp BOOLEAN DEFAULT FALSE,
  education_level TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. GUARDS (OFFICER VERIFICATION REGISTRY)
CREATE TABLE IF NOT EXISTS public.guards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  rank TEXT NOT NULL,
  assigned_site TEXT NOT NULL,
  province TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'INACTIVE')),
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  clearance_level TEXT NOT NULL DEFAULT 'Standard Security',
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INCIDENT REPORTS
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL,
  province TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reported_by_guard TEXT NOT NULL,
  time_reported TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'DISPATCHED' CHECK (status IN ('RESOLVED', 'INVESTIGATING', 'DISPATCHED'))
);

-- 5. PATROL LOGS
CREATE TABLE IF NOT EXISTS public.patrol_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guard_name TEXT NOT NULL,
  site_name TEXT NOT NULL,
  checkpoint_name TEXT NOT NULL,
  time_checked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'NORMAL' CHECK (status IN ('NORMAL', 'ISSUE_NOTED')),
  qr_verified BOOLEAN DEFAULT TRUE,
  gps_coordinates TEXT
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patrol_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES: PUBLIC INSERTION / SELECTION FOR QUOTATIONS & APPLICATIONS
DROP POLICY IF EXISTS "Allow public insert quotation requests" ON public.quotation_requests;
CREATE POLICY "Allow public insert quotation requests" ON public.quotation_requests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert recruitment applications" ON public.recruitment_applications;
CREATE POLICY "Allow public insert recruitment applications" ON public.recruitment_applications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read guards for verification" ON public.guards;
CREATE POLICY "Allow public read guards for verification" ON public.guards
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read incident reports" ON public.incident_reports;
CREATE POLICY "Allow public read incident reports" ON public.incident_reports
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read patrol logs" ON public.patrol_logs;
CREATE POLICY "Allow public read patrol logs" ON public.patrol_logs
  FOR SELECT USING (true);
