"use client";

import React, { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { Distance } from "@/types/api";
import { Delivery, DeliveryFuelDetail, DeliveryReceivePayload } from "@/types/deliveries";

interface ReceiveFormModalProps {
  receiveDelivery: Delivery | null;
  onClose: () => void;
  onSubmit: (payload: DeliveryReceivePayload) => Promise<void>;
  distances: Distance[];
}

export default function ReceiveFormModal({
  receiveDelivery,
  onClose,
  onSubmit,
  distances,
}: ReceiveFormModalProps) {
  const [outboundDistanceId, setOutboundDistanceId] = useState<number>(0);
  const [returnDistanceId, setReturnDistanceId] = useState<number>(0);
  const [densityMap, setDensityMap] = useState<Record<number, number>>({}); // detailId -> density

  const allFuelDetails: DeliveryFuelDetail[] = useMemo(() => {
    const truckDetails = receiveDelivery?.truck?.fuelDetails || [];
    const trailerDetails = receiveDelivery?.trailers?.fuelDetails || [];
    return [...truckDetails, ...trailerDetails];
  }, [receiveDelivery]);

  useEffect(() => {
    const defaultMap: Record<number, number> = {};
    allFuelDetails.forEach((d) => {
      defaultMap[d.id] = d.density ?? 0;
    });
    setDensityMap(defaultMap);
  }, [allFuelDetails]);

  const handleDensityChange = (id: number, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setDensityMap((prev) => ({ ...prev, [id]: parsed }));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      outboundDistanceId,
      returnDistanceId,
      densityDetails: Object.entries(densityMap).map(([detailId, density]) => ({
        detailId: parseInt(detailId),
        density,
      })),
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black">Хүргэлт хүлээн авах</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="outbound">Явсан зам</Label>
          <select
            id="outbound"
            value={outboundDistanceId}
            onChange={(e) => setOutboundDistanceId(Number(e.target.value))}
            className="w-full h-11 border rounded-lg px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          >
            <option value={0}>Сонгох...</option>
            {distances.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.distance} км)
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="return">Буцах зам</Label>
          <select
            id="return"
            value={returnDistanceId}
            onChange={(e) => setReturnDistanceId(Number(e.target.value))}
            className="w-full h-11 border rounded-lg px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          >
            <option value={0}>Сонгох...</option>
            {distances.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.distance} км)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Нягт оруулах</Label>
        <div className="grid gap-3">
          {allFuelDetails.map((detail) => (
            <div
              key={detail.id}
              className="flex items-center justify-between bg-white/10 px-3 py-2 rounded-md dark:bg-white/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-sm text-black dark:text-white/90 font-medium">
                  Лүүк ID: {detail.id} | Төрөл: {detail.fuelType}
                </span>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Нягт"
                  className="h-9 w-32 rounded-md border px-3 text-sm text-black dark:text-white border-gray-600 dark:border-gray-500"
                  value={densityMap[detail.id] ?? ""}
                  onChange={(e) => handleDensityChange(detail.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>
          Болих
        </Button>
        <Button onClick={handleSubmit}>Хадгалах</Button>
      </div>
    </div>
  );
}
