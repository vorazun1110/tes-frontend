import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

// This component is no longer used - the report table renders inline.
// Kept for backwards compatibility.
export default function ReportTableBody() {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={12} className="text-center py-4">
          Мэдээлэл олдсонгүй
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
