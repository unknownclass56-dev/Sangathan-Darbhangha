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
import FounderSection from "@/components/FounderSection";
import BiharDistricts from "@/components/BiharDistricts";
import MissionSection from "@/components/MissionSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [blockSettings, setBlockSettings] = useState({ enabled: false, title: "", message: "" });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSiteStatus = async () => {
      const { data } = await (supabase as any)
        .from('site_settings')
        .select('*');

      if (data) {
        const maintenance = data.find((s: any) => s.setting_key === 'maintenance_mode');
        const blockE = data.find((s: any) => s.setting_key === 'block_mode');
        const blockT = data.find((s: any) => s.setting_key === 'block_title');
        const blockM = data.find((s: any) => s.setting_key === 'block_message');

        if (maintenance?.setting_value === "true") setIsMaintenance(true);
        
        setBlockSettings({
          enabled: blockE?.setting_value === "true",
          title: blockT?.setting_value || "अस्थायी रूप से अवरुद्ध",
          message: blockM?.setting_value || "सुरक्षा कारणों से इस पेज को अस्थायी रूप से ब्लॉक कर दिया गया है।"
        });
      }
      setChecking(false);
    };
    checkSiteStatus();
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

  if (blockSettings.enabled) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Aesthetic Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-xl w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center relative z-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-red-900/20">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 font-hindi tracking-tight">
            {blockSettings.title}
          </h1>
          
          <div className="w-16 h-1 bg-red-600/50 mx-auto mb-8 rounded-full" />
          
          <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium">
            {blockSettings.message}
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-semibold transition-all duration-300"
          >
            <span>पुनः प्रयास करें</span>
          </button>
        </div>
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
      <MissionSection />
      <FounderSection />
      <BiharDistricts />
      <Footer />
    </div>
  );
};

export default Index;
