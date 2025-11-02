"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { Container, Trailer, TrailerPayload } from "@/types/api";
import { Trash2 } from "lucide-react";

interface TrailerFormModalProps {
  editTrailer: Trailer | null;
  onClose: () => void;
  onSubmit: (payload: TrailerPayload) => Promise<void>;
}

export default function TrailerFormModal({ editTrailer, onClose, onSubmit }: TrailerFormModalProps) {
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    if (editTrailer) {
      setLicensePlate(editTrailer.license_plate);
      setContainers(editTrailer.containers);
    }
  }, [editTrailer]);

  const handleAddContainer = () => {
    setContainers((prev) => [...prev, { volume: null }]);
  };

  const handleChangeContainer = (index: number, volume: number | null) => {
    setContainers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, volume } : item))
    );
  };

  const handleRemoveContainer = (index: number) => {
    setContainers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload: TrailerPayload = {
      license_plate: licensePlate,
      containers: containers.map((c) => ({ volume: c.volume || 0 })),
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {editTrailer ? "Чиргүүл засах" : "Чиргүүл нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <Label htmlFor="license-plate">Улсын дугаар</Label>
          <Input
            id="license-plate"
            type="text"
            placeholder="1234УБА"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <div className="col-span-2">
            <div className="flex justify-between items-center">
              <Label>Чингэлгүүд</Label>
              <Button variant="outline" onClick={handleAddContainer}>
                + Нэмэх
              </Button>
            </div>
            {containers.map((container, index) => (
              <div
                key={index}
                className="relative mt-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md"
              >
                <input
                  type="number"
                  placeholder="Утга"
                  value={container.volume || ""}
                  onChange={(e) => handleChangeContainer(index, parseInt(e.target.value))}
                />
                <button
                  onClick={() => handleRemoveContainer(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Болих</Button>
          <Button onClick={handleSubmit}>{editTrailer ? "Засах" : "Нэмэх"}</Button>
        </div>
      </div>
    </div>
  );
}
