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
import Badge from "../ui/badge/Badge";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import LocationFormModal from "./Modal";
import { createLocation, deleteLocation, fetchLocations, updateLocation } from "@/services/location";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocationTable() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  const rowsPerPage = 5;

  useEffect(() => {
    fetchLocations()
      .then((res) => setLocations(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) =>
      location.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [locations, search]);

  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLocations.slice(start, start + rowsPerPage);
  }, [filteredLocations, currentPage]);

  const totalPages = Math.ceil(filteredLocations.length / rowsPerPage);

  const handleSubmit = async (payload: LocationPayload) => {
    try {
      if (editLocation) {
        const res = await updateLocation(editLocation.id, payload);
        setLocations((prev) =>
          prev.map((d) => (d.id === editLocation.id ? res.data : d))
        );
      } else {
        const res = await createLocation(payload);
        setLocations((prev) => [res.data, ...prev]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsModalOpen(false);
      setEditLocation(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Tabs */}
      <div className="px-4 pt-4">
        <div
          role="tablist"
          aria-label="Fuel location tabs"
          className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.05]"
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

          <span className="select-none text-gray-300 dark:text-white/30">|</span>

          <Link
            href="/fuel-locations/distances"
            role="tab"
            aria-selected={pathname === "/fuel-locations/distances"}
            aria-current={pathname === "/fuel-locations/distances" ? "page" : undefined}
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
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          (
          <>
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">#</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Нэр</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Байршил</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">Үйлдэл</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedLocations.map((location, index) => {
                  return (
                    <TableRow key={location.id} className="hover:bg-gray-700">
                      <TableCell className="px-5 py-4 text-start text-theme-sm">
                        <Badge color="primary">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-theme-sm">
                        <Badge color="primary">{location.name}</Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-theme-sm">
                        <Badge color="primary">
                          {location.latitude}, {location.longitude}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-theme-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditLocation(location);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil size={18} />
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
              <div className="p-4 text-red-500 font-medium text-sm">
                Error: {error}
              </div>
            )}

            <div className="flex justify-end p-4">
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
          </>
        </div>
      </div>
    </div>
  );
}
