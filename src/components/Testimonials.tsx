import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

const Testimonials = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch("https://localhost:5001/reviews");
                if (response.ok) {
                    const json = await response.json();
                    if (json.success) {
                        setReviews(json.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading || reviews.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Loved by Home Chefs</h2>
                    <p className="text-muted-foreground text-lg">
                        See what our community is cooking up with SousAI.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.slice(0, 3).map((review) => (
                        <Card key={review.id} className="border-none shadow-md bg-background/50 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? "fill-orange-500 text-orange-500" : "text-muted-foreground/20"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="mb-6 relative">
                                    <Quote className="w-8 h-8 text-primary/10 absolute -top-2 -left-2 transform -scale-x-100" />
                                    <p className="text-muted-foreground relative z-10 italic">"{review.comment}"</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold text-sm">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{review.userName}</div>
                                        <div className="text-xs text-muted-foreground">Verified User</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
