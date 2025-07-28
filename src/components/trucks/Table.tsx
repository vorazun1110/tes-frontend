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
import Badge from "../ui/badge/Badge";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import TruckFormModal from "./Modal";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";

export default function TruckTable() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTruck, setEditTruck] = useState<Truck | null>(null);
  const {
    isOpen: isConfirmOpen,
    confirm: openConfirm,
    options: confirmOptions,
    handleClose: closeConfirm,
    handleConfirm: confirmDelete,
  } = useConfirmDialog();

  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

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

  const handleDelete = async () => {
    if (pendingDeleteId === null) return;
    try {
      await deleteTruck(pendingDeleteId);
      setTrucks((prev) => prev.filter((t) => t.id !== pendingDeleteId));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setPendingDeleteId(null);
    }
  };



  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">#</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Улсын дугаар</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Чингэлэгийн тоо</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Нийт хэмжээ</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Үйлдэл</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedTrucks.map((truck, index) => {
                const containerCount = truck.containers.length;
                const totalVolume = truck.containers.reduce(
                  (sum, c) => sum + (c.volume || 0),
                  0
                );

                return (
                  <TableRow key={truck.id} className="hover:bg-gray-500">
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <Badge color="primary">{(currentPage - 1) * rowsPerPage + index + 1}</Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <Badge color="primary">{truck.license_plate}</Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <Badge color="info">{containerCount} ш</Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <Badge color="primary">{totalVolume.toLocaleString()} л</Badge>
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
                            setPendingDeleteId(truck.id);
                            openConfirm(handleDelete, {
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
