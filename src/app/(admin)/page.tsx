import RecentOrders from "@/components/ecommerce/RecentOrders";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Ти Эм Ойл Транс | Dashboard",
  description: "Ти Эм Ойл Транс | Dashboard",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}
