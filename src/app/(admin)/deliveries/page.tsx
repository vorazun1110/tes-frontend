import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DeliveryTable from "@/components/deliveries/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tes Petrolium | Түгээлт",
  description:
    "Tes Petrolium | Түгээлт",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Түгээлт" />
      <div className="space-y-6">
        <DeliveryTable />
      </div>
    </div>
  );
}
