import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChefHat, User, LogOut, ArrowLeft, Globe, Flag, Activity, AlertCircle, Bell, Mail, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import Pricing from "@/components/Pricing";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";


const Profile = () => {
    const { user, logout, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <Card className="border-2 shadow-lg">
                        <CardHeader className="text-center pb-2">
                            <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center relative">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={user?.userProfile?.image || ""} />
                                    <AvatarFallback className="text-3xl bg-gradient-hero text-transparent bg-clip-text font-bold">
                                        {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                {user?.userProfile?.suscriptionPlan === "Pro" && (
                                    <span className="absolute -bottom-1 -right-1 bg-gradient-hero text-white text-xs font-bold px-2 py-1 rounded-full shadow-md border-2 border-background">
                                        PRO
                                    </span>
                                )}
                            </div>
                            <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                                {user ? `${user.firstName} ${user.lastName}` : "Chef"}
                            </CardTitle>
                            <CardDescription>{user?.email || "cook@example.com"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {user?.userProfile && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                        <Globe className="w-4 h-4 text-primary" />
                                        <span className="text-muted-foreground">Nationality:</span>
                                        <span className="font-medium ml-auto">{user.userProfile.nationality || "Not set"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                        <Flag className="w-4 h-4 text-primary" />
                                        <span className="text-muted-foreground">Ethnicity:</span>
                                        <span className="font-medium ml-auto">{user.userProfile.ethnicity || "Not set"}</span>
                                    </div>
                                </div>
                            )}

                            {/* Allergies & Goals Section */}
                            {(user?.userProfile?.allergies?.length > 0 || user?.userProfile?.healthGoals?.length > 0) && (
                                <div className="space-y-4">
                                    {user.userProfile.allergies?.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <AlertCircle className="w-4 h-4" />
                                                Allergies
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {user.userProfile.allergies.map((allergy, idx) => (
                                                    <span key={idx} className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium dark:bg-red-900/30 dark:text-red-400">
                                                        {allergy.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {user.userProfile.healthGoals?.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <Activity className="w-4 h-4" />
                                                Health Goals
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {user.userProfile.healthGoals.map((goal, idx) => (
                                                    <span key={idx} className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium dark:bg-green-900/30 dark:text-green-400">
                                                        {goal.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid gap-4 mt-6">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <ChefHat className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{user?.userProfile?.suscriptionPlan || "Free Plan"}</p>
                                            <p className="text-sm text-muted-foreground">1 prompt/week</p>
                                        </div>
                                    </div>
                                    <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">Upgrade</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
                                            <Pricing
                                                minimal
                                                onPlanSelect={async (planId) => {
                                                    if (planId === 2) { // Pro
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

                                                            setIsUpgradeDialogOpen(false); // Close dialog

                                                            toast({
                                                                title: "Upgraded to Pro!",
                                                                description: "Your subscription has been updated successfully.",
                                                                variant: "default"
                                                            });

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
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="space-y-1 rounded-lg border p-4">
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Bell className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-medium">Push Notifications</p>
                                                <p className="text-sm text-muted-foreground">Receive daily recipe ideas</p>
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">Weekly meal plan summary</p>
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="flex items-center justify-between py-2 pt-4 mt-2 border-t">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <HelpCircle className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Help & Support</p>
                                                <p className="text-sm text-muted-foreground">FAQs and customer service</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Account Settings</p>
                                            <p className="text-sm text-muted-foreground">Manage your account details</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                            </div>

                            <div className="pt-6 border-t flex justify-center">
                                <Button
                                    variant="destructive"
                                    className="w-full sm:w-auto min-w-[200px]"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
