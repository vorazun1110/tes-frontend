import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DeliveryItem } from "@/types/api";

interface Props {
  deliveries: DeliveryItem[];
}

export default function ReportTableBody({ deliveries }: Props) {
  if (!deliveries || deliveries.length === 0) {
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

  return (
    <TableBody className="divide-y divide-gray-300 dark:divide-white/[0.1]">
      {deliveries.map((delivery, deliveryIdx) => {
        const rowSpan = delivery.details.length || 1;

        return delivery.details.map((detail, detailIdx) => (
          <TableRow
            key={`${deliveryIdx}-${detailIdx}`}
            className="text-center"
          >
            {/* Show once per delivery (merged cells with rowSpan) */}
            {detailIdx === 0 && (
              <>
                <TableCell
                  rowSpan={rowSpan}
                  className="border border-gray-300 dark:border-white/[0.1]"
                >
                  {deliveryIdx + 1}
                </TableCell>
                <TableCell
                  rowSpan={rowSpan}
                  className="border border-gray-300 dark:border-white/[0.1]"
                >
                  {delivery.date}
                </TableCell>
              </>
            )}
            <TableCell
              className="border border-gray-300 dark:border-white/[0.1]"
            >
              {detail.name ?? "-"}
            </TableCell>
            <TableCell
              className="border border-gray-300 dark:border-white/[0.1]"
            >
              {detail.averageDensity ?? "-"}
            </TableCell>
            <TableCell className="border border-gray-300 dark:border-white/[0.1]">
              {detail.volume}
            </TableCell>
            <TableCell className="border border-gray-300 dark:border-white/[0.1]">
              {detail.mass}
            </TableCell>
            {detailIdx === 0 && (
              <>
                <TableCell
                  rowSpan={rowSpan}
                  className="border border-gray-300 dark:border-white/[0.1]"
                >
                  {delivery.withLoadDistance}
                </TableCell>
                <TableCell
                  rowSpan={rowSpan}
                  className="border border-gray-300 dark:border-white/[0.1]"
                >
                  {delivery.withoutLoadDistance}
                </TableCell>
                <TableCell
                  rowSpan={rowSpan}
                  className="border border-gray-300 dark:border-white/[0.1]"
                >
                  {delivery.tonKm}
                </TableCell>
                <TableCell
                  rowSpan={rowSpan}
                  className="border border-gray-300 dark:border-white/[0.1]"
                >
                  {delivery.locationDetail?.name ?? "-"}
                </TableCell>
                <TableCell
                  rowSpan={rowSpan}
                  className="border border-gray-300 dark:border-white/[0.1]"
                >
                  {delivery.receiverDetail?.name ?? "-"}
                </TableCell>
              </>
            )}
          </TableRow>
        ));
      })}
    </TableBody>
  );
}
