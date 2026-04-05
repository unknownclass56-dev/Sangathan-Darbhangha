import { useQuery } from "@tanstack/react-query";
import {
  getSliderImages, getTeamMembers, getUpcomingEvents,
  getPlans, getGalleryImages, getFeaturedEvents,
  getDonationSettings, getSiteSettings
} from "@/lib/supabase-helpers";

export const useSliderImages = () => useQuery({
  queryKey: ["slider_images"],
  queryFn: async () => { const { data } = await getSliderImages(); return data || []; }
});

export const useTeamMembers = () => useQuery({
  queryKey: ["team_members"],
  queryFn: async () => { const { data } = await getTeamMembers(); return data || []; }
});

export const useUpcomingEvents = () => useQuery({
  queryKey: ["upcoming_events"],
  queryFn: async () => { const { data } = await getUpcomingEvents(); return data || []; }
});

export const usePlans = () => useQuery({
  queryKey: ["plans"],
  queryFn: async () => { const { data } = await getPlans(); return data || []; }
});

export const useGalleryImages = () => useQuery({
  queryKey: ["gallery_images"],
  queryFn: async () => { const { data } = await getGalleryImages(); return data || []; }
});

export const useFeaturedEvents = () => useQuery({
  queryKey: ["featured_events"],
  queryFn: async () => { const { data } = await getFeaturedEvents(); return data || []; }
});

export const useDonationSettings = () => useQuery({
  queryKey: ["donation_settings"],
  queryFn: async () => { const { data } = await getDonationSettings(); return data; }
});

export const useSiteSettings = () => useQuery({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data } = await getSiteSettings();
    const settings: Record<string, string> = {};
    data?.forEach((s) => { if (s.setting_key && s.setting_value) settings[s.setting_key] = s.setting_value; });
    return settings;
  }
});
