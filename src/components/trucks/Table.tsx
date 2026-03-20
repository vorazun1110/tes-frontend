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
import {
  createTruck,
  deleteTruck,
  fetchTrucks,
  updateTruck,
} from "@/services/truck";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import TruckFormModal from "./Modal";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TruckTable() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
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

  const rowsPerPage = 10;
  useEffect(() => {
    setLoading(true);
    fetchTrucks()
      .then((res) => setTrucks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredTrucks = useMemo(() => {
    return trucks.filter((truck) =>
      truck.license_plate.toLowerCase().includes(search.toLowerCase()),
    );
  }, [trucks, search]);

  const paginatedTrucks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTrucks.slice(start, start + rowsPerPage);
  }, [filteredTrucks, currentPage]);

  const totalPages = Math.ceil(filteredTrucks.length / rowsPerPage);

  const handleSubmit = async (payload: TruckPayload) => {
    if (editTruck) {
      const res = await updateTruck(editTruck.id, payload);
      setTrucks((prev) =>
        prev.map((t) => (t.id === editTruck.id ? res.data : t)),
      );
    } else {
      const res = await createTruck(payload);
      setTrucks((prev) => [res.data, ...prev]);
    }
    setIsModalOpen(false);
    setEditTruck(null);
  };

  const handleDelete = async (id: number) => {
    await deleteTruck(id);
    setTrucks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-white/[0.03]">
      <div className="px-4 pt-4">
        <div
          role="tablist"
          aria-label="Fuel location tabs"
          className="flex items-center gap-2 border-b border-gray-300 dark:border-gray-600"
        >
          <Link
            href="/trucks"
            role="tab"
            aria-selected={pathname === "/trucks"}
            className={[
              "-mb-[1px] inline-flex items-center rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              "border-b-2",
              pathname === "/trucks"
                ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "border-transparent hover:border-gray-300 dark:hover:border-white/30",
            ].join(" ")}
          >
            Ачилтын машин
          </Link>

          <span className="text-gray-300 select-none dark:text-gray-600">|</span>

          <Link
            href="/trailers"
            role="tab"
            aria-selected={pathname === "/trailers"}
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
      <div className="flex items-center justify-between p-4">
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
        <Button
          className="ml-4"
          onClick={() => {
            setEditTruck(null);
            setIsModalOpen(true);
          }}
        >
          + Нэмэх
        </Button>
      </div>
      {loading ? <TableSkeleton rows={5} columns={9} /> : (
      <>
      <div className="w-full overflow-x-auto border-t border-gray-300 dark:border-gray-600">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableCell isHeader rowSpan={2} className="w-12 text-center">#</TableCell>
              <TableCell isHeader rowSpan={2}>Улсын дугаар</TableCell>
              <TableCell isHeader rowSpan={2}>Жолооч</TableCell>
              <TableCell isHeader colSpan={4} className="text-center">Багтаамж</TableCell>
              <TableCell isHeader rowSpan={2}>Чиргүүл</TableCell>
              <TableCell isHeader rowSpan={2} className="w-24 text-center">Үйлдэл</TableCell>
            </TableRow>
            <TableRow>
              <TableCell isHeader className="text-center">Лүүк 1</TableCell>
              <TableCell isHeader className="text-center">Лүүк 2</TableCell>
              <TableCell isHeader className="text-center">Лүүк 3</TableCell>
              <TableCell isHeader className="text-center">Лүүк 4</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedTrucks.map((truck, index) => (
              <TableRow key={truck.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <TableCell className="text-center font-medium text-gray-500">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </TableCell>
                <TableCell className="font-medium">{truck.license_plate}</TableCell>
                <TableCell>
                  {truck.driver?.firstname || ""} {truck.driver?.lastname || ""}
                </TableCell>
                <TableCell className="text-center">{truck.containers[0]?.volume || "-"}</TableCell>
                <TableCell className="text-center">{truck.containers[1]?.volume || "-"}</TableCell>
                <TableCell className="text-center">{truck.containers[2]?.volume || "-"}</TableCell>
                <TableCell className="text-center">{truck.containers[3]?.volume || "-"}</TableCell>
                <TableCell>{truck.trailer?.license_plate || "-"}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditTruck(truck);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Pencil size={16} />
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
                      className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end p-4 border-t border-gray-300 dark:border-gray-600">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      </>
      )}

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
    </motion.div>
  );
}
