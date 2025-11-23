"use client";

import React, { useEffect, useMemo, useState } from "react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import { Distance } from "@/types/api";
import {
  DeliveryDetail,
  DeliveryReceivePayload,
  VehicleDetail,
} from "@/types/deliveries";
import { TextField } from "@mui/material";
import PropaneTankIcon from "@mui/icons-material/PropaneTank";
import BaseDeliverySelect from "./Autocomplete";

interface DeliveryReceiveModalProps {
  deliveryDetail: DeliveryDetail | null;
  onClose: () => void;
  onSubmit: (payload: DeliveryReceivePayload) => Promise<void>;
  distances?: Distance[];
}

export default function DeliveryReceiveModal({
  deliveryDetail,
  onClose,
  onSubmit,
  distances,
}: DeliveryReceiveModalProps) {
  const [outboundDistanceId, setOutboundDistanceId] = useState<number | null>(null);
  const [returnDistanceId, setReturnDistanceId] = useState<number | null>(null);
  const [densityMap, setDensityMap] = useState<Record<number, string | null>>({});
  const [outboundError, setOutboundError] = useState(false);
  const [returnError, setReturnError] = useState(false);
  const [densityErrors, setDensityErrors] = useState<Record<number, boolean>>({});
  const [submitClicked, setSubmitClicked] = useState(false);

  const allFuelDetails: VehicleDetail[] = useMemo(() => {
    const truckDetails = deliveryDetail?.truck?.details || [];
    const trailerDetails = deliveryDetail?.trailer?.details || [];
    return [...truckDetails, ...trailerDetails];
  }, [deliveryDetail]);

  useEffect(() => {
    const initialDensity: Record<number, string | null> = {};
    const initialErrors: Record<number, boolean> = {};
    allFuelDetails.forEach((d) => {
      initialDensity[d.id] = "";
      initialErrors[d.id] = false;
    });
    setDensityMap(initialDensity);
    setDensityErrors(initialErrors);
  }, [allFuelDetails]);

  const mappedDistances = useMemo(() => {
    return distances?.map((d) => ({
      ...d,
      name: `${d.location1.name} → ${d.location2.name}`,
    })) ?? [];
  }, [distances]);

  const handleDensityChange = (id: number, value: string) => {
    setDensityMap((prev) => ({ ...prev, [id]: value }));
    setDensityErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleSubmit = async () => {
    setSubmitClicked(true);

    const newDensityErrors: Record<number, boolean> = {};
    let hasDensityError = false;

    Object.entries(densityMap).forEach(([id, val]) => {
      const isInvalid = !isValidDensity(val?.toString() ?? "");
      newDensityErrors[Number(id)] = isInvalid;
      if (isInvalid) hasDensityError = true;
    });

    const outboundInvalid = !outboundDistanceId;
    const returnInvalid = !returnDistanceId;

    setDensityErrors(newDensityErrors);
    setOutboundError(outboundInvalid);
    setReturnError(returnInvalid);

    if (hasDensityError || outboundInvalid || returnInvalid) return;

    const payload: DeliveryReceivePayload = {
      fromDistanceId: outboundDistanceId,
      toDistanceId: returnDistanceId,
      densityDetails: Object.entries(densityMap).map(([detailId, density]) => ({
        detailId: parseInt(detailId),
        density: Number(density ?? 0),
      })),
    };

    await onSubmit(payload);
    onClose();
  };


  const handleOutboundDistanceChange = (id: number | null) => {
    setOutboundDistanceId(id);
    setOutboundError(false);
  };

  const handleReturnDistanceChange = (id: number | null) => {
    setReturnDistanceId(id);
    setReturnError(false);
  };

  const isValidDensity = (val: string): boolean => {
    if (!val) return false;

    const num = Number(val);
    if (isNaN(num)) return false;

    const isInRange = num >= 0 && num <= 1;
    const hasValidPrecision = /^\d+(\.\d{1,4})?$/.test(val) || /^\d+$/.test(val);

    return isInRange && hasValidPrecision;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black">Гаралт хүлээн авах</h2>

      {/* Distance Selects */}
      <div className="grid md:grid-cols-2 gap-6">
        <BaseDeliverySelect
          label="Явсан зам"
          options={mappedDistances || []}
          valueId={outboundDistanceId}
          onChangeId={(id) => handleOutboundDistanceChange(id)}
          getOptionLabel={(d) => `${d.name} (${d.distance} км)`}
          getOptionId={(d) => d.id}
          error={outboundError}
          required={true}
        />

        <BaseDeliverySelect
          label="Буцах зам"
          options={mappedDistances || []}
          valueId={returnDistanceId}
          onChangeId={(id) => handleReturnDistanceChange(id)}
          getOptionLabel={(d) => `${d.name} (${d.distance} км)`}
          getOptionId={(d) => d.id}
          error={returnError}
          required={true}
        />
      </div>

      {/* Container Density Inputs */}
      <div className="space-y-4 mt-4">
        <Label>Нягт оруулах</Label>
        <div className="space-y-3">
          {allFuelDetails.map((detail) => (
            <div
              key={detail.id}
              className="flex items-center gap-4 border-b border-gray-300 py-2 dark:border-gray-700"
            >
              <div className="flex items-center gap-1 text-sm text-black dark:text-white min-w-[120px]">
                <PropaneTankIcon fontSize="small" />
                Лүүк: {detail.container.volume ?? "-"}л
              </div>

              <div className="h-4 w-px bg-gray-400" />

              <div className="text-sm text-black dark:text-white min-w-[100px]">
                Төрөл: {detail.fuel_type.name ?? "-"}
              </div>

              <div className="h-4 w-px bg-gray-400" />

              <TextField
                label="Нягт"
                value={densityMap[detail.id] ?? ""}
                onChange={(e) => handleDensityChange(detail.id, e.target.value)}
                type="text"
                error={submitClicked && densityErrors[detail.id]}
                helperText={
                  submitClicked && densityErrors[detail.id]
                    ? "0–1 хооронд, 4 оронтой хүртэл зөвшөөрнө"
                    : ""
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>
          Болих
        </Button>
        <Button onClick={handleSubmit}>Хадгалах</Button>
      </div>
    </div>
  );
}
