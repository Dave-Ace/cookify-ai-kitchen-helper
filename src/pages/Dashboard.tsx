import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Plus, Search, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Checkbox } from "@/components/ui/checkbox";
import recipeExample from "@/assets/recipe-example.jpg";

const Dashboard = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [includeNewIngredients, setIncludeNewIngredients] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    setShowResults(true);
  };

  // Mock recipe data
  const mockRecipes = [
    {
      title: "Mediterranean Quinoa Bowl",
      image: recipeExample,
      prepTime: "15 min",
      calories: "420 kcal",
      missingIngredients: ["Feta cheese"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Cookify
            </span>
          </NavLink>
          <Button variant="outline" asChild>
            <NavLink to="/">Back to Home</NavLink>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Find Your Perfect Recipe</h1>
            <p className="text-muted-foreground text-lg">
              Enter the ingredients you have, and let our AI chef work its magic.
            </p>
          </div>

          <Card className="mb-8 shadow-cookify-md">
            <CardHeader>
              <CardTitle>Your Ingredients</CardTitle>
              <CardDescription>
                Add ingredients you have available in your kitchen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., chicken, tomatoes, onions"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                  className="flex-1"
                />
                <Button onClick={addIngredient} className="bg-gradient-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm py-1 px-3 flex items-center gap-2"
                    >
                      {ingredient}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeIngredient(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="dietary">Dietary Restrictions (optional)</Label>
                  <Input
                    id="dietary"
                    placeholder="e.g., vegetarian, gluten-free, halal"
                    className="mt-1.5"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-ingredients"
                    checked={includeNewIngredients}
                    onCheckedChange={(checked) => setIncludeNewIngredients(checked as boolean)}
                  />
                  <label
                    htmlFor="new-ingredients"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include recipes with additional ingredients I don't have
                  </label>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={ingredients.length === 0}
                size="lg"
                className="w-full bg-gradient-hero hover:opacity-90 transition-opacity"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Recipes
              </Button>
            </CardContent>
          </Card>

          {showResults && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Suggested Recipes</h2>
              <div className="grid gap-6">
                {mockRecipes.map((recipe, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-cookify-md transition-shadow">
                    <div className="md:flex">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full md:w-64 h-64 object-cover"
                      />
                      <div className="flex-1">
                        <CardHeader>
                          <CardTitle className="text-2xl">{recipe.title}</CardTitle>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>⏱️ {recipe.prepTime}</span>
                            <span>🔥 {recipe.calories}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {recipe.missingIngredients.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Missing ingredients:</p>
                              <div className="flex gap-2">
                                {recipe.missingIngredients.map((ing, i) => (
                                  <Badge key={i} variant="outline">
                                    {ing}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-3">
                            <Button className="bg-gradient-hero">View Recipe</Button>
                            <Button variant="outline">Save</Button>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
