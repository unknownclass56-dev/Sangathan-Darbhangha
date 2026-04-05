import { supabase } from "@/integrations/supabase/client";

export const getSliderImages = () =>
  supabase.from("slider_images").select("*").eq("is_active", true).order("display_order");

export const getTeamMembers = () =>
  supabase.from("team_members").select("*").order("display_order");

export const getUpcomingEvents = () =>
  supabase.from("upcoming_events").select("*").order("event_date");

export const getPlans = () =>
  supabase.from("plans").select("*").order("created_at");

export const getGalleryImages = () =>
  supabase.from("gallery_images").select("*").order("display_order");

export const getFeaturedEvents = () =>
  supabase.from("featured_events").select("*").order("event_date");

export const getDonationSettings = () =>
  supabase.from("donation_settings").select("*").limit(1).single();

export const getSiteSettings = () =>
  supabase.from("site_settings").select("*");

export const submitDonation = (data: { name: string; email?: string; phone?: string; amount: string }) =>
  supabase.from("donation_requests").insert(data);
