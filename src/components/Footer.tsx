import logo from "@/assets/logo-transparent.png";
import { NavLink } from "@/components/NavLink";
import { Play } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src={logo} alt="SousAI" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                SousAI
              </span>
            </div>
            <p className="text-muted-foreground">
              Your AI-powered cooking companion. Turn ingredients into amazing meals with personalized recipe suggestions.
            </p>
            {/* App Stores */}
            <div className="flex gap-4 mt-6">
              <div className="relative group cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity">
                <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 shadow-sm">
                  <Play className="w-6 h-6 fill-current" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] leading-tight uppercase font-medium">Get it on</span>
                    <span className="text-sm font-bold leading-tight">Google Play</span>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><NavLink to="/#features" className="text-muted-foreground hover:text-primary transition-colors">Features</NavLink></li>
              <li><NavLink to="/#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</NavLink></li>
              <li><NavLink to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><NavLink to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</NavLink></li>
              <li><NavLink to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</NavLink></li>
              <li><NavLink to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</NavLink></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 SousAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
