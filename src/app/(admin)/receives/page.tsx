import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReceiveTable from "@/components/receives/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TM Oil Trans | Хүлээн авах",
  description:
    "TM Oil Trans | Хүлээн авах",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Хүлээн авах" />
      <div className="space-y-6">
        <ReceiveTable />
      </div>
    </div>
  );
}
