
-- Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- slider_images
CREATE TABLE public.slider_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.slider_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read slider" ON public.slider_images FOR SELECT USING (true);
CREATE POLICY "Admin manage slider" ON public.slider_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_slider_images_ts BEFORE UPDATE ON public.slider_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- team_members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read team" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admin manage team" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_team_members_ts BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- upcoming_events
CREATE TABLE public.upcoming_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  time_range TEXT,
  location TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.upcoming_events FOR SELECT USING (true);
CREATE POLICY "Admin manage events" ON public.upcoming_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_upcoming_events_ts BEFORE UPDATE ON public.upcoming_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- plans (हमारी योजना)
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  goal_amount TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read plans" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Admin manage plans" ON public.plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_plans_ts BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- gallery_images
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'general',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admin manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_gallery_images_ts BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- featured_events (आगामी कार्यक्रम)
CREATE TABLE public.featured_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  year TEXT,
  time_range TEXT,
  location TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.featured_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read featured_events" ON public.featured_events FOR SELECT USING (true);
CREATE POLICY "Admin manage featured_events" ON public.featured_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_featured_events_ts BEFORE UPDATE ON public.featured_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- donation_settings
CREATE TABLE public.donation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_image_url TEXT,
  amounts TEXT[] DEFAULT ARRAY['100', '500', '1000', '5000'],
  upi_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.donation_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read donation_settings" ON public.donation_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage donation_settings" ON public.donation_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_donation_settings_ts BEFORE UPDATE ON public.donation_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default donation settings
INSERT INTO public.donation_settings (amounts) VALUES (ARRAY['100', '500', '1000', '5000']);

-- donation_requests
CREATE TABLE public.donation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  amount TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.donation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert donation_requests" ON public.donation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read donation_requests" ON public.donation_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage donation_requests" ON public.donation_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_site_settings_ts BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('phone', '+9152075393'),
  ('email', 'pmsbiharofficial53@gmail.com'),
  ('address', 'Raj Maidan Near Manokamna Mandir Darbhanga, Near Shyama Mai Mandir'),
  ('instagram', '@shivajha53official'),
  ('org_name', 'पंचा महाबली संगठन दरभंगा');

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Admin upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
