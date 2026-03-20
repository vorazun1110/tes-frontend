"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Trailer } from "@/types/api";
import { fetchTrailers } from "@/services/trailer";

interface TrailerSelectProps {
  value: number;
  onChange: (id: number) => void;
  id?: string;
}

type Option = { value: number; label: string };

export default function TrailerSelect({ value, onChange, id = "trailer" }: TrailerSelectProps) {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchTrailers();
        if (res.success) setTrailers(res.data || []);
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
    () => trailers.map((t) => ({ value: t.id, label: t.license_plate })),
    [trailers],
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
          label="Чиргүүл"
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
