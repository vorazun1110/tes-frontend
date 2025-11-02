"use client";

import React, { useEffect, useState } from "react";
import { Table } from "../ui/table";
import { fetchReport } from "@/services/report";
import { DeliveryItem, GroupedDelivery, ReportResponse } from "@/types/api";
import ReportTableHead from "./Table/ReportTableHead";
import ReportTableBody from "./Table/ReportTableBody";
import ReportExcelExport from "./Table/ExcelExport";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface FlatDelivery extends DeliveryItem {
  date: string;
}

export default function ReportTable() {
  const [deliveries, setDeliveries] = useState<FlatDelivery[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [dateFrom, setDateFrom] = useState<Dayjs>(dayjs().startOf("month"));
  const [dateTo, setDateTo] = useState<Dayjs>(dayjs().endOf("month"));

  const loadData = async () => {
    try {
      const response: ReportResponse = await fetchReport(
        dateFrom.format("YYYY-MM-DD"),
        dateTo.format("YYYY-MM-DD"),
        "1",
      );

      const flatDeliveries: FlatDelivery[] = response.data.deliveries.flatMap(
        (day: GroupedDelivery) =>
          day.deliveries.map((d: DeliveryItem) => ({
            date: day.date,
            ...d,
          })),
      );

      setDeliveries(flatDeliveries);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Алдаа гарлаа.");
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="YYYY-MM-DD"
              label="Эхлэх өдөр"
              value={dateFrom}
              maxDate={dateTo}
              onChange={(newVal) => {
                if (newVal) setDateFrom(newVal);
              }}
            />
            <DatePicker
              format="YYYY-MM-DD"
              label="Дуусах өдөр"
              value={dateTo}
              minDate={dateFrom}
              onChange={(newVal) => {
                if (newVal) setDateTo(newVal);
              }}
            />
          </LocalizationProvider>
        </div>
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
