import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-24 max-w-2xl">
                <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
                <p className="text-muted-foreground text-center mb-12">
                    Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                        <Input id="subject" placeholder="How can we help?" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                        <Textarea
                            id="message"
                            placeholder="Tell us more..."
                            className="min-h-[150px]"
                        />
                    </div>

                    <Button className="w-full bg-gradient-hero" size="lg">Send Message</Button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
