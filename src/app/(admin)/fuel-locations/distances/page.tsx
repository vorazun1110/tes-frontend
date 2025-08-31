import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DistanceTable from "@/components/distances/Table";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Tes Petrolium | Түгээлтийн зай",
    description:
        "Tes Petrolium | Түгээлтийн зай",
};

export default function BasicTables() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Түгээлтийн зай" />
            <div className="space-y-6">
                <DistanceTable />
            </div>
        </div>
    );
}
