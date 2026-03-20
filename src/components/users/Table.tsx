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
import { motion } from "framer-motion";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
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
    if (editUser) {
      const res = await updateUser(editUser.id, payload);
      setUsers((prev) =>
        prev.map((d) => (d.id === editUser.id ? res.data : d)),
      );
    } else {
      const res = await createUser(payload);
      setUsers((prev) => [res.data, ...prev]);
    }
    setIsModalOpen(false);
    setEditUser(null);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-white/[0.03]">
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
      {loading ? <TableSkeleton rows={5} columns={6} /> : (
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
                  Нэвтрэх нэр
                </TableCell>
                <TableCell isHeader>
                  Үүрэг
                </TableCell>
                <TableCell isHeader>
                  Нэр
                </TableCell>
                <TableCell isHeader>
                  Овог
                </TableCell>
                <TableCell isHeader className="w-24 text-center">
                  Үйлдэл
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, index) => {
                return (
                  <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <TableCell className="text-center font-medium text-gray-500">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell>
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
                    <TableCell>
                      {user.firstname}
                    </TableCell>
                    <TableCell>
                      {user.lastname}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditUser(user);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Pencil size={16} />
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
    </motion.div>
  );
}
