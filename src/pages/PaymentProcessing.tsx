import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const PaymentProcessing = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { refreshProfile } = useAuth();
    const reference = searchParams.get("reference");
    const [viewState, setViewState] = useState<"verifying" | "success" | "error" | "processing">("verifying");
    const [statusMessage, setStatusMessage] = useState("Please wait while we verify your transaction...");

    useEffect(() => {
        if (!reference) {
            toast({
                title: "Invalid Request",
                description: "No payment reference found.",
                variant: "destructive"
            });
            navigate("/dashboard");
            return;
        }

        const verifyPayment = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://localhost:5001/subscriptions/verify-payment?reference=${reference}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const responseData = await response.json();
                console.log("Verification response:", responseData);

                if (!response.ok || !responseData.success) {
                    throw new Error(responseData.error || "Verification request failed");
                }

                const data = responseData.data;

                if (data.status === "success") {
                    setViewState("success");
                    setStatusMessage("Payment verified successfully!");
                    await refreshProfile();
                    toast({
                        title: "Payment Successful",
                        description: "Your subscription has been upgraded.",
                        variant: "default"
                    });
                    setTimeout(() => navigate("/profile"), 5000);
                } else if (["abandoned", "failed", "reversed"].includes(data.status)) {
                    setViewState("error");
                    setStatusMessage(`Payment ${data.status}. No charges were made.`);
                    toast({
                        title: "Payment Failed",
                        description: `Payment status: ${data.status}`,
                        variant: "destructive"
                    });
                    setTimeout(() => navigate("/profile"), 5000);
                } else {
                    // pending, processing, queued, ongoing
                    setViewState("processing");
                    setStatusMessage(`Payment is ${data.status}. Checking again shortly...`);
                    toast({
                        title: "Payment Processing",
                        description: `Current status: ${data.status}. Please check back later.`,
                        variant: "default"
                    });
                    setTimeout(() => navigate("/profile"), 5000);
                }

            } catch (error) {
                console.error("Verification error:", error);
                setViewState("error");
                setStatusMessage("Could not verify payment status.");
                toast({
                    title: "Verification Error",
                    description: error instanceof Error ? error.message : "Could not verify payment status. Please contact support.",
                    variant: "destructive"
                });
                setTimeout(() => navigate("/profile"), 5000);
            }
        };

        verifyPayment();
    }, [reference, navigate, toast, refreshProfile]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="bg-card border shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${viewState === "success" ? "bg-green-100 dark:bg-green-900/30" :
                    viewState === "error" ? "bg-red-100 dark:bg-red-900/30" :
                        "bg-primary/10"
                    }`}>
                    {viewState === "success" ? (
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    ) : viewState === "error" ? (
                        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    ) : (
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        {viewState === "success" ? "Payment Successful" :
                            viewState === "error" ? "Payment Failed" :
                                "Processing Payment"}
                    </h1>
                    <p className="text-muted-foreground">
                        {statusMessage}
                    </p>
                    {reference && (
                        <p className="text-xs text-muted-foreground font-mono bg-muted p-1 rounded inline-block">
                            Ref: {reference}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentProcessing;
