"use client";

import React from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { DeliveryItem } from "@/types/api";
import Button from "@/components/ui/button/Button";

interface FlatDelivery extends DeliveryItem {
  date: string;
}

interface Props {
  deliveries: FlatDelivery[];
}

export default function ReportExcelExport({ deliveries }: Props) {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Тайлан");

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

    deliveries.forEach((item, idx) => {
      sheet.addRow([
        idx + 1,
        item.date,
        item.locationDetail?.name ?? "-",
        item.receiverDetail?.name ?? "-",
        item.deliveryTruck?.license_plate ?? "-",
        item.deliveryTrailer?.license_plate ?? "-",
        item.withLoadDistance ?? 0,
        item.withoutLoadDistance ?? 0,
        item.tonKm ?? 0,
        "where off",
        "signature",
      ]);
    });

    sheet.columns.forEach((col) => {
      col.width = 18;
    });

    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Report_${new Date().toISOString()}.xlsx`);
  };

  return (
    <div className="mb-4 text-right">
      <Button onClick={exportToExcel}>Excel татах</Button>
    </div>
  );
}
