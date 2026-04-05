import { Phone, Mail, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";

const TopBar = () => {
  const { data: settings } = useSiteSettings();

  return (
    <div className="gradient-saffron py-2 px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between text-sm text-primary-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          {settings?.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:opacity-80">
              <Phone className="w-3 h-3" /> {settings.phone}
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1 hover:opacity-80">
              <Mail className="w-3 h-3" /> {settings.email}
            </a>
          )}
        </div>
        {settings?.address && (
          <div className="hidden md:flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {settings.address}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
