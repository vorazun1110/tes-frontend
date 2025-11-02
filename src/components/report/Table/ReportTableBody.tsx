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
    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
      {deliveries.map((item, idx) => (
        <TableRow key={idx}>
          <TableCell>{idx + 1}</TableCell>
          <TableCell>{item.date}</TableCell>
          <TableCell>{item.locationDetail?.name ?? "-"}</TableCell>
          <TableCell>{item.receiverDetail?.name ?? "-"}</TableCell>
          <TableCell>{item.deliveryTruck?.license_plate ?? "-"}</TableCell>
          <TableCell>{item.deliveryTrailer?.license_plate ?? "-"}</TableCell>
          <TableCell>{item.tonKm}</TableCell>
          <TableCell>{item.withLoadDistance}</TableCell>
          <TableCell>{item.withoutLoadDistance}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
