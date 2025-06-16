// src/pages/Home.jsx

import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

// FAQ Accordion Item
function FAQ({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b-2 border-black py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left font-bold text-sm"
            >
                {question}
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-700" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-700" />
                )}
            </button>

            {/* Animated Answer */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="overflow-hidden"
                    >
                        <p className="mt-4 text-sm font-normal text-gray-800 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Home() {
    return (
        <div className="font-sans">
            {/* First Section */}
            <section className="bg-white py-20 px-6 md:px-16">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">
                    {/* Text Content and Buttons */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-medium mb-4">
                            Take Control of Your Finances Today
                        </h1>
                        <p className="text-gray-800 mb-6 max-w-md">
                            FinTrackEasy empowers you to effortlessly track your expenses and manage
                            your budget. Experience financial freedom with our user-friendly app
                            designed for everyone.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/register">
                                <Button variant="submit" className="w-25">
                                    Sign Up
                                </Button>
                            </Link>
                            <Button variant="outline" className="border-2 border-black">
                                Learn More
                            </Button>
                        </div>
                    </div>

                    {/* Image on the Right */}
                    <div className="flex-1 flex justify-center md:justify-center">
                        <img src="/laptop.svg" alt="App Screenshot" className="w-full max-w-md" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                className="py-20 px-6 md:px-16 flex flex-col md:flex-row items-center"
                style={{
                    backgroundImage: `linear-gradient(to top right, rgba(62, 147, 65, 0.1) 50%, transparent 50%)`,
                    backgroundColor: "white",
                }}
            >
                <div className="w-full md:w-1/2 mb-10 md:mb-0">
                    <img
                        src="/vitaly-gariev.jpg"
                        alt="Woman with dog by window"
                        className="w-full h-100 object-cover rounded-lg shadow-md"
                    />
                </div>

                <div className="w-full md:w-1/2 md:pl-12">
                    <h2 className="text-2xl font-medium mb-4">
                        Empower Your Finances: Track, Budget, and Analyze with Ease
                    </h2>
                    <p className="text-gray-800 mb-6">
                        FinTrackEasy offers a seamless way to manage your finances. With features
                        like expense tracking and budget setting, you can take control of your
                        spending.
                    </p>
                    <ul className="space-y-2 text-sm font-medium text-gray-800">
                        <li className="flex items-start gap-2">
                            <img src="/check-mark.svg" alt="" className="w-5 h-5 mt-1" />
                            <span className="pt-1">
                                Track your expenses effortlessly and stay within budget.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <img src="/check-mark.svg" alt="" className="w-5 h-5 mt-1" />
                            <span className="pt-1">
                                Set personalized budgets to meet your financial goals.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <img src="/check-mark.svg" alt="" className="w-5 h-5 mt-1" />
                            <span className="pt-1">
                                Analyze spending trends to make informed financial decisions.
                            </span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Icon Feature Grid */}
            <section className="py-20 px-6 md:px-16">
                <h2 className="text-2xl font-semibold mb-12">
                    Effortless Tracking at Your Fingertips
                </h2>
                <div className="text-center grid md:grid-cols-3 gap-14">
                    {/* Feature 1 */}
                    <div>
                        <img
                            src="/box-open.svg"
                            alt="Take Control Icon"
                            className="w-10 h-10 mx-auto mb-4"
                        />
                        <h3 className="font-semibold mb-2">Take Control of Your Finances</h3>
                        <p className="mt-3 mb-3 text-gray-800 text-sm font-normal">
                            Stay informed about your spending habits and make smarter financial
                            decisions.
                        </p>
                        <p className="mt-auto flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer">
                            Learn More <ChevronRight className="w-4 h-4 text-gray-700 ml-1" />
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div>
                        <img
                            src="/trend-up.svg"
                            alt="Spending Trends Icon"
                            className="w-10 h-10 mx-auto mb-4"
                        />
                        <h3 className="font-semibold mb-2">Spot Spending Trends</h3>
                        <p className="mt-3 mb-3 text-gray-800 text-sm font-normal">
                            Compare your expenses over time to identify areas for improvement.
                        </p>
                        <p className="mt-auto flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer">
                            Learn More <ChevronRight className="w-4 h-4 text-gray-700 ml-1" />
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div>
                        <img
                            src="/user-heart-alt-1.svg"
                            alt="Budget with Ease Icon"
                            className="w-10 h-10 mx-auto mb-4"
                        />
                        <h3 className="font-semibold mb-2">Budget with Ease</h3>
                        <p className="mt-3 mb-3 text-gray-800 text-sm font-normal">
                            Enjoy a seamless experience that makes budgeting and tracking
                            effortless.
                        </p>
                        <Link to="/register">
                            <p className="mt-auto flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer">
                                Sign Up <ChevronRight className="w-4 h-4 text-gray-700 ml-1" />
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="bg-[#F7F8F9] py-16 px-6 text-center">
                {/* Testimonial text */}
                <blockquote className="text-lg font-semibold max-w-xl mx-auto mb-6">
                    "FinTrackEasy has transformed the way I manage my finances. It’s so easy to use
                    and has helped me stay on budget!"
                </blockquote>

                {/* Profile block */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-left max-w-md mx-auto">
                    <img
                        src="/look-studio.jpg"
                        alt="Jane Doe"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-sm text-black">Jane Doe</p>
                        <p className="text-sm text-gray-800">Finance Manager, ABC Corp</p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-600 mx-2"></div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section
                className="py-20 px-6 md:px-16 grid md:grid-cols-2 gap-12 items-start"
                style={{
                    backgroundImage: `linear-gradient(to top left, rgba(62, 147, 65, 0.1) 50%, transparent 50%)`,
                    backgroundColor: "white",
                }}
            >
                {/* Left Column */}
                <div>
                    <h2 className="text-3xl font-semibold mb-4">FAQs</h2>
                    <p className="font-normal text-gray-800 mb-6">
                        Discover answers to your questions about FinTrackEasy and enhance your
                        budgeting experience.
                    </p>
                    <Link to="/contact">
                        <Button variant="outline" className="border-2 border-black h-8">
                            Contact
                        </Button>
                    </Link>
                </div>

                {/* Right Accordion List */}
                <div>
                    <div className="w-full h-[2px] bg-black" />
                    <FAQ
                        question="How does it work?"
                        answer="FinTrackEasy simplifies expense tracking by allowing users to input their spending easily. The app categorizes expenses and provides insights into spending habits."
                    />
                    <FAQ
                        question="Is it really free?"
                        answer="Yes, FinTrackEasy is completely free to use. There are no hidden fees or subscriptions required. We believe in empowering users without financial barriers."
                    />
                    <FAQ
                        question="Can I set budgets?"
                        answer="Absolutely! The app allows you to set personalized budgets for different categories. You can easily track your progress and adjust as needed to stay on target."
                    />
                    <FAQ
                        question="Is my data secure?"
                        answer="We prioritize your privacy and security. All data is encrypted and stored securely. You can trust that your financial information is safe with us."
                    />
                    <FAQ
                        question="What platforms is it on?"
                        answer="FinTrackEasy is available on both iOS and Android devices. You can also access it via a web browser. Enjoy seamless tracking across all your devices."
                    />
                </div>
            </section>
        </div>
    );
}
