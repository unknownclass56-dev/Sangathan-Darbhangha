import React from "react";
import { Calendar, Award, Heart } from "lucide-react";
import founderImg from "@/assets/founder.jpg";

const FounderSection = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#f26522]/10 text-[#f26522] text-sm font-hindi px-4 py-1 rounded-full mb-3 font-medium">
            🙏 संस्थापक
          </span>
          <h2 className="text-3xl font-bold font-hindi text-gray-800">पंचा महाबली संगठन</h2>
          <div className="w-24 h-1 bg-[#f26522] mx-auto mt-3 rounded-full" />
        </div>

        {/* Founder Card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl shadow-2xl border-2 border-[#f26522]/30 overflow-hidden">
            
            {/* Decorative top bar */}
            <div className="h-2 bg-gradient-to-r from-[#f26522] via-orange-400 to-[#f26522]" />

            {/* Decorative corner ornaments */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#f26522]/40 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[#f26522]/40 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[#f26522]/40 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#f26522]/40 rounded-br-lg" />

            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                
                {/* Founder Image Frame */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {/* Outer decorative ring */}
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#f26522] via-orange-400 to-yellow-500 p-1 shadow-xl">
                      <div className="w-full h-full rounded-full bg-white p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-orange-100">
                          <img 
                            src={founderImg} 
                            alt="श्री शिवम कुमार झा" 
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#f26522] text-white text-xs font-hindi px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                      राष्ट्रीय अध्यक्ष
                    </div>
                  </div>
                </div>

                {/* Founder Details */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold font-hindi text-gray-800 mb-1">
                    श्री शिवम कुमार झा
                  </h3>
                  <p className="text-[#f26522] font-medium font-hindi mb-4 text-lg">
                    संस्थापक एवं राष्ट्रीय अध्यक्ष
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="bg-[#f26522]/10 p-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-[#f26522]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">स्थापना तिथि</p>
                        <p className="font-bold font-hindi text-gray-800">22 अक्टूबर 2021</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="bg-[#f26522]/10 p-2 rounded-lg">
                        <Award className="w-4 h-4 text-[#f26522]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">संगठन</p>
                        <p className="font-bold font-hindi text-gray-800">पंचा महाबली संगठन</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="bg-[#f26522]/10 p-2 rounded-lg">
                        <Heart className="w-4 h-4 text-[#f26522]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">उद्देश्य</p>
                        <p className="font-bold font-hindi text-gray-800">राष्ट्र सेवा एवं हिन्दू जागृति</p>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-[#f26522]/10 border-l-4 border-[#f26522] rounded-r-lg p-4">
                    <p className="text-gray-700 font-hindi text-sm italic leading-relaxed">
                      "हिन्दू एकता और राष्ट्र की रक्षा के लिए पंचा महाबली संगठन सदैव प्रतिबद्ध है।<br/>
                      जय श्री राम! भारत माता की जय!"
                    </p>
                    <p className="text-[#f26522] font-bold font-hindi text-xs mt-2">— शिवम कुमार झा</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative bottom bar */}
            <div className="h-2 bg-gradient-to-r from-[#f26522] via-orange-400 to-[#f26522]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
