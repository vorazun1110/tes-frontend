"use client";

import React from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { DeliveryItem } from "@/types/api";
import Button from "@/components/ui/button/Button";

interface Props {
  deliveries: DeliveryItem[];
}

export default function ReportExcelExport({ deliveries }: Props) {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Тайлан");

    // ---------------------------
    // 1️⃣ Header Rows
    // ---------------------------
    const headerRow1 = sheet.addRow([
      "№",
      "Огноо",
      "Шатахууны марк",
      "Ачааны хэмжээ",
      "",
      "",
      "Явсан зам (км)",
      "",
      "Тонн/км",
      "Хаана буусан",
      "Хүлээн авсан хүний нэр, гарын үсэг",
    ]);

    const headerRow2 = sheet.addRow([
      "",
      "",
      "",
      "%-ийн жин",
      "Литр",
      "Нийт жин",
      "Ачаатай",
      "Сул",
      "",
      "",
      "",
    ]);

    sheet.mergeCells("A1:A2");
    sheet.mergeCells("B1:B2");
    sheet.mergeCells("C1:C2");
    sheet.mergeCells("I1:I2");
    sheet.mergeCells("J1:J2");
    sheet.mergeCells("K1:K2");
    sheet.mergeCells("D1:F1");
    sheet.mergeCells("G1:H1");

    [headerRow1, headerRow2].forEach((row) => {
      row.font = { bold: true };
      row.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
    });

    // ---------------------------
    // 2️⃣ Data Rows with Row Merge
    // ---------------------------
    let currentRow = 3;

    deliveries.forEach((delivery, deliveryIdx) => {
      const rowSpan = delivery.details.length || 1;

      delivery.details.forEach((detail) => {
        sheet.addRow([
          deliveryIdx + 1, // A
          delivery.date,   // B
          detail.name ?? "-",             // C
          detail.averageDensity ?? "-",   // D
          detail.volume ?? 0,             // E
          detail.mass ?? 0,               // F
          delivery.withLoadDistance ?? 0,     // G
          delivery.withoutLoadDistance ?? 0,  // H
          delivery.tonKm ?? 0,                // I
          delivery.locationDetail?.name ?? "-",  // J
          delivery.receiverDetail?.name ?? "-",  // K
        ]);
      });

      // Vertically merge fields for rowspan simulation
      const startRow = currentRow;
      const endRow = currentRow + rowSpan - 1;

      const columnsToMerge = ["A", "B", "G", "H", "I", "J", "K"];
      for (const col of columnsToMerge) {
        if (rowSpan > 1) {
          sheet.mergeCells(`${col}${startRow}:${col}${endRow}`);
        }
      }

      currentRow += rowSpan;
    });

    // ---------------------------
    // 3️⃣ Style Formatting
    // ---------------------------
    sheet.columns.forEach((col) => {
      col.width = 16;
    });

    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    // ---------------------------
    // 4️⃣ Export File
    // ---------------------------
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Report_${new Date().toISOString()}.xlsx`);
  };

  return (
    <div className="mb-4 text-right">
      <Button onClick={exportToExcel}>Excel татах</Button>
    </div>
  );
}
