"use client";

import React, { useEffect, useMemo, useState } from "react";
import Button from "../../ui/button/Button";
import {
  DailyData,
  DeliveryDetail,
  DeliveryUpsertPayload,
} from "@/types/deliveries";
import { Driver, Truck, Trailer, FuelType, Location, SelectedContainer } from "@/types/api";
import BaseDeliverySelect from "./Autocomplete";
import Container from "./Container";
import { Dayjs } from "dayjs";

interface DeliveryFormModalProps {
  date: Dayjs;
  mode: "daily" | "create" | "edit";
  deliveryDetail: DeliveryDetail | null;
  dailyData: DailyData | null;
  onClose: () => void;
  onSubmit: (payload: DeliveryUpsertPayload) => Promise<void>;
  drivers?: Driver[];
  trucks?: Truck[];
  trailers?: Trailer[];
  fuelTypes?: FuelType[];
  fromLocations?: Location[];
  toLocations?: Location[];
}

export default function DeliveryFormModal({
  date,
  mode,
  deliveryDetail,
  dailyData,
  onClose,
  onSubmit,
  drivers = [],
  trucks = [],
  trailers = [],
  fuelTypes = [],
  fromLocations = [],
  toLocations = [],
}: DeliveryFormModalProps) {
  const [driverId, setDriverId] = useState<number | null>(null);
  const [fromLocationId, setFromLocationId] = useState<number | null>(1);
  const [toLocationIds, setToLocationIds] = useState<number[]>([]);
  const [truckId, setTruckId] = useState<number | null>(null);
  const [trailerId, setTrailerId] = useState<number | null>(null);
  const [truckContainers, setTruckContainers] = useState<SelectedContainer[]>([]);
  const [trailerContainers, setTrailerContainers] = useState<SelectedContainer[]>([]);
  const [containerErrors, setContainerErrors] = useState<{ [key: number]: boolean }>({});

  const [errors, setErrors] = useState({
    driverId: false,
    fromLocationId: false,
    toLocationIds: false,
    truckId: false,
    truckFuelError: false,
    trailerFuelError: false,
  });

  useEffect(() => {
    if (mode === "edit" && deliveryDetail) {
      setDriverId(deliveryDetail.driver_id);
      setFromLocationId(deliveryDetail.from_location_id);
      setTruckId(deliveryDetail.truck.id ?? null);
      setTrailerId(deliveryDetail.trailer_id ?? null);
      setToLocationIds(deliveryDetail.delivery_locations);

      setTruckContainers(
        deliveryDetail.truck?.details?.map((d) => ({
          containerId: d.container.id,
          fuelTypeId: d.fuel_type.id,
        }))
      );

      setTrailerContainers(
        deliveryDetail.trailer?.details?.map((d) => ({
          containerId: d.container.id,
          fuelTypeId: d.fuel_type.id,
        }))
      );
    } else if (mode === "daily" && dailyData) {
      setDriverId(dailyData.driver_id);
      setFromLocationId(1);
      setToLocationIds([]);
      setTruckId(dailyData.truck_id);
      setTrailerId(dailyData.trailer_id ?? null);
      const selectedTruck = trucks.find((t) => t.id === dailyData.truck_id);
      setTruckContainers(
        selectedTruck?.containers?.map((c) => ({
          containerId: c.id,
          fuelTypeId: undefined
        })) || [])
      const selectedTrailer = trailers.find((t) => t.id === dailyData.trailer_id);
      setTrailerContainers(
        selectedTrailer?.containers?.map((c) => ({
          containerId: c.id,
          fuelTypeId: undefined
        })) || [])
    } else {
      setDriverId(null);
      setFromLocationId(1);
      setToLocationIds([]);
      setTruckId(null);
      setTrailerId(null);
      setTruckContainers([]);
      setTrailerContainers([]);
    }
  }, [deliveryDetail, dailyData, mode, trucks, trailers]);

  const currentTruck = useMemo(() => trucks.find((t) => t.id === truckId), [trucks, truckId]);
  const currentTrailer = useMemo(() => trailers.find((t) => t.id === trailerId), [trailers, trailerId]);

  const handleDriverChange = (id: number | null) => {
    setDriverId(id);
    setErrors({ ...errors, driverId: false });

    if (!id) return;
    const driver = drivers.find((d) => d.id === id);
    if (driver?.truck_id) setTruckId(driver.truck_id);
  };

  const handleTruckChange = (id: number | null) => {
    setTruckId(id);
    setErrors((prev) => ({ ...prev, truckId: false }));

    if (!id) return;

    const truck = trucks.find((t) => t.id === id);
    if (!truck) return;

    if (truck.trailer_id) setTrailerId(truck.trailer_id);

    setTruckContainers(
      truck.containers?.map((c) => ({
        containerId: c.id,
        fuelTypeId: undefined
      })) || []
    );
  };

  const handleTrailerChange = (id: number | null) => {
    setTrailerId(id);

    const trailer = trailers.find((t) => t.id === id);
    if (!trailer || !id) {
      setTrailerContainers([]);
      return;
    }

    setTrailerContainers(
      trailer.containers?.map((c) => ({
        containerId: c.id,
        fuelTypeId: undefined
      })) || []
    );
  };

  const handleFromLocationChange = (id: number | null) => {
    setFromLocationId(id);
    setErrors((prev) => ({ ...prev, fromLocationId: false }));
  };

  const handleToLocationChange = (ids: number[]) => {
    setToLocationIds(ids);
    setErrors((prev) => ({ ...prev, toLocationIds: false }));
  };

  const handleContainerUpdate = (
    target: "truck" | "trailer",
    containerId: number,
    fuelTypeId: number
  ) => {
    const state = target === "truck" ? truckContainers : trailerContainers;
    const setter = target === "truck" ? setTruckContainers : setTrailerContainers;

    setter(
      state.map((c) =>
        c.containerId === containerId ? { ...c, fuelTypeId } : c
      )
    );
    setContainerErrors((prev) => ({ ...prev, [containerId]: false }));
  };

  const handleContainerAdd = (
    target: "truck" | "trailer",
    containerId: number
  ) => {
    const setter = target === "truck" ? setTruckContainers : setTrailerContainers;
    const state = target === "truck" ? truckContainers : trailerContainers;

    if (state.some((c) => c.containerId === containerId)) return;

    setter([...state, { containerId }]);
  };


  const handleContainerRemove = (target: "truck" | "trailer", containerId: number) => {
    const setter = target === "truck" ? setTruckContainers : setTrailerContainers;
    setter((prev) => prev.filter((c) => c.containerId !== containerId));
  };

  const handleSubmit = async () => {
    const truckFuelError = truckContainers?.length > 0 && truckContainers.some((c) => !c.fuelTypeId);
    const trailerFuelError = trailerContainers?.length > 0 && trailerContainers.some((c) => !c.fuelTypeId);

    const newContainerErrors: { [key: number]: boolean } = {};
    truckContainers.forEach((c) => {
      if (!c.fuelTypeId) newContainerErrors[c.containerId] = true;
    });
    trailerContainers.forEach((c) => {
      if (!c.fuelTypeId) newContainerErrors[c.containerId] = true;
    });
    setContainerErrors(newContainerErrors);

    const newErrors = {
      driverId: !driverId,
      fromLocationId: !fromLocationId,
      toLocationIds: toLocationIds?.length === 0,
      truckId: !truckId,
      truckFuelError,
      trailerFuelError,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    const payload: DeliveryUpsertPayload = {
      date: date.format("YYYY-MM-DD"),
      driverId: driverId!,
      fromLocationId: fromLocationId!,
      toLocationIds: toLocationIds,
      truck: {
        id: truckId!,
        fuelDetails: truckContainers?.map((c) => ({
          containerId: c.containerId,
          fuelTypeId: c.fuelTypeId,
        })),
      },
      trailer: trailerId ? {
        id: trailerId,
        fuelDetails: trailerContainers?.map((c) => ({
          containerId: c.containerId,
          fuelTypeId: c.fuelTypeId,
        })),
      } : undefined,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black dark:text-white">
        {deliveryDetail ? "Гаралт засах" : "Гаралт нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseDeliverySelect<Driver>
          label="Жолооч"
          options={drivers}
          valueId={driverId}
          onChangeId={(id) => handleDriverChange(id)}
          getOptionLabel={(d) => `${d.firstname} ${d.lastname}`}
          getOptionId={(d) => d.id}
          error={errors.driverId}
        />

        <BaseDeliverySelect<Truck>
          label="Машин"
          options={trucks}
          valueId={truckId}
          onChangeId={(id) => handleTruckChange(id)}
          getOptionLabel={(t) => t.license_plate || `Машин ${t.id}`}
          getOptionId={(t) => t.id}
          error={errors.truckId}
        />

        <BaseDeliverySelect<Location>
          label="Ачилт (хаанаас)"
          options={fromLocations}
          valueId={fromLocationId}
          onChangeId={(id) => handleFromLocationChange(id)}
          getOptionLabel={(l) => `${l.name} – ${l.location}`}
          getOptionId={(l) => l.id}
          error={errors.fromLocationId}
        />

        <BaseDeliverySelect<Location>
          label="Ачилт (хаашаа)"
          options={toLocations}
          valueIds={toLocationIds}
          multiple
          onChangeIds={(ids) => handleToLocationChange(ids)}
          getOptionLabel={(l) => `${l.name} – ${l.location}`}
          getOptionId={(l) => l.id}
          error={errors.toLocationIds}
        />



        <BaseDeliverySelect<Trailer>
          label="Чиргүүл"
          options={trailers}
          valueId={trailerId}
          onChangeId={(id) => handleTrailerChange(id)}
          getOptionLabel={(t) => t.license_plate || `Чиргүүл ${t.id}`}
          getOptionId={(t) => t.id}
          required={false}
          error={false}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Container title="Машины Лүүк" target="truck" selected={truckContainers} available={currentTruck?.containers?.map((c) => ({ id: c.id, volume: c.volume ?? 0 })) || []} fuelTypes={fuelTypes} containerErrors={containerErrors} handleContainerUpdate={handleContainerUpdate} handleContainerRemove={handleContainerRemove} handleContainerAdd={handleContainerAdd} />
        <Container title="Чиргүүлийн Лүүк" target="trailer" selected={trailerContainers} available={currentTrailer?.containers?.map((c) => ({ id: c.id, volume: c.volume ?? 0 })) || []} fuelTypes={fuelTypes} containerErrors={containerErrors} handleContainerUpdate={handleContainerUpdate} handleContainerRemove={handleContainerRemove} handleContainerAdd={handleContainerAdd} />
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit}>{deliveryDetail ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
