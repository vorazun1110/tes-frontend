"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { Volume } from "@/types/api";

interface VolumeFormModalProps {
  editVolume: Volume | null;
  onClose: () => void;
  onSubmit: (payload: Volume) => Promise<void>;
}

export default function VolumeFormModal({ editVolume, onClose, onSubmit }: VolumeFormModalProps) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (editVolume) {
      setValue(editVolume.value.toString());
    } else {
      setValue("0");
    }
  }, [editVolume]);

  const handleSubmit = async () => {
    const payload: Volume = {
      id: editVolume?.id || 0,
      value: parseInt(value),
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {editVolume ? "Утга засах" : "Утга нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <Label htmlFor="value">Утга</Label>
          <Input
            id="value"
            type="text"
            placeholder="Утга"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit}>{editVolume ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
