"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Truck } from "@/types/api";
import { fetchTrucks } from "@/services/truck";

interface TruckSelectProps {
  value: number;
  onChange: (id: number) => void;
  id?: string;
}

type Option = { value: number; label: string };

export default function TruckSelect({ value, onChange, id = "truck" }: TruckSelectProps) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchTrucks();
        if (res.success) setTrucks(res.data || []);
        else setError("Алдаа гарлаа");
      } catch {
        setError("Серверээс мэдээлэл авахад алдаа гарлаа");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const options = useMemo<Option[]>(
    () => trucks.map((t) => ({ value: t.id, label: t.license_plate })),
    [trucks],
  );

  const selectedOption = useMemo<Option | null>(() => {
    if (!value || options.length === 0) return null;
    return options.find((o) => o.value === value) ?? null;
  }, [options, value]);

  return (
    <Autocomplete
      id={id}
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
          label="Машин"
          error={!!error}
          helperText={error || ""}
          sx={{
            "& .MuiInputBase-root": { height: 44, borderRadius: "0.5rem" },
          }}
        />
      )}
    />
  );
}
