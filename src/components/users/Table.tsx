"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { User, UserPayload } from "@/types/api";
import Badge from "../ui/badge/Badge";
import { Input } from "../ui/input";
import Pagination from "../ui/pagination";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/services/user";
import UserFormModal from "./Modal";

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const {
    isOpen: isConfirmOpen,
    confirm: openConfirm,
    options: confirmOptions,
    handleClose: closeConfirm,
    handleConfirm: confirmDelete,
  } = useConfirmDialog();

  const rowsPerPage = 10;

  useEffect(() => {
    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleSubmit = async (payload: UserPayload) => {
    try {
      if (editUser) {
        const res = await updateUser(editUser.id, payload);
        setUsers((prev) =>
          prev.map((d) => (d.id === editUser.id ? res.data : d)),
        );
      } else {
        const res = await createUser(payload);
        setUsers((prev) => [res.data, ...prev]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsModalOpen(false);
      setEditUser(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between p-4">
        <Input
          type="text"
          placeholder="Нэвтрэх нэр хайх..."
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
            setEditUser(null);
            setIsModalOpen(true);
          }}
        >
          + Нэмэх
        </Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                >
                  #
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                >
                  Нэвтрэх нэр
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                >
                  Үүрэг
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                >
                  Нэр
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                >
                  Овог
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                >
                  Үйлдэл
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedUsers.map((user, index) => {
                return (
                  <TableRow key={user.id} className="hover:bg-gray-100">
                    <TableCell className="text-theme-sm px-5 py-4 text-start">
                      <Badge color="primary">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm px-5 py-4 text-start">
                      <Badge color="primary">{user.username}</Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={
                          user.role === "manager"
                            ? "success"
                            : user.role === "inspector"
                              ? "warning"
                              : "error"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm px-5 py-4 text-start">
                      <Badge color="primary">{user.firstname}</Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm px-5 py-4 text-start">
                      <Badge color="primary">{user.lastname}</Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm px-5 py-4 text-start">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditUser(user);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            openConfirm(() => handleDelete(user.id), {
                              title: "Мэдээлэл устгах",
                              description: `"${user.firstname} ${user.lastname}" нэртэй жолоочыг устгах уу?`,
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
            <div className="p-4 text-sm font-medium text-red-500">
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
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserFormModal
          editUser={editUser}
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
