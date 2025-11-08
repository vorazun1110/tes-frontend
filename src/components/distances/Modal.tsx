"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { Distance, DistancePayload } from "@/types/api";
import Select from "../form/Select";
import { fetchLocations } from "@/services/location";

interface DistanceFormModalProps {
  editDistance: Distance | null;
  onClose: () => void;
  onSubmit: (payload: DistancePayload) => Promise<void>;
}

type Option = { value: string; label: string };

export default function DistanceFormModal({
  editDistance,
  onClose,
  onSubmit,
}: DistanceFormModalProps) {
  const [name, setName] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [location1, setLocation1] = useState<string>(""); // stores option.value
  const [location2, setLocation2] = useState<string>(""); // stores option.value

  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load locations once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingLocations(true);
        const res = await fetchLocations();
        if (!mounted) return;
        const opts =
          res?.data?.map((loc) => ({
            value: String(loc.id),
            label: loc.name,
          })) ?? [];
        setLocationOptions(opts);
      } catch (e: unknown) {
        if (!mounted) return;
        setLoadError(
          e instanceof Error ? e.message : "Failed to load locations",
        );
      } finally {
        if (mounted) setLoadingLocations(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Prefill when editing
  useEffect(() => {
    if (editDistance) {
      setName(editDistance.name ?? "");
      setDistance(
        editDistance.distance !== undefined
          ? String(editDistance.distance)
          : "",
      );
      // These lines assume editDistance contains numeric IDs for the two locations
      if (editDistance.location1 !== undefined) {
        setLocation1(String(editDistance.location1));
      }
      if (editDistance.location2 !== undefined) {
        setLocation2(String(editDistance.location2));
      }
    } else {
      setName("");
      setDistance("");
      setLocation1("");
      setLocation2("");
    }
  }, [editDistance]);

  const distanceNumber = useMemo(() => Number(distance), [distance]);
  const sameLocation = location1 && location2 && location1 === location2;

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      !Number.isNaN(distanceNumber) &&
      distance.trim().length > 0 &&
      location1 !== "" &&
      location2 !== "" &&
      !sameLocation
    );
  }, [name, distance, distanceNumber, location1, location2, sameLocation]);

  const handleSubmit = async () => {
    const payload: DistancePayload = {
      name: name.trim(),
      distance: Number(distance),
      locationId1: Number(location1),
      locationId2: Number(location2),
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {editDistance ? "Зай засах" : "Зай нэмэх"}
      </h2>

      {loadError && (
        <div className="text-sm text-red-500">Алдаа: {loadError}</div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-1">
          <Label htmlFor="name">Нэр</Label>
          <Input
            id="name"
            type="text"
            placeholder="Нэр"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="distance">Зай</Label>
          <Input
            id="distance"
            type="number"
            inputMode="decimal"
            placeholder="Ж: 12.5"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="location1">Байршил 1</Label>
          <Select
            options={locationOptions as Option[]}
            placeholder="Байршил 1"
            defaultValue={location1}
            // onChange expected to pass { value, label }
            onChange={(value: string) => setLocation1(value)}
            className={loadingLocations || !!loadError ? "opacity-50" : ""}
          />
          {sameLocation && (
            <p className="mt-1 text-xs text-red-500">
              Байршил 1 болон Байршил 2 ижил байж болохгүй.
            </p>
          )}
        </div>

        <div className="md:col-span-1">
          <Label htmlFor="location2">Байршил 2</Label>
          <Select
            options={locationOptions}
            placeholder="Байршил 2"
            defaultValue={location2}
            onChange={(value: string) => setLocation2(value)}
            className={loadingLocations || !!loadError ? "opacity-50" : ""}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Болих
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {editDistance ? "Засах" : "Нэмэх"}
        </Button>
      </div>
    </div>
  );
}
