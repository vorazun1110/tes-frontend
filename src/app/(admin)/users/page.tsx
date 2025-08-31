import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/users/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tes Petrolium | Хэрэглэгч",
  description:
    "Tes Petrolium | Хэрэглэгч",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Хэрэглэгч" />
      <div className="space-y-6">
        <UserTable />
      </div>
    </div>
  );
}
