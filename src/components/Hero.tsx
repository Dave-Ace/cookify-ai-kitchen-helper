import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ChefHat, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-cooking.jpg";

const Hero = () => {
  // Countdown Logic
  const calculateTimeLeft = () => {
    const savedTarget = localStorage.getItem("launchTargetDate");
    let targetDate: number;

    if (savedTarget) {
      targetDate = parseInt(savedTarget, 10);
    } else {
      targetDate = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
      localStorage.setItem("launchTargetDate", targetDate.toString());
    }

    const difference = targetDate - new Date().getTime();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
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

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-6">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <span className="text-3xl md:text-4xl font-bold text-white font-mono">
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-white/70 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-white/70 text-sm">
            Limited Time Offer • 7-day free trial • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
