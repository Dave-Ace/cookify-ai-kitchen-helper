import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose dark:prose-invert max-w-none space-y-4">
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p>
                            At SousAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.
                        </p>
                        <p>
                            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                        </p>
                        <h2 className="text-2xl font-semibold mt-6">Data We Collect</h2>
                        <p>
                            We collect information that you provide directly to us, such as when you create an account, update your profile, or use our AI recipe generation features. This may include your name, email address, dietary preferences, and generated recipe history.
                        </p>
                    </div>
                    <h2 className="text-2xl font-semibold mt-6">How We Use Your Data</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, including personalization of recipe suggestions based on your preferences and nationality.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Privacy;
