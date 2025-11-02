import React from "react";
import { TableHeader, TableRow, TableCell } from "@/components/ui/table";

export default function ReportTableHead() {
  return (
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
  );
}
