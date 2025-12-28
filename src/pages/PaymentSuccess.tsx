import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();

    useEffect(() => {
        // Refresh profile to update subscription status
        refreshProfile();
    }, [refreshProfile]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="bg-card border shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Payment Successful!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your purchase. Your account has been upgraded to Pro.
                    </p>
                </div>

                <Button
                    className="w-full bg-gradient-hero"
                    onClick={() => navigate("/dashboard")}
                >
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
