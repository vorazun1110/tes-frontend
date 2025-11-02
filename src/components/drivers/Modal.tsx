"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { Driver, DriverPayload } from "@/types/api";

interface DriverFormModalProps {
  editDriver: Driver | null;
  onClose: () => void;
  onSubmit: (payload: DriverPayload) => Promise<void>;
}

export default function DriverFormModal({ editDriver, onClose, onSubmit }: DriverFormModalProps) {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [register, setRegister] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    if (editDriver) {
      setFirstname(editDriver.firstname);
      setLastname(editDriver.lastname);
      setPosition(editDriver.position);
      setRegister(editDriver.register);
      setPhone(editDriver.phone);
    } else {
      setFirstname("");
      setLastname("");
      setPosition("");
      setRegister("");
      setPhone("");
    }
  }, [editDriver]);

  const handleSubmit = async () => {
    const payload: DriverPayload = {
      id: editDriver?.id || 0,
      firstname: firstname,
      lastname: lastname,
      position: position,
      register: register,
      phone: phone,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-black">
        {editDriver ? "Жолооч засах" : "Жолооч нэмэх"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <Label htmlFor="firstname">Овог</Label>
          <Input
            id="lastname"
            type="text"
            placeholder="Овог"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="firstname">Нэр</Label>
          <Input
            id="firstname"
            type="text"
            placeholder="Нэр"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="position">Албан тушаал</Label>
          <Input
            id="position"
            type="text"
            placeholder="Албан тушаал"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="register">РД</Label>
          <Input
            id="register"
            type="text"
            placeholder="РД"
            value={register}
            onChange={(e) => setRegister(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="phone">Утасны дугаар</Label>
          <Input
            id="phone"
            type="text"
            placeholder="Утасны дугаар"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={8}
            minLength={8}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit}>{editDriver ? "Засах" : "Нэмэх"}</Button>
      </div>
    </div>
  );
}

