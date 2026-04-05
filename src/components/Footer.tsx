import { useSiteSettings } from "@/hooks/useSiteData";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Footer = () => {
  const { data: settings } = useSiteSettings();

  return (
    <>
      {/* Floating WhatsApp Button */}
      {settings?.whatsapp_link && (
        <a
          href={settings.whatsapp_link}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
          title="WhatsApp Group Join करें"
        >
          <WhatsAppIcon />
          <span className="hidden group-hover:inline-block text-sm font-medium pr-1 font-hindi">WhatsApp Group</span>
        </a>
      )}

      <footer id="contact" className="gradient-saffron text-primary-foreground">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start">
              <img src={logo} alt="Logo" className="h-20 w-20 rounded-full mb-4" />
              <h3 className="text-xl font-bold font-hindi">पंचा महाबली संगठन</h3>
              <p className="text-sm opacity-90">दरभंगा</p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 font-hindi">संपर्क करें</h4>
              <div className="space-y-3 text-sm">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:opacity-80">
                    <Phone className="w-4 h-4" /> {settings.phone}
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:opacity-80">
                    <Mail className="w-4 h-4" /> {settings.email}
                  </a>
                )}
                {settings?.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> {settings.address}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 font-hindi">सोशल मीडिया</h4>
              <div className="space-y-3 text-sm">
                {/* Hardcoded Instagram Profiles */}
                {[
                  { handle: "shivajha51official", label: "shivajha51official" },
                  { handle: "shivajha53official", label: "shivajha53official" },
                  { handle: "pmsbiharofficial",   label: "pmsbiharofficial" },
                ].map(({ handle, label }) => (
                  <a
                    key={handle}
                    href={`https://instagram.com/${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <Instagram className="w-4 h-4" />
                    @{label}
                  </a>
                ))}

                {/* Dynamic Instagram from settings (if different) */}
                {settings?.instagram && !["shivajha51official","shivajha53official","pmsbiharofficial"].includes(settings.instagram.replace("@","")) && (
                  <a
                    href={`https://instagram.com/${settings.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <Instagram className="w-4 h-4" /> {settings.instagram}
                  </a>
                )}

                {/* WhatsApp Group */}
                {settings?.whatsapp_link && (
                  <a
                    href={settings.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <WhatsAppIcon />
                    WhatsApp Group Join करें
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p>© {new Date().getFullYear()} पंचा महाबली संगठन दरभंगा। सर्वाधिकार सुरक्षित।</p>
            <a href="/admin" className="mt-2 md:mt-0 hover:underline hover:text-white transition-colors font-hindi">
              एडमिन लॉगिन
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

