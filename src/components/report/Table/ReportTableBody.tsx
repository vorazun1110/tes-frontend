import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DeliveryItem } from "@/types/api";

interface FlatDelivery extends DeliveryItem {
  date: string;
}

interface Props {
  deliveries: FlatDelivery[];
}

export default function ReportTableBody({ deliveries }: Props) {
  return (
    <TableBody className="divide-y divide-gray-300 dark:divide-white/[0.1]">
      {deliveries.map((item, idx) => (
        <TableRow key={idx} className="text-center">
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {idx + 1}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {item.date}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {item.locationDetail?.name ?? "-"}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {item.receiverDetail?.name ?? "-"}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {item.deliveryTruck?.license_plate ?? "-"}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {item.deliveryTrailer?.license_plate ?? "-"}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {item.tonKm}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {item.withLoadDistance}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            {item.withoutLoadDistance}
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            where off
          </TableCell>
          <TableCell className="border border-gray-300 dark:border-white/[0.1]">
            signature
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
