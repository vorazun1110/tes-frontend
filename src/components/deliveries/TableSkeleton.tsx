import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import DeliveryTableHead from "./TableHead";

type SkeletonTableProps = {
    rowCount?: number;
};

export default function TableSkeleton({ rowCount = 5 }: SkeletonTableProps) {
    return (
        <div className="border border-gray-400 dark:border-white/[0.05] rounded-md overflow-x-auto min-h-[360px]">
            <Table className="min-w-[1200px] border-collapse text-[11px]">
                <DeliveryTableHead />
                <TableBody className="dark:divide-white/[0.05]">
                    {Array.from({ length: rowCount }).map((_, idx) => (
                        <TableRow key={`skeleton-row-${idx}`}>
                            {Array.from({ length: 12 }).map((_, colIdx) => (
                                <TableCell
                                    key={`skeleton-cell-${idx}-${colIdx}`}
                                    className="border border-gray-400 px-5 py-4"
                                >
                                    <div className="h-4 w-full rounded bg-gray-200 animate-pulse dark:bg-gray-600"></div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
