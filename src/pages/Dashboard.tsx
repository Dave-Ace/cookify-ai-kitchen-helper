import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Plus, Search, X, ShoppingCart, BookmarkPlus, BookmarkCheck, Lightbulb, Copy, UtensilsCrossed, Heart, Leaf, ChevronDown, ChevronUp, Edit } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

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

// API Recipe Types
type ApiRecipeIngredients = {
  user_provided: string[];
  additional_needed: string[];
};

type ApiRecipe = {
  recipe_name: string;
  description: string;
  ingredients: ApiRecipeIngredients;
  instructions: string;
  cooking_time: string;
  difficulty: string;
  health_tip: string;
};

type ApiResponse = {
  suggested_recipes: ApiRecipe[];
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [dietaryInputValue, setDietaryInputValue] = useState("");
  const [healthRestrictions, setHealthRestrictions] = useState<string[]>([]);
  const [healthInputValue, setHealthInputValue] = useState("");
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [lifestyleInputValue, setLifestyleInputValue] = useState("");
  const [includeNewIngredients, setIncludeNewIngredients] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [groceryList, setGroceryList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [apiRecipes, setApiRecipes] = useState<ApiRecipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(true);

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

  const addDietaryRestriction = () => {
    if (dietaryInputValue.trim()) {
      setDietaryRestrictions([...dietaryRestrictions, dietaryInputValue.trim()]);
      setDietaryInputValue("");
    }
  };

  const removeDietaryRestriction = (index: number) => {
    setDietaryRestrictions(dietaryRestrictions.filter((_, i) => i !== index));
  };

  const addHealthRestriction = () => {
    if (healthInputValue.trim()) {
      setHealthRestrictions([...healthRestrictions, healthInputValue.trim()]);
      setHealthInputValue("");
    }
  };

  const removeHealthRestriction = (index: number) => {
    setHealthRestrictions(healthRestrictions.filter((_, i) => i !== index));
  };

  const addLifestyle = () => {
    if (lifestyleInputValue.trim()) {
      setLifestyle([...lifestyle, lifestyleInputValue.trim()]);
      setLifestyleInputValue("");
    }
  };

  const removeLifestyle = (index: number) => {
    setLifestyle(lifestyle.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingRecipes(true);
    setShowResults(false);

    try {
      // Combine all fields into comma-separated strings
      const ingredientsString = ingredients.join(",");
      const dietaryString = dietaryRestrictions.join(",");
      const healthString = healthRestrictions.join(",");
      const lifestyleString = lifestyle.join(",");

      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Check if token is missing or undefined
      if (!token || token === "undefined" || token.trim() === "") {
        toast({
          title: "Authentication Required",
          description: "Please sign in to search for recipes",
          variant: "destructive",
        });
        setIsLoadingRecipes(false);
        navigate("/auth");
        return;
      }
      
      // Build query parameters
      const params = new URLSearchParams({
        ingredients: ingredientsString,
      });
      
      if (dietaryString) {
        params.append("dietary_restrictions", dietaryString);
      }
      if (healthString) {
        params.append("health_restrictions", healthString);
      }
      if (lifestyleString) {
        params.append("lifestyle", lifestyleString);
      }
      if (includeNewIngredients) {
        params.append("include_new_ingredients", "true");
      }
      
      // Make GET request with Authorization header
      const response = await fetch(`https://localhost:5001/recipes?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch recipes" }));
        throw new Error(errorData.message || "Failed to fetch recipes");
      }

      const data: ApiResponse = await response.json();
      setApiRecipes(data.suggested_recipes || []);
      setShowResults(true);
      setIsFormExpanded(false); // Collapse form when results are shown

      // Collect missing ingredients for grocery list
      const allMissing = (data.suggested_recipes || []).flatMap(
        (recipe) => recipe.ingredients.additional_needed || []
      );
      setGroceryList([...new Set(allMissing)]);

      toast({
        title: "Success",
        description: `Found ${data.suggested_recipes?.length || 0} recipe(s)`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch recipes",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecipes(false);
    }
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

            <TabsContent value="search" className="space-y-6">
              {!showResults && (
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
                    Find Your Perfect Recipe
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Enter the ingredients you have, and let our AI chef work its magic.
                  </p>
                </div>
              )}

              {/* Collapsible Form Section */}
              <Collapsible open={isFormExpanded} onOpenChange={setIsFormExpanded}>
                {showResults && (
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Suggested Recipes</h2>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        {isFormExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Hide Search Form
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Search
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                )}

                <CollapsibleContent className="space-y-6">
                  {/* Ingredients Section */}
              <Card className="shadow-lg border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <UtensilsCrossed className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Your Ingredients</CardTitle>
                      <CardDescription>
                        Add ingredients you have available in your kitchen
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., chicken, tomatoes, onions"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                      className="flex-1 h-11"
                    />
                    <Button onClick={addIngredient} className="bg-gradient-hero h-11 px-6">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      {ingredients.map((ingredient, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm py-1.5 px-3 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          {ingredient}
                          <X
                            className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                            onClick={() => removeIngredient(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preferences Section */}
              <Card className="shadow-lg border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Your Preferences</CardTitle>
                      <CardDescription>
                        Customize your recipe search with dietary, health, and lifestyle preferences
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dietary Restrictions */}
                  <div className="space-y-2">
                    <Label htmlFor="dietary" className="text-base font-semibold flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-primary" />
                      Dietary Restrictions
                      <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="dietary"
                        placeholder="e.g., vegetarian, gluten-free, halal"
                        value={dietaryInputValue}
                        onChange={(e) => setDietaryInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addDietaryRestriction()}
                        className="flex-1 h-10"
                      />
                      <Button onClick={addDietaryRestriction} variant="outline" size="sm" className="h-10">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {dietaryRestrictions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {dietaryRestrictions.map((restriction, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-sm py-1.5 px-3 flex items-center gap-2 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
                          >
                            {restriction}
                            <X
                              className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                              onClick={() => removeDietaryRestriction(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Health Restrictions */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="health" className="text-base font-semibold flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      Health Restrictions
                      <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="health"
                        placeholder="e.g., diabetes, high blood pressure, allergies"
                        value={healthInputValue}
                        onChange={(e) => setHealthInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addHealthRestriction()}
                        className="flex-1 h-10"
                      />
                      <Button onClick={addHealthRestriction} variant="outline" size="sm" className="h-10">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {healthRestrictions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {healthRestrictions.map((restriction, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-sm py-1.5 px-3 flex items-center gap-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                          >
                            {restriction}
                            <X
                              className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                              onClick={() => removeHealthRestriction(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Lifestyle */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="lifestyle" className="text-base font-semibold flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-primary" />
                      Lifestyle
                      <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="lifestyle"
                        placeholder="e.g., vegan, keto, paleo"
                        value={lifestyleInputValue}
                        onChange={(e) => setLifestyleInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addLifestyle()}
                        className="flex-1 h-10"
                      />
                      <Button onClick={addLifestyle} variant="outline" size="sm" className="h-10">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {lifestyle.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {lifestyle.map((item, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-sm py-1.5 px-3 flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            {item}
                            <X
                              className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                              onClick={() => removeLifestyle(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Options & Search Button */}
              <Card className="shadow-lg border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                      <Checkbox
                        id="new-ingredients"
                        checked={includeNewIngredients}
                        onCheckedChange={(checked) => setIncludeNewIngredients(checked as boolean)}
                      />
                      <label
                        htmlFor="new-ingredients"
                        className="text-sm font-medium leading-none cursor-pointer flex-1"
                      >
                        Include recipes with additional ingredients I don't have
                      </label>
                    </div>

                    <Button
                      onClick={handleSearch}
                      disabled={ingredients.length === 0 || isLoadingRecipes}
                      size="lg"
                      className="w-full bg-gradient-hero hover:opacity-90 transition-opacity h-12 text-base font-semibold"
                    >
                      {isLoadingRecipes ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Find Recipes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Form Summary when collapsed */}
              {showResults && !isFormExpanded && (
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-semibold text-muted-foreground">Search criteria:</span>
                      {ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ingredients.slice(0, 5).map((ing, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {ing}
                            </Badge>
                          ))}
                          {ingredients.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{ingredients.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                      {(dietaryRestrictions.length > 0 || healthRestrictions.length > 0 || lifestyle.length > 0) && (
                        <span className="text-xs text-muted-foreground">• Preferences applied</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {showResults && (
                <div className="space-y-4">
                  {apiRecipes.length > 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowResults(false);
                          setIsFormExpanded(true);
                          setApiRecipes([]);
                        }}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        New Search
                      </Button>
                    </div>
                  )}
                  {apiRecipes.length === 0 ? (
                    <Card className="p-12 text-center">
                      <p className="text-muted-foreground">No recipes found. Try adjusting your search criteria.</p>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {apiRecipes.map((recipe, index) => {
                        const recipeId = `recipe-${index}`;
                        const isSaved = isRecipeSaved(recipeId);
                        return (
                          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow border-2">
                            <div className="md:flex">
                              <img
                                src="/placeholder.svg"
                                alt={recipe.recipe_name}
                                className="w-full md:w-64 h-64 object-cover bg-muted"
                              />
                              <div className="flex-1">
                                <CardHeader>
                                  <CardTitle className="text-2xl">{recipe.recipe_name}</CardTitle>
                                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                                    <span>⏱️ {recipe.cooking_time}</span>
                                    <span>📊 {recipe.difficulty}</span>
                                  </div>
                                  {recipe.description && (
                                    <p className="text-muted-foreground mt-2">{recipe.description}</p>
                                  )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {/* Ingredients */}
                                  <div>
                                    <p className="text-sm font-semibold mb-2">Ingredients:</p>
                                    <div className="space-y-2">
                                      {recipe.ingredients.user_provided.length > 0 && (
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1">You have:</p>
                                          <div className="flex flex-wrap gap-2">
                                            {recipe.ingredients.user_provided.map((ing, i) => (
                                              <Badge key={i} variant="secondary" className="bg-green-50 dark:bg-green-950/30">
                                                {ing}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {recipe.ingredients.additional_needed.length > 0 && (
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1">Additional needed:</p>
                                          <div className="flex flex-wrap gap-2">
                                            {recipe.ingredients.additional_needed.map((ing, i) => (
                                              <Badge key={i} variant="outline" className="border-orange-300 text-orange-700 dark:text-orange-400">
                                                {ing}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Instructions */}
                                  {recipe.instructions && (
                                    <div>
                                      <p className="text-sm font-semibold mb-2">Instructions:</p>
                                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {recipe.instructions}
                                      </p>
                                    </div>
                                  )}

                                  {/* Health Tip */}
                                  {recipe.health_tip && (
                                    <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                          <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                          Health Tip
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                          {recipe.health_tip}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  )}

                                  <div className="flex gap-3 pt-2">
                                    <Button className="bg-gradient-hero">View Full Recipe</Button>
                                    <Button 
                                      variant={isSaved ? "default" : "outline"}
                                      onClick={() => {
                                        // Convert API recipe to saved recipe format
                                        const savedRecipe: Recipe = {
                                          id: recipeId,
                                          title: recipe.recipe_name,
                                          image: "/placeholder.svg",
                                          prepTime: recipe.cooking_time,
                                          calories: "",
                                          missingIngredients: recipe.ingredients.additional_needed,
                                        };
                                        saveRecipe(savedRecipe);
                                      }}
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
                  )}
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
