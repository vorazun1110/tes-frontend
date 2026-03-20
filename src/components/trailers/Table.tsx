"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Trailer, TrailerPayload } from "@/types/api";
import {
  createTrailer,
  deleteTrailer,
  fetchTrailers,
  updateTrailer,
} from "@/services/trailer";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import TrailerFormModal from "./Modal";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TrailerTable() {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTrailer, setEditTrailer] = useState<Trailer | null>(null);
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
    fetchTrailers()
      .then((res) => setTrailers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredTrailers = useMemo(() => {
    return trailers.filter((trailer) =>
      trailer.license_plate.toLowerCase().includes(search.toLowerCase()),
    );
  }, [trailers, search]);

  const paginatedTrailers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTrailers.slice(start, start + rowsPerPage);
  }, [filteredTrailers, currentPage]);

  const totalPages = Math.ceil(filteredTrailers.length / rowsPerPage);

  const handleSubmit = async (payload: TrailerPayload) => {
    if (editTrailer) {
      const res = await updateTrailer(editTrailer.id, payload);
      setTrailers((prev) =>
        prev.map((t) => (t.id === editTrailer.id ? res.data : t)),
      );
    } else {
      const res = await createTrailer(payload);
      setTrailers((prev) => [res.data, ...prev]);
    }
    setIsModalOpen(false);
    setEditTrailer(null);
  };

  const handleDelete = async (id: number) => {
    await deleteTrailer(id);
    setTrailers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-white/[0.03]">
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

          <span className="text-gray-300 select-none dark:text-white/30">
            |
          </span>

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
            setEditTrailer(null);
            setIsModalOpen(true);
          }}
        >
          + Нэмэх
        </Button>
      </div>
      {loading ? <TableSkeleton rows={5} columns={7} /> : (
      <>
      <div className="max-w-full overflow-x-auto border-t border-gray-300 dark:border-gray-600">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  rowSpan={2}
                  className="w-12 text-center"
                >
                  #
                </TableCell>
                <TableCell
                  isHeader
                  rowSpan={2}
                >
                  Улсын дугаар
                </TableCell>

                <TableCell
                  isHeader
                  colSpan={4}
                  className="text-center"
                >
                  Багтаамж
                </TableCell>

                <TableCell
                  isHeader
                  rowSpan={2}
                  className="w-24 text-center"
                >
                  Үйлдэл
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  isHeader
                  className="text-center"
                >
                  Лүүк 1
                </TableCell>
                <TableCell
                  isHeader
                  className="text-center"
                >
                  Лүүк 2
                </TableCell>
                <TableCell
                  isHeader
                  className="text-center"
                >
                  Лүүк 3
                </TableCell>
                <TableCell
                  isHeader
                  className="text-center"
                >
                  Лүүк 4
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedTrailers.map((trailer, index) => {
                return (
                  <TableRow key={trailer.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <TableCell className="text-center font-medium text-gray-500">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {trailer.license_plate}
                    </TableCell>
                    <TableCell className="text-center">
                      {trailer.containers[0]?.volume || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {trailer.containers[1]?.volume || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {trailer.containers[2]?.volume || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {trailer.containers[3]?.volume || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditTrailer(trailer);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            openConfirm(() => handleDelete(trailer.id), {
                              title: "Мэдээлэл устгах",
                              description: `"${trailer.license_plate}" дугаартай машиныг устгах уу?`,
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
        </div>
      </div>
      </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TrailerFormModal
          editTrailer={editTrailer}
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
