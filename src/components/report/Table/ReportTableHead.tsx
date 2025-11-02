import React from "react";
import { TableHeader, TableRow, TableCell } from "@/components/ui/table";

export default function ReportTableHead() {
  return (
    <TableHeader className="border border-gray-300 dark:border-white/[0.1]">
      <TableRow className="border-b border-gray-300 text-center dark:border-white/[0.1]">
        <TableCell
          isHeader
          rowSpan={2}
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          №
        </TableCell>
        <TableCell
          isHeader
          rowSpan={2}
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Огноо
        </TableCell>
        <TableCell
          isHeader
          rowSpan={2}
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Шатахууны марк
        </TableCell>
        <TableCell
          isHeader
          colSpan={3}
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Ачааны хэмжээ
        </TableCell>
        <TableCell
          isHeader
          colSpan={2}
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Явсан зам (км)
        </TableCell>
        <TableCell
          isHeader
          rowSpan={2}
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Тонн/км
        </TableCell>
        <TableCell
          isHeader
          rowSpan={2}
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Хаана буусан
        </TableCell>
        <TableCell
          isHeader
          rowSpan={2}
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Хүлээн авсан хүний нэр, гарын үсэг
        </TableCell>
      </TableRow>

      <TableRow className="text-center">
        <TableCell
          isHeader
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          %-ийн жин
        </TableCell>
        <TableCell
          isHeader
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Литр
        </TableCell>
        <TableCell
          isHeader
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Нийт жин
        </TableCell>
        <TableCell
          isHeader
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Ачаатай
        </TableCell>
        <TableCell
          isHeader
          className="border border-gray-300 text-center dark:border-white/[0.1]"
        >
          Сул
        </TableCell>
      </TableRow>
    </TableHeader>
  );
}
