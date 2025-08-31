"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { Driver } from "@/types/api";

interface DriverFormModalProps {
  editDriver: Driver | null;
  onClose: () => void;
  onSubmit: (payload: Driver) => Promise<void>;
}

export default function DriverFormModal({ editDriver, onClose, onSubmit }: DriverFormModalProps) {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");

  useEffect(() => {
    if (editDriver) {
      setFirstname(editDriver.firstname);
      setLastname(editDriver.lastname);
    } else {
      setFirstname("");
      setLastname("");
    }
  }, [editDriver]);

  const handleSubmit = async () => {
    const payload: Driver = {
      id: editDriver?.id || 0,
      firstname: firstname,
      lastname: lastname,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {editDriver ? "Жолооч засах" : "Жолооч нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit}>{editDriver ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
