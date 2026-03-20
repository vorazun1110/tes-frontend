"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Volume } from "@/types/api";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import {
  createVolume,
  deleteVolume,
  fetchVolumes,
  updateVolume,
} from "@/services/volume";
import VolumeFormModal from "./Modal";

export default function VolumeTable() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVolume, setEditVolume] = useState<Volume | null>(null);
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
    fetchVolumes()
      .then((res) => setVolumes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredVolumes = useMemo(() => {
    return volumes.filter((volume) => volume.value.toString().includes(search));
  }, [volumes, search]);

  const paginatedVolumes = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredVolumes.slice(start, start + rowsPerPage);
  }, [filteredVolumes, currentPage]);

  const totalPages = Math.ceil(filteredVolumes.length / rowsPerPage);

  const handleSubmit = async (payload: Volume) => {
    if (editVolume) {
      const res = await updateVolume(editVolume.id, payload);
      setVolumes((prev) =>
        prev.map((d) => (d.id === editVolume.id ? res.data : d)),
      );
    } else {
      const res = await createVolume(payload);
      setVolumes((prev) => [res.data, ...prev]);
    }
    setIsModalOpen(false);
    setEditVolume(null);
  };

  const handleDelete = async (id: number) => {
    await deleteVolume(id);
    setVolumes((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-white/[0.03]">
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
            setEditVolume(null);
            setIsModalOpen(true);
          }}
        >
          + Нэмэх
        </Button>
      </div>
      {loading ? <TableSkeleton rows={5} columns={3} /> : (
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
                  Утга
                </TableCell>
                <TableCell isHeader className="w-24 text-center">
                  Үйлдэл
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVolumes.map((volume, index) => {
                return (
                  <TableRow key={volume.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <TableCell className="text-center font-medium text-gray-500">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {volume.value}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditVolume(volume);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            openConfirm(() => handleDelete(volume.id), {
                              title: "Мэдээлэл устгах",
                              description: `"${volume.value}" утгатай ачилтын хэмжээг устгах уу?`,
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
        <VolumeFormModal
          editVolume={editVolume}
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
