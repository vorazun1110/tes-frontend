"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Select from "../form/Select";
import { Driver, Trailer, Truck, TruckPayload } from "@/types/api";
import { Trash2 } from "lucide-react";
import { fetchTrailers } from "@/services/trailer";
import { fetchDrivers } from "@/services/driver";

interface TruckFormModalProps {
  editTruck: Truck | null;
  onClose: () => void;
  onSubmit: (payload: TruckPayload) => Promise<void>;
}

export default function TruckFormModal({ editTruck, onClose, onSubmit }: TruckFormModalProps) {
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [trailerId, setTrailerId] = useState<number | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [containers, setContainers] = useState<{ volume: number }[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    fetchTrailers().then((res) => setTrailers(res.data));
  }, []);

  useEffect(() => {
    fetchDrivers().then((res) => setDrivers(res.data));
  }, []);

  useEffect(() => {
    if (editTruck) {
      setLicensePlate(editTruck.license_plate);
      setContainers(editTruck.containers.map((c) => ({ volume: c.volume || 0 })));
      setTrailerId(editTruck.trailer?.id || null);
      setDriverId(editTruck.driver_id || null);
    } else {
      setLicensePlate("");
      setContainers([]);
      setTrailerId(null);
      setDriverId(null);
    }
  }, [editTruck]);

  const handleAddContainer = () => {
    setContainers((prev) => [...prev, { volume: 0 }]);
  };

  const handleChangeContainer = (index: number, volume: number) => {
    setContainers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, volume } : item))
    );
  };

  const handleRemoveContainer = (index: number) => {
    setContainers((prev) => prev.filter((_, i) => i !== index));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const payload: TruckPayload = {
      trailer_id: trailerId,
      driver_id: driverId,
      tire_wear: 0,
      last_battery_changed_at: "",
      last_inspected_at: "",
      license_plate: licensePlate,
      containers: containers.map((c) => ({ volume: c.volume || 0 })),
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
        {editTruck ? "Ачилтын машин засах" : "Ачилтын машин нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="license-plate">Улсын дугаар</Label>
          <Input
            id="license-plate"
            type="text"
            placeholder="1234УБА"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="trailer-id">Чиргүүл</Label>
          <Select
            options={trailers.map((t) => ({ value: t.id.toString(), label: t.license_plate }))}
            defaultValue={editTruck ? editTruck.trailer?.id?.toString() || "" : ""}
            onChange={(selected) => setTrailerId(parseInt(selected))}
          />
        </div>
        <div>
          <Label htmlFor="driver">Жолооч</Label>
          <Select
            options={drivers.map((d) => ({ value: d.id.toString(), label: `${d.firstname} ${d.lastname}` }))}
            defaultValue={editTruck ? editTruck.driver_id?.toString() || "" : ""}
            onChange={(selected) => setDriverId(parseInt(selected))}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <Label>Чингэлгүүд</Label>
          <Button variant="outline" size="sm" onClick={handleAddContainer}>
            + Нэмэх
          </Button>
        </div>
        {containers.map((container, index) => (
          <div
            key={index}
            className="relative mt-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
          >
            <Input
              type="number"
              placeholder="Утга"
              value={container.volume}
              onChange={(e) => handleChangeContainer(index, parseInt(e.target.value))}
            />
            <button
              onClick={() => handleRemoveContainer(index)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit} disabled={loading}>{loading ? "Түр хүлээнэ үү..." : editTruck ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
