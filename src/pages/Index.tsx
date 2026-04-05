import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShieldAlert } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import TeamSection from "@/components/TeamSection";
import EventsSection from "@/components/EventsSection";
import PlansSection from "@/components/PlansSection";
import StatsSection from "@/components/StatsSection";
import GallerySection from "@/components/GallerySection";
import FeaturedEventsSection from "@/components/FeaturedEventsSection";
import DonationSection from "@/components/DonationSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      const { data } = await (supabase as any)
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'maintenance_mode')
        .maybeSingle();

      if (data && data.setting_value === "true") {
        setIsMaintenance(true);
      }
      setChecking(false);
    };
    checkMaintenance();
  }, []);

  if (checking) {
    return <div className="min-h-screen gradient-saffron flex items-center justify-center text-white">Loading...</div>;
  }

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="w-20 h-20 text-saffron mb-6 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-bold font-hindi text-white mb-4">साइट मेंटेनेंस में है</h1>
        <p className="text-gray-400 text-lg max-w-md">
          पंचा महाबली संगठन की वेबसाइट पर अभी कुछ महत्वपूर्ण अपडेट्स चल रहे हैं। कृपया कुछ समय बाद दोबारा आएं।
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />
      <HeroSlider />
      <TeamSection />
      <EventsSection />
      <PlansSection />
      <StatsSection />
      <GallerySection />
      <FeaturedEventsSection />
      <DonationSection />
      <Footer />
    </div>
  );
};

export default Index;
