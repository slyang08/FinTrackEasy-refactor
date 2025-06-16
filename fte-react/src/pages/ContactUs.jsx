// src/pages/ContactUs.jsx
import { useState } from "react";

import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        description: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckbox = (checked) => {
        setFormData((prev) => ({ ...prev, acceptedTerms: checked }));
    };

    const handleClear = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            description: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/contact", formData);
            alert("Message sent!");
            handleClear();
        } catch (err) {
            alert(
                err.response?.data?.message || err.response?.data?.error || "Failed to send message"
            );
        }
    };

    return (
        <div className="min-h-screen bg-white flex justify-center items-center px-4">
            <div className="max-w-5xl w-full bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left Side - Contact Info */}
                <div className="bg-gray-100 pt-20 p-8">
                    <p className="text-medium font-semibold text-gray-800 mb-2">Connect</p>
                    <h2 className="text-5xl font-semibold mb-4">Get in Touch</h2>
                    <p className="text-gray-700 mb-6">
                        We’re here to help you with your inquiries.
                    </p>
                    <div className="space-y-4 text-base text-gray-800">
                        <p className="flex items-center gap-3">
                            <img src="/envelope.svg" alt="Email icon" width={22} height={22} />
                            <a href="mailto:email@example.com" className="underline">
                                email@example.com
                            </a>
                        </p>
                        <p className="flex items-center gap-3">
                            <img src="/phone.svg" alt="Phone icon" width={22} height={22} />
                            <a href="tel:+15550000000" className="underline">
                                +1 (555) 000–0000
                            </a>
                        </p>
                        <p className="flex items-center gap-3">
                            <img src="/location.svg" alt="Location icon" width={22} height={22} />
                            123 Sample St, Canada, ON
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <form onSubmit={handleSubmit} className="pt-20 p-8 space-y-4 pb-20">
                    <div>
                        <Label
                            htmlFor="name"
                            className="w-full text-[#060B06] text-sm font-normal leading-6 font-poppins break-words"
                        >
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border-2 border-black"
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="email"
                            className="w-full text-[#060B06] text-sm font-normal leading-6 font-poppins break-words"
                        >
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border-2 border-black"
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="message"
                            className="w-full text-[#060B06] text-sm font-normal leading-6 font-poppins break-words"
                        >
                            Message
                        </Label>
                        <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type your message..."
                            rows={6}
                            required
                            className="border-2 border-black min-h-[150px] h-[150px]"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={formData.acceptedTerms}
                            onCheckedChange={handleCheckbox}
                            className="border-2 border-black"
                        />
                        <Label
                            htmlFor="terms"
                            className="w-full text-[#060B06] text-sm font-normal leading-6 font-poppins break-words"
                        >
                            I accept the Terms & Conditions
                        </Label>
                    </div>

                    <Button size="sm" type="submit" variant="submit">
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
}
