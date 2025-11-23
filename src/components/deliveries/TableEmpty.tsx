"use client";

import React from "react";
import { TableRow, TableCell, TableBody } from "../ui/table";

export default function DeliveryTableEmpty() {
    return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={999} className="py-10 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 17v-2a1 1 0 011-1h4a1 1 0 011 1v2m-9 4h10a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p>Хоосон байна – мэдээлэл олдсонгүй</p>
                    </div>
                </TableCell>
            </TableRow></TableBody>

    );
}
