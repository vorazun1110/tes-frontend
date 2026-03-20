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
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");

  useEffect(() => {
    if (editLocation) {
      setName(editLocation.name);
      setLocation(editLocation.location || "");
      setDistrict(editLocation.district || "");
    } else {
      setName("");
      setLocation("");
      setDistrict("");
    }
  }, [editLocation]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const payload: LocationPayload = {
      name,
      location,
      district,
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
        {editLocation ? "Байршил засах" : "Байршил нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Нэр</Label>
          <Input
            id="name"
            type="text"
            placeholder="ШТС-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="location">Хот/Аймаг</Label>
          <Input
            id="location"
            type="text"
            placeholder="Улаанбаатар"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="district">Дүүрэг/Сум</Label>
          <Input
            id="district"
            type="text"
            placeholder="Нисэх"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit} disabled={loading}>{loading ? "Түр хүлээнэ үү..." : editLocation ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}
