import React from "react";

const BIHAR_DISTRICTS = [
  "पटना", "गया", "भागलपुर", "मुजफ्फरपुर", "दरभंगा", "पूर्णिया", "आरा", "बेगूसराय",
  "कटिहार", "मुंगेर", "छपरा", "सासाराम", "मोतिहारी", "बक्सर", "सीतामढ़ी",
  "मधुबनी", "समस्तीपुर", "नालंदा", "वैशाली", "सुपौल", "अररिया", "किशनगंज",
  "सहरसा", "मधेपुरा", "खगड़िया", "शिवहर", "सीवान", "गोपालगंज", "बेतिया",
  "रोहतास", "कैमूर", "औरंगाबाद", "जहानाबाद", "अरवल", "नवादा", "शेखपुरा",
  "लखीसराय", "जमुई"
];

const BiharDistricts = () => {
  return (
    <section className="py-10 bg-gradient-to-b from-orange-50 to-orange-100 border-t-4 border-[#f26522]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-hindi text-[#f26522] mb-1">बिहार के सभी जिले</h2>
          <p className="text-gray-600 font-hindi text-sm">पंचा महाबली संगठन — बिहार प्रदेश</p>
          <div className="w-20 h-1 bg-[#f26522] mx-auto mt-3 rounded-full"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {BIHAR_DISTRICTS.map((district) => (
            <span
              key={district}
              className="bg-white text-[#f26522] border border-[#f26522]/40 px-3 py-1.5 rounded-full text-sm font-hindi font-medium shadow-sm hover:bg-[#f26522] hover:text-white transition-all duration-200 cursor-default"
            >
              {district}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 font-hindi mt-4">
          संगठन की उपस्थिति बिहार के सभी {BIHAR_DISTRICTS.length} जिलों में है
        </p>
      </div>
    </section>
  );
};

export default BiharDistricts;
