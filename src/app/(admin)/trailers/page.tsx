import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TrailerTable from "@/components/trailers/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TM Oil Trans | Чиргүүл",
  description:
    "TM Oil Trans | Чиргүүл",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Чиргүүл" />
      <div className="space-y-6">
        <TrailerTable />
      </div>
    </div>
  );
}
