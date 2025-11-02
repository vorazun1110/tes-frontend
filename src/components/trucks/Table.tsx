"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Truck, TruckPayload } from "@/types/api";
import { createTruck, deleteTruck, fetchTrucks, updateTruck } from "@/services/truck";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import TruckFormModal from "./Modal";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TruckTable() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTruck, setEditTruck] = useState<Truck | null>(null);
  const pathname = usePathname();
  const {
    isOpen: isConfirmOpen,
    confirm: openConfirm,
    options: confirmOptions,
    handleClose: closeConfirm,
    handleConfirm: confirmDelete,
  } = useConfirmDialog();

  const rowsPerPage = 5;
  useEffect(() => {
    fetchTrucks()
      .then((res) => setTrucks(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const filteredTrucks = useMemo(() => {
    return trucks.filter((truck) =>
      truck.license_plate.toLowerCase().includes(search.toLowerCase())
    );
  }, [trucks, search]);

  const paginatedTrucks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTrucks.slice(start, start + rowsPerPage);
  }, [filteredTrucks, currentPage]);

  const totalPages = Math.ceil(filteredTrucks.length / rowsPerPage);

  const handleSubmit = async (payload: TruckPayload) => {
    try {
      if (editTruck) {
        const res = await updateTruck(editTruck.id, payload);
        setTrucks((prev) =>
          prev.map((t) => (t.id === editTruck.id ? res.data : t))
        );
      } else {
        const res = await createTruck(payload);
        setTrucks((prev) => [res.data, ...prev]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsModalOpen(false);
      setEditTruck(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTruck(id);
      setTrucks((prev) => prev.filter((t) => t.id !== id));
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
            href="/trucks"
            role="tab"
            aria-selected={pathname === "/trucks"}
            aria-current={pathname === "/trucks" ? "page" : undefined}
            className={[
              // layout & spacing
              "-mb-[1px] inline-flex items-center rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              // base colors
              "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              // underline indicator via border
              "border-b-2",
              pathname === "/trucks"
                ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "border-transparent hover:border-gray-300 dark:hover:border-white/30",
            ].join(" ")}
          >
            Ачилтын машин
          </Link>

          <span className="select-none text-gray-300 dark:text-white/30">|</span>

          <Link
            href="/trailers"
            role="tab"
            aria-selected={pathname === "/trailers"}
            aria-current={pathname === "/trailers" ? "page" : undefined}
            className={[
              "-mb-[1px] inline-flex items-center rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              "border-b-2",
              pathname === "/trailers"
                ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "border-transparent hover:border-gray-300 dark:hover:border-white/30",
            ].join(" ")}
          >
            Чиргүүл
          </Link>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Улсын дугаар хайх..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-sm"
        />
        <Button className="ml-4" onClick={() => { setEditTruck(null); setIsModalOpen(true); }}>
          + Нэмэх
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader rowSpan={2} className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">#</TableCell>
              <TableCell isHeader rowSpan={2} className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Улсын дугаар</TableCell>
              <TableCell isHeader rowSpan={2} className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Жолооч</TableCell>

              <TableCell isHeader colSpan={4} className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Багтаамж
              </TableCell>

              <TableCell isHeader rowSpan={2} className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Чиргүүл</TableCell>

              <TableCell isHeader rowSpan={2} className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Дугуйн гүйлт</TableCell>
              <TableCell isHeader rowSpan={2} className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Аккумулятор солих хугацаа</TableCell>
              <TableCell isHeader rowSpan={2} className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Үзлэгийн хугацаа</TableCell>
              <TableCell isHeader rowSpan={2} className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Үйлдэл</TableCell>
            </TableRow>

            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">Лүүк 1</TableCell>
              <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">Лүүк 2</TableCell>
              <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">Лүүк 3</TableCell>
              <TableCell isHeader className="px-5 py-3 text-gray-500 text-center text-theme-xs dark:text-gray-400">Лүүк 4</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] dark:text-white">
            {paginatedTrucks.map((truck, index) => {
              return (
                <TableRow key={truck.id} className="hover:bg-gray-700">
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.license_plate}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.driver?.firstname || ''}{' '}{truck.driver?.lastname || ''}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.containers[0]?.volume || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.containers[1]?.volume || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.containers[2]?.volume || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.containers[3]?.volume || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.trailer?.license_plate || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.tire_wear || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.last_battery_changed_at || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    {truck.last_inspected_at || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditTruck(truck);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          openConfirm(() => handleDelete(truck.id), {
                            title: "Мэдээлэл устгах",
                            description: `"${truck.license_plate}" дугаартай машиныг устгах уу?`,
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
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TruckFormModal
          editTruck={editTruck}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
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
