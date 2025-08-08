// src/pages/Home.jsx
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import FAQ from "@/components/FAQ";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="font-sans">
            {/* First Section */}
            <section className="relative w-full h-[550px] bg-white py-30 px-46">
                <div className="flex justify-between items-center mx-auto max-w-6xl">
                    {/* Left Content */}
                    <div className="flex flex-col flex-1">
                        <h1 className="text-5xl font-medium mb-8 -mt-8">
                            Take Control of Your Finances Today
                        </h1>
                        <p className="text-[16px] text-gray-800 mb-8 w-[450px]">
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

                    {/* Right Image */}
                    <div className="flex-1 flex justify-center -ml-30">
                        <img
                            src="/Macbook-Pro.png"
                            alt="App Screenshot"
                            className="w-[536px] h-[340px]"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 px-6 md:px-30 flex flex-col md:flex-row items-center bg-white overflow-visible">
                {/* Background green triangle on left, overlapping upwards */}
                <div
                    style={{
                        position: "absolute",
                        top: "-100px", // move up to overlap first section
                        left: 0, // align to left side
                        height: "825px", // enough height for overlap + own section
                        width: "100%", // control width of triangle
                        backgroundColor: "rgba(62, 147, 65, 0.1)",
                        clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                        zIndex: 0,
                    }}
                />

                {/* Content with higher stacking */}
                <div className="relative flex flex-col md:flex-row w-full z-10 mt-10">
                    {/* Image */}
                    <div className="w-full md:w-1/2 mb-10 -mt-10 md:mb-0 flex justify-center">
                        <img
                            src="/vitaly-gariev.png"
                            alt="Woman with dog by window"
                            className="w-[480px] h-[490px] object-cover shadow-md"
                        />
                    </div>

                    {/* Text content */}
                    <div className="w-full md:w-[475px] h-[400px] px-6 md:px-0 mt-10">
                        <h2 className="text-[35px] leading-[40px] font-medium mb-8">
                            Empower Your Finances: Track, Budget, and Analyze with Ease
                        </h2>
                        <p className="text-[16px] text-gray-800 mb-8">
                            FinTrackEasy offers a seamless way to manage your finances. With
                            features like expense tracking and budget setting, you can take control
                            of your spending.
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
                </div>
            </section>

            {/* Icon Feature Grid */}
            <section className="py-45 ml-30 pb-30 mr-35 md:px-16">
                <h2 className="text-4xl font-medium mb-12">
                    Effortless Tracking at Your Fingertips
                </h2>
                <div className="text-center grid md:grid-cols-3 gap-10">
                    {/* Feature 1 */}
                    <div>
                        <img
                            src="/box-open.svg"
                            alt="Take Control Icon"
                            className="w-15 h-15 mx-auto mb-4"
                        />
                        <h3 className="text-[18px] font-semibold mb-2">
                            Take Control of Your Finances
                        </h3>
                        <p className="mt-3 mb-6 text-gray-800 text-[16px] font-normal">
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
                            className="w-15 h-15 mx-auto mb-4"
                        />
                        <h3 className="text-[18px] font-semibold mb-2">Spot Spending Trends</h3>
                        <p className="mt-3 mb-3 text-gray-800 text-[16px] font-normal">
                            Compare your expenses over time to identify areas for improvement.
                        </p>
                        <p className="mt-6 flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer">
                            Learn More <ChevronRight className="w-4 h-4 text-gray-700 ml-1" />
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div>
                        <img
                            src="/user-heart-alt-1.svg"
                            alt="Budget with Ease Icon"
                            className="w-15 h-15 mx-auto mb-4"
                        />
                        <h3 className="text-[18px] font-semibold mb-2">Budget with Ease</h3>
                        <p className="mt-3 mb-6 text-gray-800 text-[16px] font-normal">
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
            <section className="bg-[#F7F8F9] py-25 px-6 pb-25 text-center">
                {/* Testimonial text */}
                <blockquote className="text-[20px] font-semibold max-w-xl mx-auto mb-6">
                    "FinTrackEasy has transformed the way I manage my finances. It’s so easy to use
                    and has helped me stay on budget!"
                </blockquote>

                {/* Profile block */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-left max-w-md mx-auto">
                    <img
                        src="/look-studio.jpg"
                        alt="Jane Doe"
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-[17px] text-black">Jane Doe</p>
                        <p className="text-[16px] text-gray-800">Finance Manager, ABC Corp</p>
                    </div>
                    <div className="hidden sm:block w-[2.5px] h-13 bg-gray-500 mx-2"></div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section
                className="py-30 pb-35 px-6 ml-30 md:px-16 grid md:grid-cols-2 items-start"
                style={{
                    backgroundImage: `linear-gradient(to top left, rgba(62, 147, 65, 0.1) 50%, transparent 50%)`,
                    backgroundColor: "white",
                }}
            >
                {/* Left Column */}
                <div className="mr-40 pr-5">
                    <h2 className="text-4xl font-semibold mb-6">FAQs</h2>
                    <p className="text-[16px] text-gray-800 mb-6">
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
                <div className="mr-30 -ml-25">
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
                        answer="FinTrackEasy is currently available on the web. We are working on getting our services up and running on both iOS and Android devices, so stay tuned!"
                    />
                </div>
            </section>
        </div>
    );
}
