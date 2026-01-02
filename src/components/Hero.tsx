import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ChefHat, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-cooking.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
        }}
      />

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary-foreground">AI-Powered Recipe Assistant</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Your Ingredients Into
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Delicious Meals</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Simply tell us what you have in your kitchen, and our AI chef will create personalized recipes tailored to your taste and dietary needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-hero hover:opacity-90 transition-opacity text-lg px-8 py-6 shadow-sousai-lg"
            >
              <NavLink to="/dashboard">
                <ChefHat className="w-5 h-5 mr-2" />
                Start Cooking Free
              </NavLink>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
            >
              <NavLink to="/#features">Learn More</NavLink>
            </Button>
          </div>

          <p className="text-white/70 text-sm mt-6">
            7-day free trial • No credit card required • 1 recipe per day
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
