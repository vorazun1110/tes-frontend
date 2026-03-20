"use client";

import React from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { ReportGroupedDelivery } from "@/types/api";
import Button from "@/components/ui/button/Button";

interface Props {
  data: ReportGroupedDelivery[];
}

export default function ReportExcelExport({ data }: Props) {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Тайлан");

    const headerRow1 = sheet.addRow([
      "№", "Огноо", "Шатахууны марк",
      "Ачааны хэмжээ", "", "",
      "Явсан зам (км)", "",
      "Тонн/км", "Хаана буусан", "Хүлээн авсан",
    ]);

    const headerRow2 = sheet.addRow([
      "", "", "",
      "%-ийн жин", "Литр", "Нийт жин",
      "Ачаатай", "Сул",
      "", "", "",
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
      row.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    });

    let currentRow = 3;
    let deliveryIdx = 0;

    for (const group of data) {
      for (const delivery of group.deliveries) {
        let totalRows = 0;
        for (const detail of delivery.details) {
          totalRows += Math.max(detail.locations.length, 1);
        }
        if (totalRows === 0) totalRows = 1;

        for (const detail of delivery.details) {
          if (detail.locations.length === 0) {
            sheet.addRow([
              deliveryIdx + 1, group.date, detail.name,
              "-", 0, 0,
              delivery.withLoadDistance, delivery.withoutLoadDistance,
              delivery.tonKm, "-", "-",
            ]);
          } else {
            for (const loc of detail.locations) {
              sheet.addRow([
                deliveryIdx + 1, group.date, detail.name,
                loc.averageDensity, loc.volume, loc.mass,
                delivery.withLoadDistance, delivery.withoutLoadDistance,
                delivery.tonKm,
                loc.locationDetail?.name || loc.name || "-",
                loc.receivers?.map(r => `${r.lastname} ${r.firstname}`).join(", ") || "-",
              ]);
            }
          }
        }

        const startRow = currentRow;
        const endRow = currentRow + totalRows - 1;
        const columnsToMerge = ["A", "B", "G", "H", "I"];
        for (const col of columnsToMerge) {
          if (totalRows > 1) {
            sheet.mergeCells(`${col}${startRow}:${col}${endRow}`);
          }
        }

        currentRow += totalRows;
        deliveryIdx++;
      }
    }

    sheet.columns.forEach((col) => { col.width = 16; });
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

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Report_${new Date().toISOString()}.xlsx`);
  };

  return (
    <Button onClick={exportToExcel}>Excel татах</Button>
  );
}
