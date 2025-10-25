import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LocationTable from "@/components/locations/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TM Oil Trans | Түгээлтийн байршил",
  description:
    "TM Oil Trans | Түгээлтийн байршил",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Түгээлтийн байршил" />
      <div className="space-y-6">
        <LocationTable />
      </div>
    </div>
  );
}
