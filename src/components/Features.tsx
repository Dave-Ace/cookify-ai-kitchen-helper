import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Leaf, ShoppingCart, Clock, Star, Sparkles } from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "Smart Recipe Matching",
    description: "Our AI analyzes your available ingredients and suggests perfectly matched recipes you can make right now.",
  },
  {
    icon: Leaf,
    title: "Dietary Preferences",
    description: "Filter by vegetarian, vegan, gluten-free, halal, and more. Your health and values come first.",
  },
  {
    icon: ShoppingCart,
    title: "Smart Shopping Lists",
    description: "Missing ingredients? We'll generate an optimized shopping list so you can grab exactly what you need.",
  },
  {
    icon: Clock,
    title: "Time Estimates",
    description: "See prep and cooking times upfront. Perfect for busy weeknights or leisurely weekend cooking.",
  },
  {
    icon: Star,
    title: "Calorie Tracking",
    description: "Get nutritional information for every recipe to stay on top of your health goals.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description: "The more you use SousAI, the better it understands your taste and dietary preferences.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Cook Smarter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SousAI combines AI technology with culinary expertise to make cooking easier, healthier, and more enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card hover:shadow-sousai-md transition-all duration-300 hover:-translate-y-1 border-border"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
