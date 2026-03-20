"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Driver, DriverPayload } from "@/types/api";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import {
  createDriver,
  deleteDriver,
  fetchDrivers,
  updateDriver,
} from "@/services/driver";
import DriverFormModal from "./Modal";
import { motion } from "framer-motion";
import TableSkeleton from "@/components/ui/table/TableSkeleton";

export default function DriverTable() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
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

  const rowsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetchDrivers()
      .then((res) => setDrivers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) =>
      driver.firstname.toLowerCase().includes(search.toLowerCase()),
    );
  }, [drivers, search]);

  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDrivers.slice(start, start + rowsPerPage);
  }, [filteredDrivers, currentPage]);

  const totalPages = Math.ceil(filteredDrivers.length / rowsPerPage);

  const handleSubmit = async (payload: DriverPayload) => {
    if (editDriver) {
      const res = await updateDriver(editDriver.id, payload);
      setDrivers((prev) =>
        prev.map((d) => (d.id === editDriver.id ? res.data : d)),
      );
    } else {
      const res = await createDriver(payload);
      setDrivers((prev) => [res.data, ...prev]);
    }
    setIsModalOpen(false);
    setEditDriver(null);
  };

  const handleDelete = async (id: number) => {
    await deleteDriver(id);
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-dark-900">
      <div className="flex items-center justify-between p-4">
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
        <Button
          className="ml-4"
          onClick={() => {
            setEditDriver(null);
            setIsModalOpen(true);
          }}
        >
          + Нэмэх
        </Button>
      </div>
      {loading ? <TableSkeleton rows={5} columns={8} /> : (
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
                  Овог
                </TableCell>
                <TableCell isHeader>
                  Албан тушаал
                </TableCell>
                <TableCell isHeader>
                  РД
                </TableCell>
                <TableCell isHeader>
                  Утасны дугаар
                </TableCell>
                <TableCell isHeader>
                  Ачилтын машин
                </TableCell>
                <TableCell isHeader className="w-24 text-center">
                  Үйлдэл
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDrivers.map((driver, index) => {
                return (
                  <TableRow key={driver.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <TableCell className="text-center font-medium text-gray-500">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {driver.firstname}
                    </TableCell>
                    <TableCell>
                      {driver.lastname}
                    </TableCell>
                    <TableCell>
                      {driver.position}
                    </TableCell>
                    <TableCell>
                      {driver.register}
                    </TableCell>
                    <TableCell>
                      {driver.phone}
                    </TableCell>
                    <TableCell>
                      {driver.truck?.license_plate}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditDriver(driver);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Pencil size={16} />
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
    </motion.div>
  );
}
