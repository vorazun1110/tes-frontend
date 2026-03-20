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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const payload: Volume = {
      id: editVolume?.id || 0,
      value: parseInt(value),
    };
    setLoading(true);
    try {
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
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
        <Button onClick={handleSubmit} disabled={loading}>{loading ? "Түр хүлээнэ үү..." : editVolume ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
