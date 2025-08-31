import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VolumeTable from "@/components/volumes/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tes Petrolium | Ачилтын хэмжээ",
  description:
    "Tes Petrolium | Ачилтын хэмжээ",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ачилтын хэмжээ" />
      <div className="space-y-6">
        <VolumeTable />
      </div>
    </div>
  );
}
