import logo from "@/assets/logo.png";
import { NavLink } from "@/components/NavLink";

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
            {/* Social Icons Placeholder */}
            <div className="flex gap-4">
              {/* Add social icons here if needed */}
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
