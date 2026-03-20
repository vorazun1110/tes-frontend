"use client";

import { fetchDrivers } from "@/services/driver";
import { Driver } from "@/types/api";
import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

interface DriverSelectProps {
  value?: number | string | null;
  onChange: (id: number) => void;
}

type Option = { value: number; label: string };

export default function DriverSelect({ value, onChange }: DriverSelectProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoading(true);
        const res = await fetchDrivers();
        if (res.success) setDrivers(res.data || []);
        else setError("Алдаа гарлаа");
      } catch {
        setError("Серверээс мэдээлэл авахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };
    loadDrivers();
  }, []);

  const options = useMemo<Option[]>(
    () => drivers.map((d) => ({ value: d.id, label: `${d.firstname} ${d.lastname}` })),
    [drivers],
  );

  const selectedOption = useMemo<Option | null>(() => {
    if (value === undefined || value === null || value === "" || options.length === 0) return null;
    return options.find((o) => String(o.value) === String(value)) ?? null;
  }, [options, value]);

  return (
    <div>
      <Autocomplete
        size="small"
        options={options}
        value={selectedOption}
        onChange={(_, opt) => onChange(opt?.value ?? 0)}
        getOptionLabel={(o) => o.label}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        loading={loading}
        disabled={!!error}
        noOptionsText="Олдсонгүй"
        loadingText="Уншиж байна..."
        slotProps={{
          popper: { style: { zIndex: 99999 } },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Жолооч"
            error={!!error}
            helperText={error || ""}
            sx={{
              "& .MuiInputBase-root": { height: 44, borderRadius: "0.5rem" },
            }}
          />
        )}
      />
    </div>
  );
}
