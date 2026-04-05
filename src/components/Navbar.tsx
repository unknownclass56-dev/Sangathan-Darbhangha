import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const navItems = [
  { label: "मुख्य पृष्ठ", href: "#home" },
  { label: "राष्ट्रीय कार्यकारिणी", href: "#team" },
  { label: "कार्यक्रम", href: "#events" },
  { label: "हमारी योजना", href: "#plans" },
  { label: "गैलरी", href: "#gallery" },
  { label: "दान करें", href: "#donate" },
  { label: "संपर्क", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="पंचा महाबली संगठन" className="h-14 w-14 rounded-full object-cover" />
          <div>
            <h1 className="text-lg font-bold text-primary font-hindi leading-tight">पंचा महाबली संगठन</h1>
            <p className="text-xs text-muted-foreground">दरभंगा</p>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-card border-t border-border px-4 pb-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-foreground hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
