"use client";

import React, { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import DatePicker from "../form/date-picker";
import dayjs from "dayjs";
import {
  Delivery,
  DeliveryUpsertPayload,
  DeliveryFuelDetailPayload,
} from "@/types/deliveries";
import { Location, Driver, Truck, Trailer, FuelType } from "@/types/api";

interface DeliveryFormModalProps {
  editDelivery: Delivery | null;
  onClose: () => void;
  onSubmit: (payload: DeliveryUpsertPayload) => Promise<void>;

  drivers: Driver[];
  locations: Location[];
  trucks: Truck[];
  trailers: Trailer[];
  fuelTypes: FuelType[];
}

export default function DeliveryFormModal({
  editDelivery,
  onClose,
  onSubmit,
  drivers,
  locations,
  trucks,
  trailers,
  fuelTypes,
}: DeliveryFormModalProps) {
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [driverId, setDriverId] = useState<number>(0);
  const [fromLocationId, setFromLocationId] = useState<number>(0);
  const [toLocationId, setToLocationId] = useState<number>(0);
  const [truckId, setTruckId] = useState<number>(0);
  const [trailerId, setTrailerId] = useState<number>(0);

  const [truckContainers, setTruckContainers] = useState<DeliveryFuelDetailPayload[]>([]);
  const [trailerContainers, setTrailerContainers] = useState<DeliveryFuelDetailPayload[]>([]);

  // Load edit mode
  useEffect(() => {
    if (editDelivery) {
      setDate(editDelivery.date);
      setDriverId(editDelivery.driver.id);
      setFromLocationId(editDelivery.fromLocation.id);
      setToLocationId(editDelivery.toLocation.id);
      setTruckId(editDelivery.truck.id);
      setTrailerId(editDelivery.trailers?.id ?? 0);

      setTruckContainers(
        editDelivery.truck.fuelDetails?.map((fd) => ({
          containerId: fd.containerId,
          fuelTypeId: fd.fuelTypeId,
        })) || []
      );

      setTrailerContainers(
        editDelivery.trailers?.fuelDetails?.map((fd) => ({
          containerId: fd.containerId,
          fuelTypeId: fd.fuelTypeId,
        })) || []
      );
    } else {
      const today = dayjs().format("YYYY-MM-DD");
      setDate(today);
      setDriverId(0);
      setFromLocationId(0);
      setToLocationId(0);
      setTruckId(0);
      setTrailerId(0);
      setTruckContainers([]);
      setTrailerContainers([]);
    }
  }, [editDelivery]);

  const currentTruck = useMemo(() => trucks.find((t) => t.id === truckId) || null, [trucks, truckId]);
  const currentTrailer = useMemo(() => trailers.find((t) => t.id === trailerId) || null, [trailers, trailerId]);

  // Auto-fill based on driver
  const handleDriverChange = (value: number) => {
    setDriverId(value);
    const driver = drivers.find((d) => d.id === value);
    if (driver?.truck) {
      setTruckId(driver.truck.id);
      const trailerId = driver.truck.trailer?.id || driver.truck.trailer_id || 0;
      setTrailerId(trailerId);

      const truckFromList = trucks.find((t) => t.id === driver.truck!.id);
      if (truckFromList?.containers?.length) {
        setTruckContainers(
          truckFromList.containers.map((c) => ({
            containerId: c.id,
            fuelTypeId: fuelTypes?.[0]?.id || 1,
          }))
        );
      }
    } else {
      setTruckId(0);
      setTrailerId(0);
      setTruckContainers([]);
      setTrailerContainers([]);
    }
  };

  // Truck & trailer updates
  const handleTruckChange = (value: number) => {
    setTruckId(value);
    const truck = trucks.find((t) => t.id === value);
    if (truck?.trailer_id) setTrailerId(truck.trailer_id);
    if (truck?.containers?.length) {
      setTruckContainers(
        truck.containers.map((c) => ({
          containerId: c.id,
          fuelTypeId: fuelTypes?.[0]?.id || 1,
        }))
      );
    } else setTruckContainers([]);
  };

  const handleTrailerChange = (value: number) => {
    setTrailerId(value);
    const trailer = trailers.find((t) => t.id === value);
    if (trailer?.containers?.length) {
      setTrailerContainers(
        trailer?.containers?.map((c) => ({
          containerId: c.id || 0,
          fuelTypeId: fuelTypes?.[0]?.id || 1,
        }))
      );
    } else setTrailerContainers([]);
  };

  // Utility methods
  const handleContainerAdd = (target: "truck" | "trailer", containerId: number) => {
    const updater = target === "truck" ? setTruckContainers : setTrailerContainers;
    const state = target === "truck" ? truckContainers : trailerContainers;

    if (state.some((c) => c.containerId === containerId)) return;
    updater([
      ...state,
      { containerId, fuelTypeId: fuelTypes?.[0]?.id || 1 },
    ]);
  };

  const handleContainerRemove = (target: "truck" | "trailer", containerId: number) => {
    const updater = target === "truck" ? setTruckContainers : setTrailerContainers;
    updater((prev) => prev.filter((c) => c.containerId !== containerId));
  };

  const handleFuelTypeChange = (target: "truck" | "trailer", containerId: number, fuelTypeId: number) => {
    const updater = target === "truck" ? setTruckContainers : setTrailerContainers;
    updater((prev) =>
      prev.map((c) => (c.containerId === containerId ? { ...c, fuelTypeId } : c))
    );
  };

  const handleSubmit = async () => {
    const payload: DeliveryUpsertPayload = {
      date,
      driverId,
      fromLocationId,
      toLocationId,
      truck: {
        id: truckId,
        fuelDetails: truckContainers,
      },
      trailer: {
        id: trailerId,
        fuelDetails: trailerContainers
      }
    };
    await onSubmit(payload);
    onClose();
  };

  const renderContainerSection = (
    title: string,
    target: "truck" | "trailer",
    containers: DeliveryFuelDetailPayload[],
    available: { id: number; volume: number }[] = []
  ) => (
    <div className="space-y-3 border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/30">
      <h3 className="text-base font-semibold text-black">{title}</h3>

      {containers.length === 0 ? (
        <p className="text-sm text-gray-400">Лүүк сонгогдоогүй байна.</p>
      ) : (
        <div className="grid gap-2">
          {containers.map((c) => (
            <div
              key={c.containerId}
              className="flex items-center justify-between bg-white/10 px-3 py-2 rounded-md dark:bg-white/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-sm text-black dark:text-white/90 font-medium">
                  Лүүк ID: {c.containerId}
                </span>
                <select
                  value={c.fuelTypeId}
                  onChange={(e) => handleFuelTypeChange(target, c.containerId, Number(e.target.value))}
                  className="h-9 rounded-md border px-2 text-sm bg-transparent text-black dark:text-white border-gray-600 dark:border-gray-500"
                >
                  {fuelTypes.map((ft) => (
                    <option key={ft.id} value={ft.id}>
                      {ft.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleContainerRemove(target, c.containerId)}
              >
                Устгах
              </Button>
            </div>
          ))}
        </div>
      )}

      {available.length > 0 && (
        <div className="mt-3">
          <Label className="text-sm text-white/80">Нэмэх боломжтой</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {available
              .filter((a) => !containers.some((c) => c.containerId === a.id))
              .map((a) => (
                <Button
                  key={a.id}
                  size="sm"
                  variant="outline"
                  onClick={() => handleContainerAdd(target, a.id)}
                >
                  Лүүк {a.id} ({a.volume}л)
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black">
        {editDelivery ? "Хүргэлт засах" : "Хүргэлт нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="date">Огноо</Label>
          <DatePicker
            id="date"
            mode="single"
            onChange={(dates, dateStr) => setDate(dateStr || "")}
            defaultDate={new Date(date)}
          />
        </div>

        <div>
          <Label htmlFor="driver">Жолооч</Label>
          <select
            id="driver"
            value={driverId}
            onChange={(e) => handleDriverChange(Number(e.target.value))}
            className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent text-gray-800 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          >
            <option value={0}>Сонгох...</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.lastname} {d.firstname}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="from-location">Ачилт (хаанаас)</Label>
          <select
            id="from-location"
            value={fromLocationId}
            onChange={(e) => setFromLocationId(Number(e.target.value))}
            className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent text-gray-800 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          >
            <option value={0}>Сонгох...</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="to-location">Хүргэлт (хаашаа)</Label>
          <select
            id="to-location"
            value={toLocationId}
            onChange={(e) => setToLocationId(Number(e.target.value))}
            className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent text-gray-800 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          >
            <option value={0}>Сонгох...</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="truck">Машин</Label>
          <select
            id="truck"
            value={truckId}
            onChange={(e) => handleTruckChange(Number(e.target.value))}
            className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent text-gray-800 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          >
            <option value={0}>Сонгох...</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.license_plate}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="trailer">Чиргүүл</Label>
          <select
            id="trailer"
            value={trailerId}
            onChange={(e) => handleTrailerChange(Number(e.target.value))}
            className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent text-gray-800 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          >
            <option value={0}>Сонгохгүй</option>
            {trailers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.license_plate}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Separated sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {renderContainerSection("Машины Лүүк", "truck", truckContainers, currentTruck?.containers?.map((c) => ({ id: c.id || 0, volume: c.volume || 0 })))}
        {renderContainerSection("Чиргүүлийн Лүүк", "trailer", trailerContainers, currentTrailer?.containers?.map((c) => ({ id: c.id || 0, volume: c.volume || 0 })))}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>
          Болих
        </Button>
        <Button onClick={handleSubmit}>
          {editDelivery ? "Засах" : "Нэмэх"}
        </Button>
      </div>
    </div>
  );
}
