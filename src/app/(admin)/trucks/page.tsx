import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TruckTable from "@/components/trucks/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tes Petrolium | Машин",
  description:
    "Tes Petrolium | Машин",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ачилтын машин" />
      <div className="space-y-6">
        <ComponentCard title="Ачилтын машин">
          <TruckTable />
        </ComponentCard>
      </div>
    </div>
  );
}
