"use client";

import React, { ReactNode, useEffect } from "react";

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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose} // click backdrop closes modal
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-lg px-6 py-4 w-full max-w-2xl modal-scroll max-h-[80vh] overflow-y-auto shadow-lg relative"
                onClick={(e) => e.stopPropagation()} // prevent close on modal content click
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
                    aria-label="Close modal"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}
