"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Delivery, DeliveryReceivePayload, DeliveryUpsertPayload } from "@/types/deliveries";
import Badge from "../ui/badge/Badge";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import {
  fetchDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  receiveDeliveryApiCall,
} from "@/services/delivery";
import DeliveryFormModal from "./Modal";
import dayjs from "dayjs";
import DatePicker from "../form/date-picker";
import { Driver, FuelType, Location, Trailer, Truck, Distance } from "@/types/api";
import { fetchDrivers } from "@/services/driver";
import { fetchLocations } from "@/services/location";
import { fetchTrucks } from "@/services/truck";
import { fetchTrailers } from "@/services/trailer";
import { fetchFuelTypes } from "@/services/fuel";
import DeliveryReceiveModal from "./ReceiveModal";
import { fetchDistances } from "@/services/distance";

const today = dayjs().startOf("day");

export default function DeliveryTable() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDelivery, setEditDelivery] = useState<Delivery | null>(null);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receiveDelivery, setReceiveDelivery] = useState<Delivery | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [distances, setDistances] = useState<Distance[]>([]);

  const {
    isOpen: isConfirmOpen,
    confirm: openConfirm,
    options: confirmOptions,
    handleClose: closeConfirm,
    handleConfirm: confirmDelete,
  } = useConfirmDialog();

  const rowsPerPage = 5;

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        fetchDrivers().then((res) => setDrivers(res.data));
        fetchLocations().then((res) => setLocations(res.data));
        fetchTrucks().then((res) => setTrucks(res.data));
        fetchTrailers().then((res) => setTrailers(res.data));
        fetchFuelTypes().then((res) => setFuelTypes(res.data));
        fetchDeliveries(dateFilter).then((res) => setDeliveries(res.data));
        fetchDistances().then((res) => setDistances(res.data));
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch deliveries.");
      }
    })();
  }, [dateFilter]);

  const filteredDeliveries = useMemo(() => {
    const q = search.toLowerCase();
    return deliveries.filter((delivery) => {
      const driverName = `${delivery.driver?.lastname || ""} ${delivery.driver?.firstname || ""}`.toLowerCase();
      const fromName = delivery.fromLocation?.name?.toLowerCase?.() || "";
      const toName = delivery.toLocation?.name?.toLowerCase?.() || "";
      return (
        delivery.date.toString().includes(q) ||
        driverName.includes(q) ||
        fromName.includes(q) ||
        toName.includes(q)
      );
    });
  }, [deliveries, search]);

  const paginatedDeliveries = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDeliveries.slice(start, start + rowsPerPage);
  }, [filteredDeliveries, currentPage]);

  const totalPages = Math.ceil(filteredDeliveries.length / rowsPerPage) || 1;

  const handleSubmit = async (payload: DeliveryUpsertPayload) => {
    try {
      if (editDelivery) {
        const res = await updateDelivery(editDelivery.id, payload);
        setDeliveries((prev) =>
          prev.map((d) => (d.id === editDelivery.id ? res.data : d))
        );
      } else {
        const res = await createDelivery(payload);
        setDeliveries((prev) => [res.data, ...prev]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsModalOpen(false);
      setEditDelivery(null);
      fetchDeliveries(dateFilter).then((res) => setDeliveries(res.data));
    }
  };

  const handleSubmitReceive = async (payload: DeliveryReceivePayload) => {
    try {
      await receiveDeliveryApiCall(receiveDelivery?.id ?? null, payload);
      fetchDeliveries(dateFilter).then((res) => setDeliveries(res.data));
      setIsReceiveModalOpen(false);
      setReceiveDelivery(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDelivery(id);
      setDeliveries((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex items-center justify-between gap-4">
        {/* left filters */}
        <div className="flex flex-1 items-center gap-4">
          <Input
            type="text"
            placeholder="Хайх (огноо, жолооч, байршил)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm w-full"
          />
          <DatePicker
            id="date-filter"
            mode="single"
            onChange={(dates, currentDateString) => {
              setDateFilter(currentDateString || "");
            }}
            defaultDate={dateFilter ? new Date(dateFilter) : today.toDate()}
          />
        </div>

        {/* right action */}
        <Button
          onClick={() => {
            setEditDelivery(null);
            setIsModalOpen(true);
          }}
        >
          + Нэмэх
        </Button>
      </div>
      <div className="max-w-full overflow-x-auto min-h-[360px]">
        <div className="min-w-[1000px]">
          <Table className="">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  #
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Огноо
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Жолооч
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ачилт (хаанаас)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Хүргэлт (хаашаа)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Машин
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Чиргүүл
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Үйлдэл
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedDeliveries.map((delivery, index) => {
                return (
                  <TableRow key={delivery.id} className="hover:bg-gray-50">
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <Badge color="primary">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {delivery.date}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {delivery.driver
                        ? `${delivery.driver.lastname} ${delivery.driver.firstname}`
                        : "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {delivery.fromLocation?.name || "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {delivery.toLocation?.name || "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {delivery.truck
                        ? delivery.truck.licensePlate
                        : "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {delivery.trailers
                        ? delivery.trailers.licensePlate
                        : "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <div className="flex gap-2">
                        {!delivery.is_received ? (
                          <button
                            onClick={() => {
                              setReceiveDelivery(delivery);
                              setIsReceiveModalOpen(true);
                            }}
                            className="text-green-600 hover:text-green-800">
                            <CheckCircle size={18} />
                          </button>
                        ) : null}
                        <button
                          onClick={() => {
                            setEditDelivery(delivery);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            openConfirm(() => handleDelete(delivery.id), {
                              title: "Хүргэлт устгах",
                              description: `"${delivery.date}" өдөртэй хүргэлтийг устгах уу?`,
                              confirmText: "Устгах",
                              cancelText: "Цуцлах",
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-500 font-medium text-sm">Error: {error}</div>
      )}

      <div className="flex justify-end p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DeliveryFormModal
          editDelivery={editDelivery}
          onClose={() => {
            setIsModalOpen(false);
            setEditDelivery(null);
          }}
          onSubmit={handleSubmit}
          drivers={drivers}
          locations={locations}
          trucks={trucks}
          trailers={trailers}
          fuelTypes={fuelTypes}
        />
      </Modal>

      <Modal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)}>
        <DeliveryReceiveModal
          receiveDelivery={receiveDelivery}
          onClose={() => {
            setIsReceiveModalOpen(false);
            setReceiveDelivery(null);
          }}
          onSubmit={handleSubmitReceive}
          distances={distances}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        {...confirmOptions}
      />
    </div>
  );
}
