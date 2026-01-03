import React, { createContext, useContext, useState, useEffect } from "react";

interface UserHealthResponse {
    name: string;
}

interface UserProfileResponse {
    suscriptionPlan: string;
    plan: number;
    nationality?: string;
    ethnicity?: string;
    lifeStyleChoice?: string;
    image?: string;
    healthGoals: UserHealthResponse[];
    allergies: UserHealthResponse[];
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userProfile: UserProfileResponse | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async (token: string) => {
        try {
            // Using /users as requested
            const response = await fetch("https://localhost:5001/users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    setUser(json.data);
                    setIsAuthenticated(true);
                } else {
                    console.error("Failed to fetch profile:", json.error);
                    // If the token is invalid (implied by failed profile fetch on load), might want to logout
                    if (response.status === 401) {
                        logout();
                    }
                }
            } else {
                console.error("Failed to fetch profile");
                if (response.status === 401) {
                    logout();
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const refreshProfile = async () => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined" && token !== "null" && token.trim() !== "") {
            await fetchProfile(token);
        }
    };

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem("token");
        if (token && token !== "undefined" && token !== "null" && token.trim() !== "") {
            setIsAuthenticated(true);
            fetchProfile(token);
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setIsLoading(false);
    }, []);


    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        fetchProfile(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
