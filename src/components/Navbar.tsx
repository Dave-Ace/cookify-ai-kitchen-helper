import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import logo from "@/assets/logo.png";
import Pricing from "@/components/Pricing";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="SousAI" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SousAI
          </span>
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          {!isAuthenticated && (
            <NavLink
              to="/#features"
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Features
            </NavLink>
          )}
          {!isAuthenticated && (
            <span
              className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium"
              onClick={() => setIsPricingOpen(true)}
            >
              Pricing
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="w-10 h-10 rounded-full bg-gradient-hero p-[2px] cursor-pointer hover:opacity-80 transition-opacity">
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
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <Pricing
            minimal={true}
            onPlanSelect={(planId) => {
              setIsPricingOpen(false);
              // Redirect to auth with plan param if needed, or just close and let them sign up
              window.location.href = `/auth?plan=${planId}`;
            }}
          />
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
