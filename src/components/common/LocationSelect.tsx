"use client";

import React, { useEffect, useMemo, useState } from "react";
import Label from "../form/Label";
import Select, { SingleValue } from "react-select";
import { fetchLocations } from "@/services/location";
import { Location } from "@/types/api";

interface LocationSelectProps {
  value: number;
  onChange: (id: number) => void;
  id?: string;
  label?: string;
}

type Option = { value: number | string; label: string };

export default function LocationSelect({
  value,
  onChange,
  id = "location",
  label = "Байрлал",
}: LocationSelectProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchLocations();
        if (res.success) setLocations(res.data || []);
        else setError("Алдаа гарлаа");
      } catch {
        setError("Серверээс мэдээлэл авахад алдаа гарлаа");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const options = useMemo<Option[]>(
    () => locations.map((l) => ({ value: l.id, label: l.name })),
    [locations],
  );

  const selectedOption = useMemo<Option | null>(() => {
    if (
      value === undefined ||
      value === null ||
      value === 0 ||
      options.length === 0
    )
      return null;
    const valStr = String(value);
    return options.find((o) => String(o.value) === valStr) ?? null;
  }, [options, value]);

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt?.value !== undefined && opt?.value !== null) {
      const n = Number(opt.value);
      onChange(Number.isFinite(n) ? n : 0);
    } else onChange(0);
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>

      <Select
        key={`${options.length}-${String(value ?? "")}`}
        inputId={id}
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
