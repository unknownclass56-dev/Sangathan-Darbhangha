import { useTeamMembers } from "@/hooks/useSiteData";
import { Facebook, Twitter, Youtube, Quote, Globe } from "lucide-react";

const TeamSection = () => {
  const { data: members } = useTeamMembers();

  if (!members || members.length === 0) return null;

  return (
    <section id="team" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* We keep the grid border approach for the whole block to match references */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-t-red-500 border-t-[3px]">
          {members.map((m) => (
            <div key={m.id} className="border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold font-hindi text-gray-800 border-b border-gray-200 pb-2 mb-6">
                  राष्ट्रीय कार्यकारिणी
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <div className="w-32 h-32 flex-shrink-0">
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="w-full h-full object-cover rounded shadow-sm border" />
                    ) : (
                      <div className="w-full h-full bg-[#f26522] flex items-center justify-center text-white text-4xl font-bold rounded shadow-sm">
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-hindi text-gray-800">{m.name}</h3>
                    <p className="text-sm text-gray-500 font-hindi mb-4">{m.position}</p>
                    
                    <div className="flex gap-2">
                      <a href="#" onClick={(e) => e.preventDefault()} className="bg-[#f26522] text-white p-1 rounded-sm hover:bg-orange-600 transition"><Facebook className="w-4 h-4"/></a>
                      <a href="#" onClick={(e) => e.preventDefault()} className="bg-[#f26522] text-white p-1 rounded-sm hover:bg-orange-600 transition"><Twitter className="w-4 h-4"/></a>
                      <a href="#" onClick={(e) => e.preventDefault()} className="bg-[#f26522] text-white p-1 rounded-sm hover:bg-orange-600 transition"><Globe className="w-4 h-4"/></a>
                      <a href="#" onClick={(e) => e.preventDefault()} className="bg-[#f26522] text-white p-1 rounded-sm hover:bg-orange-600 transition"><Youtube className="w-4 h-4"/></a>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-[#f26522] mb-2 text-xl font-serif">
                    “ <span className="font-hindi italic text-sm text-gray-500">राष्ट्रीय कार्यकारिणी</span>
                  </div>
                  <p className="text-sm text-gray-600 font-hindi line-clamp-3">
                    {m.description || "तत्काल जीवनरक्षक सहायता प्रदान करने में सहायता करें।"}
                  </p>
                </div>
              </div>
              
              <div className="mt-auto">
                <button className="bg-[#f26522] text-white text-sm px-4 py-2 rounded-sm hover:bg-orange-600 transition font-hindi shadow-sm">
                  विस्तृत जानकारी देखें
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
