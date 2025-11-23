import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DeliveryDashboard from "@/components/deliveries/TableDashboard";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "TM Oil Trans | Түгээлт",
  description:
    "TM Oil Trans | Түгээлт",
};

export default function BasicTables() {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <PageBreadcrumb pageTitle="Түгээлт" />
      <div className="space-y-6 w-full max-w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <DeliveryDashboard />
        </Suspense>
      </div>
    </div>
  );
}
