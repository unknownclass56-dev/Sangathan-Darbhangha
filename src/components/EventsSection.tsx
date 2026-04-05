import React from "react";
import { useUpcomingEvents, useSiteSettings } from "@/hooks/useSiteData";
import { Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

const EventsSection = () => {
  const { data: events } = useUpcomingEvents();
  const { data: settings } = useSiteSettings();

  return (
    <section id="events" className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Upcoming Events */}
          <div>
            <h2 className="text-xl font-bold font-hindi text-gray-800 border-b-2 border-[#f26522] inline-block mb-6 pb-2">आने वाले कार्यक्रम</h2>
            <div className="space-y-4">
              {!events || events.length === 0 ? (
                <p className="text-muted-foreground text-sm">कोई आगामी कार्यक्रम नहीं</p>
              ) : (
                events.slice(0, 3).map((e) => {
                  const dateObj = new Date(e.event_date);
                  return (
                    <div key={e.id} className="flex bg-white shadow-sm border border-gray-100">
                      <div className="bg-[#f26522] text-white p-3 flex flex-col items-center justify-center min-w-[80px]">
                        <span className="text-2xl font-bold leading-none">{format(dateObj, "dd")}</span>
                        <span className="text-sm uppercase">{format(dateObj, "MMM")}</span>
                        <span className="text-xs mt-1 border-t border-white/30 pt-1 w-full text-center">
                          {e.location ? e.location.split(',')[0] : "स्थान"}
                        </span>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="text-xs text-gray-500 flex items-center gap-3 mb-2">
                          {e.time_range && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#f26522]"/> {e.time_range}</span>}
                          {e.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#f26522]"/> {e.location}</span>}
                        </div>
                        <h3 className="font-bold font-hindi text-gray-800">{e.title}</h3>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: About Organization */}
          <div>
            <h2 className="text-xl font-bold font-hindi text-gray-800 border-b-2 border-[#f26522] inline-block mb-6 pb-2">संगठन के बारे में जानकारी</h2>
            <div className="bg-white p-4 shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="w-full aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden">
                {settings?.about_image ? (
                  <img src={settings.about_image} alt="About" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-[#f26522] w-full h-full flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <h3 className="text-2xl font-bold font-hindi mb-2">भारत माता की जय</h3>
                      <GlobeIcon className="w-16 h-16 mx-auto opacity-50" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 font-hindi mb-4 flex-1">
                {settings?.about_text || "विश्व हिन्दू रक्षा संगठन। श्री रामनवमी पर्व के पावन शुभ अवसर पर अप्रैल 2014 में परम पूज्य श्री सुमित्रानंदन स्वामी जी के द्वारा संस्थापना किया गया।"}
              </p>
              <div>
                <button className="bg-[#f26522] text-white text-sm px-4 py-2 hover:bg-orange-600 transition font-hindi shadow-sm">
                  अधिक पढ़ें..
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Campaign / Video */}
          <div>
            <h2 className="text-xl font-bold font-hindi text-gray-800 border-b-2 border-[#f26522] inline-block mb-6 pb-2">हमारा अभियान</h2>
            <div className="bg-white p-4 shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-full aspect-video bg-gray-900 rounded-sm overflow-hidden mb-4 relative">
                {settings?.campaign_video ? (
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src={settings.campaign_video}
                    title="हमारा अभियान" 
                    frameBorder="0" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <p className="text-gray-400 font-hindi text-sm text-center px-4">Admin Panel से YouTube Video Link जोड़ें</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 font-hindi text-center w-full">
                {settings?.campaign_description || "विश्व हिन्दू रक्षा संगठन(VHRS) अभियान"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// Simple globe icon fallback
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

export default EventsSection;
