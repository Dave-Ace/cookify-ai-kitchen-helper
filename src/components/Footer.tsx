import { ChefHat } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Cookify
              </span>
            </div>
            <p className="text-muted-foreground">
              Your AI-powered cooking companion. Turn ingredients into amazing meals with personalized recipe suggestions.
            </p>
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
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Cookify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
