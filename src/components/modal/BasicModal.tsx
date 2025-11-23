"use client";

import React, { ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({
    isOpen,
    onClose,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", onKeyDown);
        }
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-2"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl overflow-y-auto overflow-x-hidden max-h-[90vh] shadow-xl relative px-4 md:px-6 py-6"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
}
