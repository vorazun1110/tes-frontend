"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { Location, LocationPayload } from "@/types/api";

interface LocationFormModalProps {
  editLocation: Location | null;
  onClose: () => void;
  onSubmit: (payload: LocationPayload) => Promise<void>;
}

export default function LocationFormModal({ editLocation, onClose, onSubmit }: LocationFormModalProps) {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    if (editLocation) {
      setName(editLocation.name);
      setLocation(editLocation.latitude + ", " + editLocation.longitude);
    } else {
      setName("");
      setLocation("");
    }
  }, [editLocation]);

  const handleSubmit = async () => {
    const payload: LocationPayload = {
      name: name,
      latitude: parseFloat(location.split(",")[0]),
      longitude: parseFloat(location.split(",")[1]),
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {editLocation ? "Байршил засах" : "Байршил нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Label htmlFor="latitude">Байршил</Label>
          <Input
            id="location"
            type="text"
            placeholder="Байршил"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit}>{editLocation ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
