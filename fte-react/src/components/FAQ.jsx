// src/components/FAQ.jsx
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// FAQ Accordion Item
export default function FAQ({ question, answer }) {
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
