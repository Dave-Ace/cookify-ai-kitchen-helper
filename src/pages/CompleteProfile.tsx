import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ChefHat } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Pricing from "@/components/Pricing";

// Predefined options
const LIFESTYLE_OPTIONS = [
    "Active",
    "Sedentary",
    "Moderate Activity",
    "Athlete",
    "Busy Professional",
    "Vegan",
    "Vegetarian",
    "Pescatarian",
    "Keto",
    "Paleo",
    "Mediterranean",
    "Gluten-Free"
];

const HEALTH_GOALS_OPTIONS = [
    "Weight Loss",
    "Muscle Gain",
    "Maintain Weight",
    "Improve Energy",
    "Heart Health",
    "Reduce Sugar",
    "Eat More Veggies"
];

const ALLERGY_OPTIONS = [
    "Peanuts",
    "Tree Nuts",
    "Dairy",
    "Gluten",
    "Eggs",
    "Soy",
    "Shellfish",
    "Fish"
];

export default function CompleteProfile() {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPricing, setShowPricing] = useState(false);

    // Form State
    const [nationality, setNationality] = useState("");
    const [ethnicity, setEthnicity] = useState("");
    const [lifestyle, setLifestyle] = useState("");
    const [healthGoals, setHealthGoals] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);

    const toggleHealthGoal = (goal: string) => {
        setHealthGoals(prev =>
            prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
        );
    };

    const toggleAllergy = (allergy: string) => {
        setAllergies(prev =>
            prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        if (!lifestyle) {
            toast({
                title: "Missing Information",
                description: "Please select a lifestyle choice.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const payload = {
                firstName: user.firstName,
                lastName: user.lastName,
                profile: {
                    nationality,
                    ethnicity,
                    lifeStyleChoice: lifestyle,
                    healthGoals: healthGoals.map(name => ({ name })),
                    allergies: allergies.map(name => ({ name }))
                }
            };

            const response = await fetch("https://localhost:5001/upate-profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            await refreshProfile();

            toast({
                title: "Profile Completed!",
                description: "Your kitchen is ready.",
                variant: "default"
            });

            toast({
                title: "Profile Completed!",
                description: "Your kitchen is ready.",
                variant: "default"
            });

            setShowPricing(true);

        } catch (error) {
            console.error("Profile update error:", error);
            toast({
                title: "Error",
                description: "Could not update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg border-2">
                <CardHeader className="text-center pb-8 border-b bg-muted/20">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <ChefHat className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Complete Your Profile</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Tell us a bit about yourself so we can personalize your recipes.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input
                                    id="nationality"
                                    placeholder="e.g. Italian"
                                    value={nationality}
                                    onChange={e => setNationality(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ethnicity">Ethnicity</Label>
                                <Input
                                    id="ethnicity"
                                    placeholder="e.g. Hispanic"
                                    value={ethnicity}
                                    onChange={e => setEthnicity(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Lifestyle */}
                        <div className="space-y-3">
                            <Label>Lifestyle Choice <span className="text-red-500">*</span></Label>
                            <Select value={lifestyle} onValueChange={setLifestyle}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your lifestyle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LIFESTYLE_OPTIONS.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Health Goals */}
                        <div className="space-y-3">
                            <Label>Health Goals</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {HEALTH_GOALS_OPTIONS.map(goal => (
                                    <div key={goal} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`goal-${goal}`}
                                            checked={healthGoals.includes(goal)}
                                            onCheckedChange={() => toggleHealthGoal(goal)}
                                        />
                                        <label
                                            htmlFor={`goal-${goal}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {goal}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Allergies */}
                        <div className="space-y-3">
                            <Label>Allergies & Intolerances</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {ALLERGY_OPTIONS.map(allergy => (
                                    <div key={allergy} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`allergy-${allergy}`}
                                            checked={allergies.includes(allergy)}
                                            onCheckedChange={() => toggleAllergy(allergy)}
                                        />
                                        <label
                                            htmlFor={`allergy-${allergy}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {allergy}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full bg-gradient-hero" size="lg" disabled={isLoading}>
                                {isLoading ? "Saving Profile..." : "Complete Setup"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showPricing} onOpenChange={setShowPricing}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-center">Upgrade Your Kitchen AI</DialogTitle>
                        <DialogDescription className="text-center">
                            Get the most out of Cookify with our Pro plan.
                        </DialogDescription>
                    </DialogHeader>

                    <Pricing
                        minimal
                        onPlanSelect={async (planId) => {
                            if (planId === 1) { // Free Trial
                                navigate("/dashboard");
                            } else if (planId === 2) { // Pro
                                try {
                                    const token = localStorage.getItem("token");
                                    const response = await fetch("https://localhost:5001/upgrade-user-plan", {
                                        method: "POST",
                                        headers: {
                                            "Authorization": `Bearer ${token}`,
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({ plan: planId })
                                    });

                                    if (!response.ok) {
                                        throw new Error("Failed to upgrade plan");
                                    }

                                    await refreshProfile();

                                    toast({
                                        title: "Welcome to Pro!",
                                        description: "Your account has been upgraded.",
                                        variant: "default"
                                    });

                                    navigate("/dashboard");

                                } catch (error) {
                                    console.error("Upgrade error:", error);
                                    toast({
                                        title: "Upgrade Failed",
                                        description: "Could not process upgrade. Please try again.",
                                        variant: "destructive"
                                    });
                                }
                            }
                        }}
                    />

                    <DialogFooter className="sm:justify-center">
                        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                            No thanks, continue to dashboard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
