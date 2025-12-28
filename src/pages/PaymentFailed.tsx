import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentFailed = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="bg-card border shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Payment Failed</h1>
                    <p className="text-muted-foreground">
                        Something went wrong with your transaction. No charges were made.
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        variant="default"
                        className="w-full"
                        onClick={() => navigate("/profile")}
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/dashboard")}
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
