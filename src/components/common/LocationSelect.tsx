"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { fetchLocations } from "@/services/location";
import { Location } from "@/types/api";

interface LocationSelectProps {
  value: number;
  onChange: (id: number) => void;
  id?: string;
  label?: string;
}

type Option = { value: number; label: string };

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
    return () => { mounted = false; };
  }, []);

  const options = useMemo<Option[]>(
    () => locations.map((l) => ({ value: l.id, label: l.name })),
    [locations],
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
          label={label}
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
