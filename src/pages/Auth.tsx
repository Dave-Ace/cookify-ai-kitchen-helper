import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { toast } from "@/hooks/use-toast";

import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Auth logic will be implemented when backend is connected
    console.log("Handling Submit");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");

    // Determine if this is a signup or signin form
    const isSignUp = firstname !== null && lastname !== null;
    const baseUrl = "https://localhost:5001/users";
    const endpoint = isSignUp ? `${baseUrl}/register` : `${baseUrl}/login`;
    const successMessage = isSignUp ? "Account created successfully!" : "Signed in successfully!";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignUp ? { email, password, firstname, lastname } : { email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An error occurred" }));
        throw new Error(errorData.message || `${isSignUp ? "Registration" : "Login"} failed`);
      }

      // The API returns a plain string token, not JSON
      const token = await response.text();

      // Remove quotes from the token string if present
      const cleanToken = token.trim().replace(/^["']|["']$/g, "");
      console.log(token);
      console.log(cleanToken);
      // Store the token string in localStorage
      if (cleanToken && cleanToken !== "") {
        login(cleanToken);
      } else {
        throw new Error("No token received from server");
      }

      console.log("Logged in successfully");

      // Show success toast
      toast({
        title: "Success",
        description: successMessage,
        variant: "default",
      });

      // Switch to signin tab after successful registration
      if (isSignUp) {
        setActiveTab("signin");
      } else {
        // Redirect to dashboard after successful sign in
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("Google Auth Success:", credentialResponse);
    // TODO: Send credentialResponse.credential to backend
    // const response = await fetch("https://localhost:5001/api/auth/google", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ idToken: credentialResponse.credential }),
    // });
    toast({
      title: "Google Auth",
      description: "Google Sign-In successful (Backend integration pending)",
      variant: "default",
    });
  };

  const handleGoogleError = () => {
    console.log("Google Auth Failed");
    toast({
      title: "Error",
      description: "Google Sign-In failed",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <NavLink to="/" className="inline-flex items-center gap-2 mb-4">
            <ChefHat className="w-12 h-12 text-primary" />
            <span className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Cookify
            </span>
          </NavLink>
          <p className="text-muted-foreground">Start your culinary journey today</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Start your 7-day free trial with 4 recipes per day
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname">First Name</Label>
                    <Input
                      id="signup-firstname"
                      name="firstname"
                      type="text"
                      placeholder="John"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname">Last Name</Label>
                    <Input
                      id="signup-lastname"
                      name="lastname"
                      type="text"
                      placeholder="Doe"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}

                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      width="100%"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signin">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to continue creating amazing recipes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  <a href="#" className="text-sm text-center text-primary hover:underline">
                    Forgot your password?
                  </a>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      width="100%"
                    />
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

export default Auth;
