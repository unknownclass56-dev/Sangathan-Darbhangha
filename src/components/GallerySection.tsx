import { useState } from "react";
import { useGalleryImages } from "@/hooks/useSiteData";
import { X, HandHeart } from "lucide-react";

const GallerySection = () => {
  const { data: images } = useGalleryImages();
  const [selected, setSelected] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section id="gallery" className="py-12 bg-[#fafafa]">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-hindi text-gray-800 mb-2">
            सहायता कार्य <span className="text-[#f26522]">गैलरी</span>
          </h2>
          <div className="flex justify-center text-[#f26522]/40 mb-2">
            <HandHeart className="w-8 h-8" />
          </div>
          <p className="text-gray-600 font-hindi">कड़ी मेहनत और समर्थन टीम</p>
          <p className="text-gray-600 font-hindi">संपूर्ण भारतीय कार्य प्रोफाइल!</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gray-200">
          {images.map((img) => (
            <div
              key={img.id}
              className="aspect-square overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-b border-r border-gray-200 last:border-r-0"
              onClick={() => setSelected(img.image_url)}
            >
              <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={() => setSelected(null)}>
            <X className="w-8 h-8" />
          </button>
          <img src={selected} alt="" className="max-w-full max-h-[90vh]" />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
