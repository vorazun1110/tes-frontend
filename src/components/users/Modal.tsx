"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { User, UserPayload } from "@/types/api";
import Select from "../form/Select";

interface UserFormModalProps {
  editUser: User | null;
  onClose: () => void;
  onSubmit: (payload: UserPayload) => Promise<void>;
}

export default function UserFormModal({ editUser, onClose, onSubmit }: UserFormModalProps) {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<"manager" | "inspector">("manager");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (editUser) {
      setFirstname(editUser.firstname);
      setLastname(editUser.lastname);
      setUsername(editUser.username);
      setRole(editUser.role);
      setPassword("");
    } else {
      setFirstname("");
      setLastname("");
      setUsername("");
      setRole("manager");
      setPassword("");
    }
  }, [editUser]);

  const handleSubmit = async () => {
    const payload: UserPayload = {
      username: username,
      role: role,
      password: password,
      firstname: firstname,
      lastname: lastname,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {editUser ? "Хэрэглэгчийн засах" : "Хэрэглэгчийн нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <Label htmlFor="username">Нэвтрэх нэр</Label>
          <Input
            id="username"
            type="text"
            placeholder="Нэвтрэх нэр"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="role">Үүрэг</Label>
          <Select
            placeholder="Үүрэг"
            options={[{ value: "manager", label: "Менежер" }, { value: "inspector", label: "Шалгагч" }]}
            defaultValue={role as "manager" | "inspector"}
            onChange={(e) => setRole(e as "manager" | "inspector")}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="firstname">Нэр</Label>
          <Input
            id="firstname"
            type="text"
            placeholder="Нэр"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="lastname">Овог</Label>
          <Input
            id="lastname"
            type="text"
            placeholder="Овог"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="password">Нууц үг</Label>
          <Input
            id="password"
            type="text"
            placeholder="Нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit}>{editUser ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
