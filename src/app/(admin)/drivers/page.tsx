import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DriverTable from "@/components/drivers/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tes Petrolium | Жолооч",
  description:
    "Tes Petrolium | Жолооч",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Жолооч" />
      <div className="space-y-6">
        <DriverTable />
      </div>
    </div>
  );
}
