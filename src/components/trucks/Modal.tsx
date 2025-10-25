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
import DatePicker from "../form/date-picker";

interface TruckFormModalProps {
  editTruck: Truck | null;
  onClose: () => void;
  onSubmit: (payload: TruckPayload) => Promise<void>;
}

export default function TruckFormModal({ editTruck, onClose, onSubmit }: TruckFormModalProps) {
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [trailerId, setTrailerId] = useState<number | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [tireWear, setTireWear] = useState<number>(0);
  const [lastBatteryChangedAt, setLastBatteryChangedAt] = useState<string>("");
  const [lastInspectedAt, setLastInspectedAt] = useState<string>("");
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
      setTireWear(editTruck.tire_wear || 0);
      setLastBatteryChangedAt(editTruck.last_battery_changed_at || "");
      setLastInspectedAt(editTruck.last_inspected_at || "");
    } else {
      setLicensePlate("");
      setContainers([]);
      setTrailerId(null);
      setDriverId(null);
      setTireWear(0);
      setLastBatteryChangedAt("");
      setLastInspectedAt("");
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

  const handleSubmit = async () => {
    const payload: TruckPayload = {
      trailer_id: trailerId,
      driver_id: driverId,
      tire_wear: tireWear,
      last_battery_changed_at: lastBatteryChangedAt,
      last_inspected_at: lastInspectedAt,
      license_plate: licensePlate,
      containers: containers.map((c) => ({ volume: c.volume || 0 })),
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4 w-full max-w-[1080px] overflow-x-hidden px-4 md:px-6">
      <h2 className="text-xl font-semibold text-white">
        {editTruck ? "Ачилтын машин засах" : "Ачилтын машин нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <Label htmlFor="license-plate">Улсын дугаар</Label>
          <Input
            className="w-full dark:bg-dark-900"
            id="license-plate"
            type="text"
            placeholder="1234УБА"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="trailer-id">Чиргүүл</Label>
          <Select
            options={trailers.map((t) => ({ value: t.id.toString(), label: t.license_plate }))}
            defaultValue={editTruck ? editTruck.trailer?.id?.toString() || "" : ""}
            onChange={(selected) => setTrailerId(parseInt(selected))}
          />
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="license-plate">Жолооч</Label>
          <Select
            options={drivers.map((d) => ({ value: d.id.toString(), label: `${d.firstname} ${d.lastname}` }))}
            defaultValue={editTruck ? editTruck.driver_id?.toString() || "" : ""}
            onChange={(selected) => setDriverId(parseInt(selected))}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="trailer-id">Аккумулятор шалгах хугацаа</Label>
          <DatePicker
            id="last-battery-changed-at"
            placeholder="Аккумулятор шалгах хугацаа"
            defaultDate={new Date(lastBatteryChangedAt)}
            onChange={(dates, currentDateString) => {
              setLastBatteryChangedAt(currentDateString);
            }}
          />
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="trailer-id">Үзлэгийн хугацаа</Label>
          <DatePicker
            id="last-inspected-at"
            placeholder="Үзлэгийн хугацаа"
            defaultDate={new Date(lastInspectedAt)}
            onChange={(dates, currentDateString) => {
              setLastInspectedAt(currentDateString);
            }}
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
              <Input
                type="number"
                placeholder="Утга"
                value={container.volume}
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

        <div className="md:col-span-1"> <Label htmlFor="tire-wear">Дугуйн гүйлт</Label>
          <Input type="number" placeholder="Ж: 12.5" value={tireWear} onChange={(e) => setTireWear(parseFloat(e.target.value))} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit}>{editTruck ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
