import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose dark:prose-invert max-w-none space-y-4">
                    <p>Last updated: December 31, 2025</p>
                    <p>
                        Please read these Terms of Service completely using SousAI which is owned and operated by SousAI Inc. This Agreement documents the legally binding terms and conditions attached to the use of the Site at sousai.ai.
                    </p>
                    <h2 className="text-2xl font-semibold mt-6">Acceptance of Terms</h2>
                    <p>
                        By using or accessing the Site in any way, viewing or browsing the Site, or adding your own content to the Site, you are agreeing to be bound by these Terms of Service.
                    </p>
                    <h2 className="text-2xl font-semibold mt-6">Usage Limits</h2>
                    <p>
                        Free trial users are limited to 1 AI recipe query per day. Pro users enjoy unlimited queries. Abuse of the API or automated scraping is strictly prohibited.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
