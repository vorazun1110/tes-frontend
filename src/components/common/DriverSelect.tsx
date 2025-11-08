"use client";

import { fetchDrivers } from "@/services/driver";
import { Driver } from "@/types/api";
import React, { useEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";

interface DriverSelectProps {
  value?: number | string | null;
  onChange: (id: number) => void;
}

type Option = { value: number | string; label: string };

export default function DriverSelect({ value, onChange }: DriverSelectProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoading(true);
        const res = await fetchDrivers();

        const list = res.data || [];
        if (res.success) {
          setDrivers(list);
        } else {
          setError("Алдаа гарлаа");
        }
      } catch {
        setError("Серверээс мэдээлэл авахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };
    loadDrivers();
  }, []);

  const options = useMemo<Option[]>(
    () =>
      drivers.map((d) => ({
        value: d.id,
        label: `${d.firstname} ${d.lastname}`,
      })),
    [drivers],
  );

  const selectedOption = useMemo<Option | null>(() => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      options.length === 0
    ) {
      return null;
    }
    const valStr = String(value);
    return options.find((o) => String(o.value) === valStr) ?? null;
  }, [options, value]);

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt?.value !== undefined && opt?.value !== null) {
      const n = Number(opt.value);
      onChange(Number.isFinite(n) ? n : 0);
    } else {
      onChange(0);
    }
  };

  return (
    <div>
      <label
        htmlFor="driver"
        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Жолооч
      </label>

      <Select
        key={`${options.length}-${String(value ?? "")}`}
        inputId="driver"
        value={selectedOption}
        onChange={handleChange}
        options={options}
        getOptionValue={(option) => String(option.value)}
        getOptionLabel={(option) => String(option.label)}
        placeholder={
          loading ? "Уншиж байна..." : error ? "Алдаа..." : "Сонгох..."
        }
        isClearable
        isSearchable
        isDisabled={loading || !!error}
        className="text-sm"
        classNames={{
          control: () =>
            "h-11 w-full rounded-lg border border-gray-300 bg-transparent dark:border-gray-700 dark:bg-gray-900 dark:text-white",
          menu: () => "dark:bg-gray-900 dark:text-white",
        }}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "transparent",
            borderColor: "#d1d5db",
          }),
          input: (base) => ({
            ...base,
            color: "inherit",
          }),
          singleValue: (base) => ({
            ...base,
            color: "inherit",
          }),
        }}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
