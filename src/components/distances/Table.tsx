"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Distance, DistancePayload } from "@/types/api";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import DistanceFormModal from "./Modal";
import {
  createDistance,
  deleteDistance,
  fetchDistances,
  updateDistance,
} from "@/services/distance";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DistanceTable() {
  const [distances, setDistances] = useState<Distance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDistance, setEditDistance] = useState<Distance | null>(null);
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
    fetchDistances()
      .then((res) => setDistances(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredDistances = useMemo(() => {
    return distances.filter((distance) =>
      distance.locationDistanceName
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [distances, search]);

  const paginatedDistances = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDistances.slice(start, start + rowsPerPage);
  }, [filteredDistances, currentPage]);

  const totalPages = Math.ceil(filteredDistances.length / rowsPerPage);

  const handleSubmit = async (payload: DistancePayload) => {
    if (editDistance) {
      const res = await updateDistance(editDistance.id, payload);
      setDistances((prev) =>
        prev.map((d) => (d.id === editDistance.id ? res.data : d)),
      );
    } else {
      const res = await createDistance(payload);
      setDistances((prev) => [res.data, ...prev]);
    }
    setIsModalOpen(false);
    setEditDistance(null);
  };

  const handleDelete = async (id: number) => {
    await deleteDistance(id);
    setDistances((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-white/[0.03]">
      {/* Tabs */}
      <div className="px-4 pt-4">
        <div
          role="tablist"
          aria-label="Fuel distance tabs"
          className="flex items-center gap-2 border-b border-gray-300 dark:border-gray-600"
        >
          <Link
            href="/fuel-locations"
            role="tab"
            aria-selected={pathname === "/fuel-locations"}
            aria-current={pathname === "/fuel-locations" ? "page" : undefined}
            className={[
              // layout & spacing
              "-mb-[1px] inline-flex items-center rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              // base colors
              "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              // underline indicator via border
              "border-b-2",
              pathname === "/fuel-locations"
                ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "border-transparent hover:border-gray-300 dark:hover:border-white/30",
            ].join(" ")}
          >
            Түгээлтийн байршил
          </Link>

          <span className="text-gray-300 select-none dark:text-white/30">
            |
          </span>

          <Link
            href="/fuel-locations/distances"
            role="tab"
            aria-selected={pathname === "/fuel-locations/distances"}
            aria-current={
              pathname === "/fuel-locations/distances" ? "page" : undefined
            }
            className={[
              "-mb-[1px] inline-flex items-center rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              "border-b-2",
              pathname === "/fuel-locations/distances"
                ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "border-transparent hover:border-gray-300 dark:hover:border-white/30",
            ].join(" ")}
          >
            Түгээлтийн зай
          </Link>
        </div>
      </div>

      {/* Toolbar (only for distance tab) */}
      <div className="flex items-center justify-between p-4">
        <Input
          type="text"
          placeholder="Утга хайх..."
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
            setEditDistance(null);
            setIsModalOpen(true);
          }}
        >
          + Нэмэх
        </Button>
      </div>

      {/* Content */}
      {loading ? <TableSkeleton rows={5} columns={5} /> : (
      <>
      <div className="max-w-full overflow-x-auto border-t border-gray-300 dark:border-gray-600">
        <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader className="w-12 text-center">
                    #
                  </TableCell>
                  <TableCell isHeader>
                    Нэр
                  </TableCell>
                  <TableCell isHeader>
                    Байршил
                  </TableCell>
                  <TableCell isHeader>
                    Зай
                  </TableCell>
                  <TableCell isHeader className="w-24 text-center">
                    Үйлдэл
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDistances.map((distance, index) => {
                  return (
                    <TableRow key={distance.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <TableCell className="text-center font-medium text-gray-500">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {distance.locationDistanceName}
                      </TableCell>
                      <TableCell>
                        {distance?.location1?.name}
                        {distance?.location2?.name}
                      </TableCell>
                      <TableCell>
                        {distance.distance} км
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditDistance(distance);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => {
                              openConfirm(() => handleDelete(distance.id), {
                                title: "Мэдээлэл устгах",
                                description: `"${distance.name}" утгатай ачилтын хэмжээг устгах уу?`,
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
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex justify-end p-4 border-t border-gray-300 dark:border-gray-600">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Modals only relevant for distance tab */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <DistanceFormModal
                editDistance={editDistance}
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
      </div>
      </>
      )}
    </motion.div>
  );
}
