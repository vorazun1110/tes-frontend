"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Location, LocationPayload } from "@/types/api";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import LocationFormModal from "./Modal";
import {
  createLocation,
  deleteLocation,
  fetchLocations,
  updateLocation,
} from "@/services/location";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocationTable() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
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
    fetchLocations()
      .then((res) => setLocations(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) =>
      location.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [locations, search]);

  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLocations.slice(start, start + rowsPerPage);
  }, [filteredLocations, currentPage]);

  const totalPages = Math.ceil(filteredLocations.length / rowsPerPage);

  const handleSubmit = async (payload: LocationPayload) => {
    if (editLocation) {
      const res = await updateLocation(editLocation.id, payload);
      setLocations((prev) =>
        prev.map((d) => (d.id === editLocation.id ? res.data : d)),
      );
    } else {
      const res = await createLocation(payload);
      setLocations((prev) => [res.data, ...prev]);
    }
    setIsModalOpen(false);
    setEditLocation(null);
  };

  const handleDelete = async (id: number) => {
    await deleteLocation(id);
    setLocations((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-white/[0.03]">
      {/* Tabs */}
      <div className="px-4 pt-4">
        <div
          role="tablist"
          aria-label="Fuel location tabs"
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

      {/* Toolbar (only for location tab) */}
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
            setEditLocation(null);
            setIsModalOpen(true);
          }}
        >
          + Нэмэх
        </Button>
      </div>

      {/* Content */}
      {loading ? <TableSkeleton rows={5} columns={4} /> : (
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
                  <TableCell isHeader className="w-24 text-center">
                    Үйлдэл
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLocations.map((location, index) => {
                  return (
                    <TableRow key={location.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <TableCell className="text-center font-medium text-gray-500">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {location.name}
                      </TableCell>
                      <TableCell>
                        {location.locationName}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditLocation(location);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => {
                              openConfirm(() => handleDelete(location.id), {
                                title: "Мэдээлэл устгах",
                                description: `"${location.name}" утгатай ачилтын хэмжээг устгах уу?`,
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

            {/* Modals only relevant for location tab */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <LocationFormModal
                editLocation={editLocation}
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
