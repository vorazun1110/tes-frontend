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
import Badge from "../ui/badge/Badge";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import { createVolume, deleteVolume, fetchVolumes, updateVolume } from "@/services/volume";
import VolumeFormModal from "./Modal";

export default function VolumeTable() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  const rowsPerPage = 5;

  useEffect(() => {
    fetchVolumes()
      .then((res) => setVolumes(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const filteredVolumes = useMemo(() => {
    return volumes.filter((volume) =>
      volume.value.toString().includes(search)
    );
  }, [volumes, search]);

  const paginatedVolumes = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredVolumes.slice(start, start + rowsPerPage);
  }, [filteredVolumes, currentPage]);

  const totalPages = Math.ceil(filteredVolumes.length / rowsPerPage);

  const handleSubmit = async (payload: Volume) => {
    try {
      if (editVolume) {
        const res = await updateVolume(editVolume.id, payload);
        setVolumes((prev) =>
          prev.map((d) => (d.id === editVolume.id ? res.data : d))
        );
      } else {
        const res = await createVolume(payload);
        setVolumes((prev) => [res.data, ...prev]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsModalOpen(false);
      setEditVolume(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVolume(id);
      setVolumes((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };



  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex justify-between items-center">
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
        <Button className="ml-4" onClick={() => { setEditVolume(null); setIsModalOpen(true); }}>
          + Нэмэх
        </Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">#</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Утга</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Үйлдэл</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedVolumes.map((volume, index) => {
                return (
                  <TableRow key={volume.id} className="hover:bg-gray-700">
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <Badge color="primary">{(currentPage - 1) * rowsPerPage + index + 1}</Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <Badge color="primary">{volume.value}</Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditVolume(volume);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
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
      </div>

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
    </div>
  );
}
