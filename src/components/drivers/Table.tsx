"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Driver } from "@/types/api";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import { createDriver, deleteDriver, fetchDrivers, updateDriver } from "@/services/driver";
import DriverFormModal from "./Modal";

export default function DriverTable() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const {
    isOpen: isConfirmOpen,
    confirm: openConfirm,
    options: confirmOptions,
    handleClose: closeConfirm,
    handleConfirm: confirmDelete,
  } = useConfirmDialog();

  const rowsPerPage = 5;

  useEffect(() => {
    fetchDrivers()
      .then((res) => setDrivers(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) =>
      driver.firstname.toLowerCase().includes(search.toLowerCase())
    );
  }, [drivers, search]);

  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDrivers.slice(start, start + rowsPerPage);
  }, [filteredDrivers, currentPage]);

  const totalPages = Math.ceil(filteredDrivers.length / rowsPerPage);

  const handleSubmit = async (payload: Driver) => {
    try {
      if (editDriver) {
        const res = await updateDriver(editDriver.id, payload);
        setDrivers((prev) =>
          prev.map((d) => (d.id === editDriver.id ? res.data : d))
        );
      } else {
        const res = await createDriver(payload);
        setDrivers((prev) => [res.data, ...prev]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsModalOpen(false);
      setEditDriver(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDriver(id);
      setDrivers((prev) => prev.filter((d) => d.id !== id));
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
          placeholder="Нэр хайх..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-sm"
        />
        <Button className="ml-4" onClick={() => { setEditDriver(null); setIsModalOpen(true); }}>
          + Нэмэх
        </Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">#</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Нэр</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Овог</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Албан тушаал</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">РД</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Утасны дугаар</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Ачилтын машин</TableCell>
                <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Үйлдэл</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedDrivers.map((driver, index) => {
                return (
                  <TableRow key={driver.id} className="hover:bg-gray-100">
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {driver.firstname}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {driver.lastname}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {driver.position}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {driver.register}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {driver.phone}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      {driver.truck?.license_plate}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditDriver(driver);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            openConfirm(() => handleDelete(driver.id), {
                              title: "Мэдээлэл устгах",
                              description: `"${driver.firstname} ${driver.lastname}" нэртэй жолоочыг устгах уу?`,
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
        <DriverFormModal
          editDriver={editDriver}
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
