import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const pricingPlans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Perfect for trying out Cookify",
    features: [
      "4 AI recipe queries per day",
      "Access to all recipes",
      "Dietary restriction filters",
      "Basic nutritional info",
      "Shopping list generator",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "Unlimited cooking inspiration",
    features: [
      "Unlimited AI recipe queries",
      "Priority AI processing",
      "Advanced nutritional analytics",
      "Save unlimited recipes",
      "Personalized recommendations",
      "Meal planning calendar",
      "Priority customer support",
    ],
    cta: "Go Pro",
    highlighted: true,
    annualPrice: "$99.99/year (Save 17%)",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with our free trial, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative ${
                plan.highlighted 
                  ? 'border-primary shadow-cookify-lg scale-105' 
                  : 'border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-hero text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  {plan.annualPrice && (
                    <p className="text-sm text-secondary mt-1 font-medium">{plan.annualPrice}</p>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-secondary" />
                      </div>
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  asChild
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-gradient-hero hover:opacity-90' 
                      : ''
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                >
                  <NavLink to="/auth">{plan.cta}</NavLink>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
