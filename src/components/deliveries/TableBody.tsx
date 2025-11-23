import { TableBody, TableRow, TableCell } from "../ui/table";
import { DailyDelivery, DailyData } from "@/types/deliveries";
import { Status, User } from "@/types/api";
import StatusSelect from "./StatusSelect";
import { Check, Pencil, Plus, Trash } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { canAccess } from "@/utils/deliveries";
import { statusColorMap } from "@/data/deliveries";
import { Dayjs } from "dayjs";

interface DeliveryTableBodyProps {
    date: Dayjs;
    sessionUser: User | null;
    deliveries: DailyDelivery[];
    truckStatuses: Status[];
    leaveStatuses: Status[];
    managerStatuses: Status[];
    handleStatusChange: (type: "truck" | "leave" | "manager", deliveryId: number, statusId: number) => void;
    handleLeaveStatus: (truckId: number, date: string, statusId: number) => void;
    onEdit: (deliveryId: number) => void;
    onCreate: (dailyData: DailyData) => void;
    onReceive: (deliveryId: number) => void;
    onConfirmDelete: (deliveryId: number) => void;
}

export default function DeliveryTableBody({ date, sessionUser, deliveries, truckStatuses, leaveStatuses, managerStatuses, handleStatusChange, handleLeaveStatus, onEdit, onCreate, onReceive, onConfirmDelete }: DeliveryTableBodyProps) {
    return (
        <TableBody className="dark:divide-white/[0.05]">
            {deliveries.map((truckRow, index) => {
                if (!truckRow.deliveries || truckRow.deliveries.length === 0) {
                    return (
                        <TableRow key={`truck-${truckRow.truck.id}`} className="hover:bg-gray-50">
                            <TableCell className="border border-gray-400 px-2 py-1 font-semibold">{index + 1}</TableCell>
                            <TableCell className="border border-gray-400 font-semibold px-2 py-1">{truckRow.truck.license_plate}</TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">
                                {canAccess("admin_status", sessionUser?.role) ? (
                                    <StatusSelect
                                        value={truckRow.truck.status_id ?? 1}
                                        onChange={(val) => handleStatusChange("truck", truckRow.truck.id, val)}
                                        statuses={truckStatuses}
                                    />
                                ) :
                                    <span className={`inline-block px-2 py-1 text-[11px] font-medium rounded ${statusColorMap[truckStatuses.find((status) => status.id === truckRow.truck.status_id)?.color as keyof typeof statusColorMap]?.bg} ${statusColorMap[truckStatuses.find((status) => status.id === truckRow.truck.status_id)?.color as keyof typeof statusColorMap]?.text}`}>
                                        {truckRow.truck.status}
                                    </span>
                                }
                            </TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">{truckRow.driver?.lastname + " " + truckRow.driver?.firstname}</TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>
                            <TableCell
                                className="border border-gray-400 px-2 py-1"
                                style={{
                                    position: "sticky",
                                    right: 0,
                                    zIndex: 10,
                                    backgroundColor: "white",
                                }}
                            >
                                {truckRow.truck.status_id === 1 && canAccess("add", sessionUser?.role) ? (
                                    <Tooltip title="Нэмэх">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                                onCreate({
                                                    truck_id: truckRow.truck.id,
                                                    trailer_id: truckRow.trailer?.id ?? undefined,
                                                    driver_id: truckRow.driver?.id,
                                                })
                                            }
                                            className="text-green-600 hover:bg-green-100"
                                        >
                                            <Plus size={18} />
                                        </IconButton>
                                    </Tooltip>
                                ) : "-"}
                            </TableCell>

                        </TableRow>
                    );
                }

                return truckRow.deliveries.map((delivery, deliveryIndex) => {
                    const locationDetails = delivery.location_details || [];
                    const rowSpan = locationDetails.length || 1;

                    return locationDetails.map((locationDetail, locIndex) => (
                        <TableRow key={`delivery-${delivery.id}-location-${locIndex}`} className="hover:bg-gray-50">
                            {locIndex === 0 && (
                                <>
                                    {/* № */}
                                    <TableCell rowSpan={rowSpan} className="border border-gray-400 px-2 py-1 font-semibold">
                                        {deliveryIndex + 1}
                                    </TableCell>

                                    {/* Truck license */}
                                    <TableCell rowSpan={rowSpan} className="border border-gray-400 px-2 py-1 font-semibold">
                                        {truckRow.truck.license_plate}
                                    </TableCell>

                                    {/* Truck status */}
                                    <TableCell rowSpan={rowSpan} className="border border-gray-400 px-2 py-1">
                                        {canAccess("admin_status", sessionUser?.role) ? (
                                            <StatusSelect
                                                value={truckRow.truck.status_id ?? 1}
                                                onChange={(val) => handleStatusChange("truck", truckRow.truck.id, val)}
                                                statuses={truckStatuses}
                                            />
                                        ) :
                                            <span className={`inline-block px-2 py-1 text-[11px] font-medium rounded ${statusColorMap[truckStatuses.find((status) => status.id === truckRow.truck.status_id)?.color as keyof typeof statusColorMap]?.bg} ${statusColorMap[truckStatuses.find((status) => status.id === truckRow.truck.status_id)?.color as keyof typeof statusColorMap]?.text}`}>
                                                {truckRow.truck.status}
                                            </span>
                                        }
                                    </TableCell>

                                    {/* Leave status */}
                                    <TableCell rowSpan={rowSpan} className="border border-gray-400 px-2 py-1">
                                        {canAccess("admin_status", sessionUser?.role) ? (
                                            <StatusSelect
                                                value={truckRow.leave_status_id ?? 1}
                                                onChange={(val) => handleLeaveStatus(truckRow.truck.id, date.format("YYYY-MM-DD"), val)}
                                                statuses={leaveStatuses}
                                            />
                                        ) :
                                            <span className="inline-block px-2 py-1 text-[11px] font-medium rounded">
                                                {truckRow.leave_status}
                                            </span>
                                        }
                                    </TableCell>

                                    {/* Driver */}
                                    <TableCell rowSpan={rowSpan} className="border border-gray-400 px-2 py-1">
                                        {delivery.driver?.lastname + " " + delivery.driver?.firstname}
                                    </TableCell>
                                </>
                            )}

                            {/* From → To */}
                            <TableCell className="border border-gray-400 px-2 py-1 text-left">
                                {delivery.from_location?.name} → {locationDetail.location?.name}
                            </TableCell>

                            {/* Manager status */}
                            <TableCell className="border border-gray-400 px-2 py-1">
                                {canAccess("manager_status", sessionUser?.role) ? (
                                    <StatusSelect
                                        value={delivery.manager_status_id ?? 1}
                                        onChange={(val) => handleStatusChange("manager", delivery.id, val)}
                                        statuses={managerStatuses}
                                    />
                                ) :
                                    <span className={`inline-block px-2 py-1 text-[11px] font-medium rounded ${statusColorMap[managerStatuses.find((status) => status.id === delivery.manager_status_id)?.color as keyof typeof statusColorMap]?.bg} ${statusColorMap[managerStatuses.find((status) => status.id === delivery.manager_status_id)?.color as keyof typeof statusColorMap]?.text}`}>
                                        {delivery.manager_status}
                                    </span>
                                }
                            </TableCell>

                            {/* Note */}
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>

                            {/* Inspector validation */}
                            <TableCell className="border border-gray-400 px-2 py-1">
                                {locationDetail.inspector_status_id !== 2 && canAccess("receive", sessionUser?.role) ? (
                                    <div className="flex items-center justify-center">
                                        <Tooltip title="Баталгаажуулах">
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => onReceive(delivery.id)}
                                                className="text-green-600 hover:bg-green-100"
                                            >
                                                <Check size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                ) : (
                                    <span className={`inline-block px-2 py-1 text-[11px] font-medium rounded ${locationDetail.inspector_status_id === 2 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                        {locationDetail.inspector_status}
                                    </span>
                                )}
                            </TableCell>

                            {/* Inspector note */}
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>

                            {/* Inspector decision */}
                            <TableCell className="border border-gray-400 px-2 py-1">-</TableCell>

                            {/* Actions */}
                            <TableCell className="border border-gray-400 px-2 py-1" style={{
                                position: "sticky",
                                right: 0,
                                zIndex: 10,
                                backgroundColor: "white",
                            }}>
                                <div className="flex items-center gap-1">
                                    {canAccess("edit", sessionUser?.role) ? (
                                        <Tooltip title="Засах">
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => onEdit(delivery.id)}
                                                className="text-green-600 hover:bg-green-100"
                                            >
                                                <Pencil size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}
                                    {canAccess("delete", sessionUser?.role) ? (
                                        <Tooltip title="Устгах">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onConfirmDelete(delivery.id)}
                                                className="text-red-600 hover:bg-red-100"
                                            >
                                                <Trash size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}
                                </div>
                            </TableCell>
                        </TableRow>
                    ));
                });
            })}
        </TableBody>
    );
}