import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Plus, Search, X, ShoppingCart, BookmarkPlus, BookmarkCheck, Lightbulb, Copy } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import recipeExample from "@/assets/recipe-example.jpg";

// Ingredient substitutions database
const ingredientSubstitutions: Record<string, string[]> = {
  "eggs": ["1 tbsp flaxseed + 3 tbsp water", "1/4 cup applesauce", "1/4 cup mashed banana"],
  "milk": ["almond milk", "soy milk", "oat milk", "coconut milk"],
  "butter": ["coconut oil", "olive oil", "ghee", "margarine"],
  "flour": ["almond flour", "coconut flour", "oat flour"],
  "sugar": ["honey", "maple syrup", "stevia", "agave nectar"],
  "feta cheese": ["goat cheese", "ricotta cheese", "cottage cheese"],
};

type Recipe = {
  id: string;
  title: string;
  image: string;
  prepTime: string;
  calories: string;
  missingIngredients: string[];
};

const Dashboard = () => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [includeNewIngredients, setIncludeNewIngredients] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [groceryList, setGroceryList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("search");

  // Load saved recipes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedRecipes");
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

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
    // Collect missing ingredients for grocery list
    const allMissing = mockRecipes.flatMap(r => r.missingIngredients);
    setGroceryList([...new Set(allMissing)]);
  };

  const saveRecipe = (recipe: Recipe) => {
    const isAlreadySaved = savedRecipes.some(r => r.id === recipe.id);
    
    if (isAlreadySaved) {
      const updated = savedRecipes.filter(r => r.id !== recipe.id);
      setSavedRecipes(updated);
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      toast({
        title: "Recipe removed",
        description: "Recipe removed from your journal.",
      });
    } else {
      const updated = [...savedRecipes, recipe];
      setSavedRecipes(updated);
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      toast({
        title: "Recipe saved!",
        description: "Recipe added to your journal.",
      });
    }
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some(r => r.id === recipeId);
  };

  const copyGroceryList = () => {
    const listText = groceryList.map((item, i) => `${i + 1}. ${item}`).join("\n");
    navigator.clipboard.writeText(listText);
    toast({
      title: "Copied!",
      description: "Grocery list copied to clipboard.",
    });
  };

  const getSubstitutions = (ingredient: string) => {
    const normalized = ingredient.toLowerCase();
    for (const [key, subs] of Object.entries(ingredientSubstitutions)) {
      if (normalized.includes(key)) {
        return { ingredient: key, substitutes: subs };
      }
    }
    return null;
  };

  // Mock recipe data
  const mockRecipes: Recipe[] = [
    {
      id: "1",
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="search">
                <Search className="w-4 h-4 mr-2" />
                Search Recipes
              </TabsTrigger>
              <TabsTrigger value="saved">
                <BookmarkCheck className="w-4 h-4 mr-2" />
                Saved ({savedRecipes.length})
              </TabsTrigger>
              <TabsTrigger value="grocery">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Grocery List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-8">
              <div>
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
                    {mockRecipes.map((recipe, index) => {
                      const isSaved = isRecipeSaved(recipe.id);
                      return (
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
                              <CardContent className="space-y-4">
                                {recipe.missingIngredients.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium mb-2">Missing ingredients:</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {recipe.missingIngredients.map((ing, i) => (
                                        <Badge key={i} variant="outline">
                                          {ing}
                                        </Badge>
                                      ))}
                                    </div>
                                    
                                    {/* Ingredient Substitutions */}
                                    {recipe.missingIngredients.some(ing => getSubstitutions(ing)) && (
                                      <Card className="bg-muted/50 border-primary/20">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-sm flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4 text-primary" />
                                            Ingredient Substitutions
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          {recipe.missingIngredients.map((ing, i) => {
                                            const sub = getSubstitutions(ing);
                                            if (!sub) return null;
                                            return (
                                              <div key={i} className="text-sm">
                                                <p className="font-medium text-foreground">
                                                  No {sub.ingredient}? Try:
                                                </p>
                                                <ul className="list-disc list-inside text-muted-foreground ml-2 mt-1">
                                                  {sub.substitutes.map((s, idx) => (
                                                    <li key={idx}>{s}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            );
                                          })}
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                )}
                                <div className="flex gap-3">
                                  <Button className="bg-gradient-hero">View Recipe</Button>
                                  <Button 
                                    variant={isSaved ? "default" : "outline"}
                                    onClick={() => saveRecipe(recipe)}
                                  >
                                    {isSaved ? (
                                      <>
                                        <BookmarkCheck className="w-4 h-4 mr-2" />
                                        Saved
                                      </>
                                    ) : (
                                      <>
                                        <BookmarkPlus className="w-4 h-4 mr-2" />
                                        Save
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Recipe Journal</h1>
                <p className="text-muted-foreground text-lg">
                  Your saved recipes and favorites
                </p>
              </div>

              {savedRecipes.length === 0 ? (
                <Card className="p-12 text-center">
                  <BookmarkPlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No saved recipes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start searching for recipes and save your favorites!
                  </p>
                  <Button onClick={() => setActiveTab("search")} className="bg-gradient-hero">
                    <Search className="w-4 h-4 mr-2" />
                    Find Recipes
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {savedRecipes.map((recipe) => (
                    <Card key={recipe.id} className="overflow-hidden hover:shadow-cookify-md transition-shadow">
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
                            <div className="flex gap-3">
                              <Button className="bg-gradient-hero">View Recipe</Button>
                              <Button 
                                variant="destructive"
                                onClick={() => saveRecipe(recipe)}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="grocery" className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Smart Grocery List</h1>
                <p className="text-muted-foreground text-lg">
                  Missing ingredients from your recipe searches
                </p>
              </div>

              {groceryList.length === 0 ? (
                <Card className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No items yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Search for recipes to generate your grocery list automatically
                  </p>
                  <Button onClick={() => setActiveTab("search")} className="bg-gradient-hero">
                    <Search className="w-4 h-4 mr-2" />
                    Find Recipes
                  </Button>
                </Card>
              ) : (
                <Card className="shadow-cookify-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Your Grocery List</CardTitle>
                      <Button variant="outline" size="sm" onClick={copyGroceryList}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy List
                      </Button>
                    </div>
                    <CardDescription>
                      {groceryList.length} item{groceryList.length !== 1 ? "s" : ""} to buy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {groceryList.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item}</p>
                            {getSubstitutions(item) && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Alternatives: {getSubstitutions(item)?.substitutes.slice(0, 2).join(", ")}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
