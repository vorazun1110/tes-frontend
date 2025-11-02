"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { fetchReport } from "@/services/report";
import { DeliveryItem, GroupedDelivery, ReportResponse } from "@/types/api";

interface FlatDelivery extends DeliveryItem {
  date: string;
}

export default function ReportTable() {
  const [deliveries, setDeliveries] = useState<FlatDelivery[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport("2025-11-01", "2025-11-02", "1")
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {error ? (
        <div className="p-4 text-sm text-red-500">{error}</div>
      ) : (
        <Table className="dark:text-white">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader>№</TableCell>
              <TableCell isHeader>Огноо</TableCell>
              <TableCell isHeader>Байршил</TableCell>
              <TableCell isHeader>Хүлээн авагч</TableCell>
              <TableCell isHeader>Машин</TableCell>
              <TableCell isHeader>Чиргүүл</TableCell>
              <TableCell isHeader>Тон.км</TableCell>
              <TableCell isHeader>Ачаатай км</TableCell>
              <TableCell isHeader>Ачаагүй км</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {deliveries.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.locationDetail?.name ?? "-"}</TableCell>
                <TableCell>{item.receiverDetail?.name ?? "-"}</TableCell>
                <TableCell>
                  {item.deliveryTruck?.license_plate ?? "-"}
                </TableCell>
                <TableCell>
                  {item.deliveryTrailer?.license_plate ?? "-"}
                </TableCell>
                <TableCell>{item.tonKm}</TableCell>
                <TableCell>{item.withLoadDistance}</TableCell>
                <TableCell>{item.withoutLoadDistance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
