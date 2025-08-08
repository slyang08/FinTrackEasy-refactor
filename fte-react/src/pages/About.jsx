import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function About() {
    const TeamCard = ({ member, large = false }) => (
        <div
            className={`flex flex-col items-center text-center ${
                large ? "w-[616px] h-[249px]" : "w-[394.67px] h-[273px]"
            }`}
        >
            {/* Avatar */}
            <div className="mb-4">
                <img
                    src="/user-icon.svg"
                    alt={member.name}
                    className="w-[64px] h-[64px] rounded-full object-cover mx-auto"
                />
            </div>

            {/* Name (linked if GitHub is provided) */}
            {member.github ? (
                <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[20px] leading-[32px] font-bold font-poppins text-[#060B06] mb-1 underline"
                >
                    {member.name}
                </a>
            ) : (
                <h3 className="text-[18px] leading-[30px] font-bold font-poppins text-[#060B06] mb-1">
                    {member.name}
                </h3>
            )}

            {/* Role */}
            <p className="text-[16px] leading-[18px] text-[#4B5563] font-medium font-poppins mb-4">
                {member.role}
            </p>

            {/* Bio */}
            <p
                className={`text-[16px] leading-[22px] text-[#4B5563] font-normal font-poppins mb-4 ${
                    large ? "max-w-[520px]" : "max-w-[394.67px]"
                }`}
            >
                {member.desc}
            </p>

            {/* Social Icons */}
            <div className="flex gap-2">
                <img src="/LinkedIn.png" alt="LinkedIn" className="w-6 h-6" />
                <img src="/X.png" alt="X" className="w-6 h-6" />
                <img src="/Dribble.png" alt="Dribble" className="w-6 h-6" />
            </div>
        </div>
    );

    return (
        <div className="font-sans">
            {/* Mission Section */}
            <section
                className="w-full px-16"
                style={{
                    paddingTop: "146px",
                    paddingBottom: "152px",
                }}
            >
                <div className="text-center max-w-3xl mx-auto">
                    <h4 className="text-xl text-gray-800 font-semibold mb-2">About Us</h4>
                    <h1 className="text-5xl font-medium mb-4">Our Financial Mission</h1>
                    <p className="text-[16px] text-gray-800 leading-[27px] mb-6">
                        At FinTrackEasy, we strive to simplify budgeting and expense tracking for
                        everyone,
                        <br></br>regardless of their background.
                    </p>
                    <Link to="/register">
                        <Button
                            variant="submit"
                            className="w-[144px] h-[44px] bg-[#348D37] hover:bg-[#2e7e31] text-white font-medium text-[16px] leading-[24px] font-poppins"
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Our Journey Section */}
            <section
                className="bg-[#ECF5EC] w-full flex"
                style={{
                    paddingTop: "100px",
                    paddingBottom: "100px",
                }}
            >
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-[6px]">
                    {/* Image */}
                    <div className="w-[480px] h-[490px] flex-shrink-0">
                        <img
                            src="/lady-with-laptop-and-coffee.jpg"
                            alt="Laptop user with coffee"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>

                    {/* Text and Button Container */}
                    <div className="w-[600px] h-[315px] flex flex-col justify-between px-16">
                        {/* Heading */}
                        <h2 className="text-4xl font-medium leading-[46px] font-semibold text-[#060B06] font-sans">
                            Our Journey to Financial Empowerment
                        </h2>

                        {/* Description */}
                        <p className="text-[16px] text-gray-900 leading-[27px] text-[#060B06] font-sans">
                            FinTrackEasy was born from a desire to simplify personal finance
                            management. Our goal is to provide an accessible platform that empowers
                            users to take control of their financial health, free of charge.
                        </p>

                        {/* Join Us Button */}
                        <Link to="/register">
                            <Button
                                variant="outline"
                                className="w-[106px] h-[44px] bg-transparent hover:bg-[#e2ffe2] font-poppins text-[16px] font-medium rounded-[12px] border-2 border-black"
                            >
                                Join Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section
                className="bg-white w-full px-[64px]"
                style={{
                    paddingTop: "60px",
                    paddingBottom: "60px",
                }}
            >
                <div className="max-w-[1090px] mx-auto flex flex-col md:flex-row items-center gap-[12px]">
                    {/* Left: Text Content */}
                    <div className="w-[500px] flex flex-col gap-[28px]">
                        {/* Heading + Paragraph */}
                        <div>
                            <h3 className="text-4xl leading-[42px] tracking-[-0.01em] font-medium text-[#060B06] mb-[24px] font-mulish">
                                Unlock Your Financial Potential with FinTrackEasy's User-Friendly
                                Budgeting Tools
                            </h3>
                            <p className="text-[16px] text-gray-900 leading-[24px] mt-8 text-[#060B06] font-sans">
                                FinTrackEasy empowers you to take control of your finances
                                effortlessly. Track your expenses and manage your budget with ease,
                                all in one place.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="flex flex-col gap-[32px]">
                            <div className="flex gap-[25px]">
                                {/* Card 1 */}
                                <div className="w-[288px] flex flex-col gap-[16px]">
                                    <img src="/thumbs-up.svg" alt="" className="w-10 h-10 mt-1" />
                                    <div>
                                        <h6 className="text-[18px] leading-[32px] tracking-[-0.01em] font-semibold text-[#060B06] font-mulish">
                                            Easy Tracking
                                        </h6>
                                        <p className="text-[16px] text-[#4B5563] leading-[24px] mt-2 font-poppins">
                                            Monitor your spending habits and gain insights into your
                                            financial behavior.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="w-[275px] flex flex-col gap-[16px]">
                                    <img src="/wallet.svg" alt="" className="w-10 h-10 mt-1" />
                                    <div>
                                        <h6 className="text-[18px] leading-[32px] tracking-[-0.01em] font-semibold text-[#060B06] font-mulish">
                                            Budgeting Made Simple
                                        </h6>
                                        <p className="text-[16px] text-[#4B5563] leading-[24px] mt-2 font-poppins">
                                            Set realistic budgets and receive reminders to stay on
                                            track with your goals.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="w-[550px] h-[580px] flex-shrink-0">
                        <img
                            src="/budgeting-tools.png"
                            alt="Budgeting illustration"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Our Team Section */}
            <section className="bg-[#F7F8F9] w-full py-[112px] px-[64px]">
                <div className="max-w-[1045px] mx-24 text-center">
                    {/* Heading */}
                    <h2
                        className="text-4xl leading-[57px] tracking-[-0.01em] font-medium font-mulish text-[#060B06] mb-[12px]"
                        style={{ width: "768px", marginLeft: "auto", marginRight: "auto" }}
                    >
                        Our Team
                    </h2>

                    {/* Subheading */}
                    <p
                        className="text-[18px] leading-[27px] font-normal font-poppins text-gray-800 mb-[80px]"
                        style={{ width: "768px", marginLeft: "auto", marginRight: "auto" }}
                    >
                        Meet the passionate individuals behind FinTrackEasy.
                    </p>

                    {/* Row 1 – 3 Members */}
                    <div className="flex justify-center gap-x-[24px] mb-[24px]">
                        {[
                            {
                                name: "Carrie Leung",
                                role: "CEO & Founder",
                                desc: "Carrie is dedicated to making financial management accessible for everyone.",
                                github: "https://github.com/cleung66",
                            },
                            {
                                name: "Sheng-Lin Yang",
                                role: "CTO",
                                desc: "Yang leads the tech team to ensure a seamless user experience.",
                                github: "https://github.com/slyang08",
                            },
                            {
                                name: "Aaron Liu",
                                role: "Marketing Director",
                                desc: "Aaron crafts our messaging to resonate with our users’ needs.",
                                github: "https://github.com/01al27",
                            },
                        ].map((member) => (
                            <TeamCard key={member.name} member={member} />
                        ))}
                    </div>

                    {/* Row 2 – 2 Wider Members */}
                    <div className="flex justify-center gap-x-[16px]">
                        {[
                            {
                                name: "Wing Ho Chau",
                                role: "Finance Advisor",
                                desc: "Wing provides insights to enhance our users' financial literacy.",
                                github: "https://github.com/whchau1",
                            },
                            {
                                name: "Tracy Tran",
                                role: "Product Designer",
                                desc: "Tracy ensures our app is intuitive and user-friendly.",
                                github: "https://github.com/trantracy",
                            },
                        ].map((member) => (
                            <TeamCard key={member.name} member={member} large />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
