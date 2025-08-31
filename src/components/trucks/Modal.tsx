"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Select from "../form/Select";
import { fetchVolumes } from "@/services/volume";
import { Truck, TruckPayload, Volume } from "@/types/api";
import { Trash2 } from "lucide-react";

interface TruckFormModalProps {
  editTruck: Truck | null;
  onClose: () => void;
  onSubmit: (payload: TruckPayload) => Promise<void>;
}

export default function TruckFormModal({ editTruck, onClose, onSubmit }: TruckFormModalProps) {
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [type, setType] = useState<"trailer" | "truck">("truck");
  const [containers, setContainers] = useState<{ volumeId: number }[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);

  useEffect(() => {
    fetchVolumes().then((res) => setVolumes(res.data));
  }, []);

  useEffect(() => {
    if (editTruck) {
      setLicensePlate(editTruck.license_plate);
      setContainers(editTruck.containers.map((c) => ({ volumeId: c.id })));
      setType(editTruck.type);
    } else {
      setLicensePlate("");
      setContainers([]);
      setType("truck");
    }
  }, [editTruck]);

  const handleAddContainer = () => {
    setContainers((prev) => [...prev, { volumeId: volumes[0].id }]);
  };

  const handleChangeContainer = (index: number, volumeId: number) => {
    setContainers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, volumeId } : item))
    );
  };

  const handleRemoveContainer = (index: number) => {
    setContainers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload: TruckPayload = {
      type,
      licensePlate: licensePlate,
      containers: containers.map((c) => ({ volumeId: c.volumeId })),
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {editTruck ? "Ачилтын машин засах" : "Ачилтын машин нэмэх"}
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
          <Label htmlFor="type">Төрөл</Label>
          <Select
            options={[{ value: "truck", label: "Ачилтын машин" }, { value: "trailer", label: "Чиргүүл" }]}
            defaultValue={editTruck ? editTruck.type : "truck"}
            onChange={(selected) => setType(selected as "trailer" | "truck")}
          />
        </div>

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
              <Select
                options={volumes.map((v) => ({ value: v.id.toString(), label: `${v.value} л` }))}
                defaultValue={container.volumeId.toString()}
                onChange={(selected) => handleChangeContainer(index, parseInt(selected))}
                className="w-full dark:bg-dark-900"
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
        <Button onClick={handleSubmit}>{editTruck ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
