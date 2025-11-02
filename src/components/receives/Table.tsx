"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Delivery, DeliveryReceivePayload } from "@/types/deliveries";
import Badge from "../ui/badge/Badge";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import { Pencil } from "lucide-react";
import {
  fetchDeliveries,
  receiveDeliveryApiCall,
} from "@/services/delivery";
import dayjs from "dayjs";
import ReceiveFormModal from "./Modal";
import { fetchDistances } from "@/services/distance";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Distance } from "@/types/api";

export default function ReceiveTable() {
  const pathname = usePathname();

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receiveDelivery, setReceiveDelivery] = useState<Delivery | null>(null);
  const [distances, setDistances] = useState<Distance[]>([]);

  const rowsPerPage = 5;

  const [dateFrom, setDateFrom] = useState<Dayjs>(dayjs().startOf("day"));
  const [dateTo, setDateTo] = useState<Dayjs>(dayjs().endOf("day"));

  useEffect(() => {
    (async () => {
      try {
        fetchDeliveries(dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), "1").then((res) => setDeliveries(res.data));
        fetchDistances().then((res) => setDistances(res.data));
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch deliveries.");
      }
    })();
  }, [dateFrom, dateTo]);

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

  const handleSubmitReceive = async (payload: DeliveryReceivePayload) => {
    try {
      await receiveDeliveryApiCall(receiveDelivery?.id ?? null, payload);
      fetchDeliveries(dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"), "1").then((res) => setDeliveries(res.data));
      setIsReceiveModalOpen(false);
      setReceiveDelivery(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="px-4 pt-4">
        <div
          role="tablist"
          aria-label="Fuel location tabs"
          className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.05]"
        >
          <Link
            href="/deliveries"
            role="tab"
            aria-selected={pathname === "/deliveries"}
            aria-current={pathname === "/deliveries" ? "page" : undefined}
            className={[
              // layout & spacing
              "-mb-[1px] inline-flex items-center rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              // base colors
              "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              // underline indicator via border
              "border-b-2",
              pathname === "/deliveries"
                ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "border-transparent hover:border-gray-300 dark:hover:border-white/30",
            ].join(" ")}
          >
            Түгээлт
          </Link>

          <span className="select-none text-gray-300 dark:text-white/30">|</span>

          <Link
            href="/receives"
            role="tab"
            aria-selected={pathname === "/receives"}
            aria-current={pathname === "/receives" ? "page" : undefined}
            className={[
              "-mb-[1px] inline-flex items-center rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              "border-b-2",
              pathname === "/receives"
                ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "border-transparent hover:border-gray-300 dark:hover:border-white/30",
            ].join(" ")}
          >
            Хүлээн авах
          </Link>
        </div>
      </div>
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
          <div className="flex items-center gap-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="YYYY-MM-DD"
                label="Эхлэх өдөр"
                value={dateFrom}
                maxDate={dateTo}
                onChange={(newVal) => {
                  if (newVal) setDateFrom(newVal);
                }}
                slotProps={{
                  textField: {
                    sx: {
                      width: "60%",
                      size: "small",
                    },
                  },
                }}
              />
              <DatePicker
                format="YYYY-MM-DD"
                label="Дуусах өдөр"
                value={dateTo}
                minDate={dateFrom}
                onChange={(newVal) => {
                  if (newVal) setDateTo(newVal);
                }}
                slotProps={{
                  textField: {
                    sx: {
                      width: "60%",
                      size: "small",
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
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
                        {
                          <>
                            <button
                              onClick={() => {
                                setReceiveDelivery(delivery);
                                setIsReceiveModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Pencil size={18} />
                            </button>
                          </>
                        }
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

      <Modal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)}>
        <ReceiveFormModal
          receiveDelivery={receiveDelivery}
          onClose={() => {
            setIsReceiveModalOpen(false);
            setReceiveDelivery(null);
          }}
          onSubmit={handleSubmitReceive}
          distances={distances}
        />
      </Modal>

    </div>
  );
}
