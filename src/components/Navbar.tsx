import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ChefHat } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Cookify
          </span>
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/#features"
            className="text-foreground hover:text-primary transition-colors"
          >
            Features
          </NavLink>
          <NavLink
            to="/#pricing"
            className="text-foreground hover:text-primary transition-colors"
          >
            Pricing
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <NavLink to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-hero p-[2px]">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  <div className="text-sm font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {user?.userProfile?.image ? (
                      <img src={user.userProfile.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : "U"
                    )}
                  </div>
                </div>
              </div>
            </NavLink>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <NavLink to="/auth">Sign In</NavLink>
              </Button>
              <Button asChild className="bg-gradient-hero hover:opacity-90 transition-opacity">
                <NavLink to="/auth">Get Started</NavLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
