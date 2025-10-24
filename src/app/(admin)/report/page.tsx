import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReportTable from "@/components/report/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tes Petrolium | Цагийн бүртгэл",
  description:
    "Tes Petrolium | Цагийн бүртгэл",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Цагийн бүртгэл" />
      <div className="space-y-6">
        <ReportTable />
      </div>
    </div>
  );
}
