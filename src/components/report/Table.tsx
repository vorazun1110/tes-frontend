"use client";

import React, { useEffect, useState } from "react";
import { Table } from "../ui/table";
import { fetchReport } from "@/services/report";
import { DeliveryItem, GroupedDelivery, ReportResponse } from "@/types/api";
import ReportTableHead from "./Table/ReportTableHead";
import ReportTableBody from "./Table/ReportTableBody";
import ReportExcelExport from "./Table/ExcelExport";

interface FlatDelivery extends DeliveryItem {
  date: string;
}

export default function ReportTable() {
  const [deliveries, setDeliveries] = useState<FlatDelivery[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport("2025-11-01", "2025-11-05", "1")
      .then((response: ReportResponse) => {
        const reportData = response.data;
        const flatDeliveries: FlatDelivery[] = reportData.deliveries.flatMap(
          (day: GroupedDelivery) =>
            day.deliveries.map((d: DeliveryItem) => ({
              date: day.date,
              ...d,
            })),
        );
        setDeliveries(flatDeliveries);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <>
      <div className="mb-4 text-right">
        <ReportExcelExport deliveries={deliveries} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {error ? (
          <div className="p-4 text-sm text-red-500">{error}</div>
        ) : (
          <Table className="dark:text-white">
            <ReportTableHead />
            <ReportTableBody deliveries={deliveries} />
          </Table>
        )}
      </div>
    </>
  );
}
