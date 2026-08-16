-- ============================================================
-- INFOGRAM'26 Production Database Migration Script
-- Project Ref: fipoazwipiahfkttgwew
-- ============================================================

-- 1. Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  applicant_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  total_fee NUMERIC DEFAULT 100,
  status TEXT DEFAULT 'pending_payment',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  applicant_id TEXT NOT NULL,
  registration_id TEXT REFERENCES public.registrations(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college TEXT,
  department TEXT,
  year TEXT,
  events TEXT[] NOT NULL DEFAULT '{}',
  total_amount NUMERIC DEFAULT 100,
  payment_method TEXT DEFAULT 'razorpay',
  razorpay_payment_id TEXT,
  qr_data TEXT NOT NULL,
  status TEXT DEFAULT 'valid',
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT DEFAULT 'technical',
  max_slots NUMERIC DEFAULT 200,
  registered_count NUMERIC DEFAULT 0,
  registration_fee NUMERIC DEFAULT 50,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_order_id TEXT,
  registration_id TEXT,
  applicant_id TEXT,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'captured',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to tickets, events, and registrations for verify & scanning
CREATE POLICY "Public read tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read registrations" ON public.registrations FOR SELECT USING (true);

-- Allow public insert for registrations and tickets during payment flow
CREATE POLICY "Public insert registrations" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update registrations" ON public.registrations FOR UPDATE USING (true);
CREATE POLICY "Public update tickets" ON public.tickets FOR UPDATE USING (true);
