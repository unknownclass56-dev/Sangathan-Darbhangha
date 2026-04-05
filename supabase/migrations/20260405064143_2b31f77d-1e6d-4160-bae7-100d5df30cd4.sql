
-- Drop existing policies on donation_requests
DROP POLICY IF EXISTS "Public insert donation_requests" ON public.donation_requests;
DROP POLICY IF EXISTS "Admin read donation_requests" ON public.donation_requests;
DROP POLICY IF EXISTS "Admin manage donation_requests" ON public.donation_requests;

-- Re-create with specific policies
CREATE POLICY "Anyone can submit donation" ON public.donation_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (name IS NOT NULL AND amount IS NOT NULL);

CREATE POLICY "Admin can view donations" ON public.donation_requests
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update donations" ON public.donation_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete donations" ON public.donation_requests
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
