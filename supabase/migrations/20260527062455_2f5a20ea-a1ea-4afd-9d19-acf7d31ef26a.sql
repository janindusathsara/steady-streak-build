
-- ============ service_categories ============
CREATE TABLE public.service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text,
  pros_count int NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_categories TO anon, authenticated;
GRANT ALL ON public.service_categories TO service_role;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories readable by all" ON public.service_categories FOR SELECT USING (true);

-- ============ sub_services ============
CREATE TABLE public.sub_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  base_price int NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);
GRANT SELECT ON public.sub_services TO anon, authenticated;
GRANT ALL ON public.sub_services TO service_role;
ALTER TABLE public.sub_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sub_services readable by all" ON public.sub_services FOR SELECT USING (true);

-- ============ providers ============
CREATE TABLE public.providers (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline text NOT NULL DEFAULT 'Service Pro',
  category_id uuid REFERENCES public.service_categories(id),
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  jobs_done int NOT NULL DEFAULT 0,
  years_experience int NOT NULL DEFAULT 1,
  hourly_rate int NOT NULL DEFAULT 2000,
  city text DEFAULT 'Colombo',
  distance_km numeric(4,1) DEFAULT 2.5,
  verified boolean NOT NULL DEFAULT true,
  top_rated boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.providers TO anon, authenticated;
GRANT INSERT, UPDATE ON public.providers TO authenticated;
GRANT ALL ON public.providers TO service_role;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers readable by all" ON public.providers FOR SELECT USING (true);
CREATE POLICY "providers update own" ON public.providers FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "providers insert own" ON public.providers FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ bookings ============
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL UNIQUE DEFAULT ('FIN-' || to_char(now(), 'YYYY') || '-' || lpad((floor(random()*100000))::text, 5, '0')),
  homeowner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sub_service_id uuid REFERENCES public.sub_services(id),
  service_name text NOT NULL,
  job_type text NOT NULL DEFAULT 'on_the_spot' CHECK (job_type IN ('on_the_spot','scheduled')),
  scheduled_date date,
  scheduled_time text,
  address_line text NOT NULL,
  district text,
  postal_code text,
  landmarks text,
  problem_desc text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','in_progress','completed','cancelled')),
  hourly_rate int NOT NULL DEFAULT 0,
  est_hours int NOT NULL DEFAULT 2,
  platform_fee int NOT NULL DEFAULT 200,
  total_amount int NOT NULL DEFAULT 0,
  payment_method text DEFAULT 'card',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings homeowner select" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = homeowner_id);
CREATE POLICY "bookings provider select" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = provider_id);
CREATE POLICY "bookings homeowner insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = homeowner_id);
CREATE POLICY "bookings homeowner update" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = homeowner_id);
CREATE POLICY "bookings provider update" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = provider_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER bookings_touch BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ notifications ============
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'booking',
  title text NOT NULL,
  body text,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications own select" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notifications own update" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Auto-notify provider when a booking is created
CREATE OR REPLACE FUNCTION public.notify_provider_on_booking()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, body, booking_id)
  VALUES (
    NEW.provider_id,
    'new_booking',
    'New booking request',
    'You have a new ' || NEW.service_name || ' job (' || NEW.ref_code || ').',
    NEW.id
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER bookings_notify_provider AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.notify_provider_on_booking();

-- ============ Seed data ============
INSERT INTO public.service_categories (slug, name, icon, pros_count, sort_order) VALUES
  ('plumbing','Plumbing','🔧',1200,1),
  ('electrical','Electrical','⚡',850,2),
  ('painting','Painting','🎨',640,3),
  ('carpentry','Carpentry','🪚',410,4),
  ('hvac','HVAC','❄️',420,5),
  ('cleaning','Cleaning','🧹',930,6),
  ('masonry','Masonry','🧱',280,7),
  ('welding','Welding','🔥',190,8);

INSERT INTO public.sub_services (category_id, slug, name, description, icon, base_price, sort_order)
SELECT c.id, s.slug, s.name, s.description, s.icon, s.base_price, s.sort_order FROM (VALUES
  ('plumbing','faucet-tap-repair','Faucet & Tap Repair','Fix leaking or broken taps','💧',1500,1),
  ('plumbing','toilet-repair','Toilet Repair','Flush, cistern, blockage','🚽',2000,2),
  ('plumbing','pipe-fitting','Pipe Fitting & Leak Fix','Detect and repair leaks','🏠',3000,3),
  ('plumbing','drainage','Drainage & Blockage','Clear drains and floor traps','🪣',1800,4),
  ('electrical','wiring','Wiring & Rewiring','Safe home wiring','🔌',2500,1),
  ('electrical','fan-install','Fan Installation','Ceiling & wall fans','🌀',1800,2),
  ('electrical','switch-socket','Switch & Socket','Repair or replace','🔘',1200,3),
  ('painting','interior','Interior Painting','Room repaint','🖌️',5000,1),
  ('painting','exterior','Exterior Painting','House exterior','🏘️',8000,2),
  ('carpentry','door-repair','Door Repair','Hinges, locks, frames','🚪',2000,1),
  ('carpentry','furniture','Furniture Repair','Tables, chairs, cabinets','🪑',2500,2),
  ('hvac','ac-service','AC Service','Clean & gas refill','❄️',3500,1),
  ('cleaning','deep-clean','Deep Cleaning','Full home deep clean','🧽',4000,1),
  ('masonry','wall-repair','Wall Repair','Cracks and plaster','🧱',2200,1),
  ('welding','gate-repair','Gate & Grill Repair','Metal welding','🔥',2800,1)
) AS s(cat_slug, slug, name, description, icon, base_price, sort_order)
JOIN public.service_categories c ON c.slug = s.cat_slug;

-- Link existing test provider profile (janindusathsarapro) as a bookable provider
INSERT INTO public.providers (id, headline, category_id, rating, jobs_done, years_experience, hourly_rate, city, distance_km, verified, top_rated, bio)
SELECT p.id, 'Master Plumber', (SELECT id FROM public.service_categories WHERE slug='plumbing'),
       4.9, 342, 6, 2800, 'Colombo', 2.4, true, true,
       'Experienced master plumber serving Colombo area. Specializes in faucet, pipe, and drainage work.'
FROM public.profiles p WHERE p.role = 'provider'
ON CONFLICT (id) DO NOTHING;
