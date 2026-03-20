"use client";

import React, { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Сонгох",
  onChange,
  className = "",
  defaultValue = "",
}) => {
  const selectedOption = useMemo(() => {
    if (!defaultValue) return null;
    return options.find((o) => o.value === defaultValue) ?? null;
  }, [options, defaultValue]);

  return (
    <Autocomplete
      size="small"
      options={options}
      value={selectedOption}
      onChange={(_, opt) => onChange(opt?.value ?? "")}
      getOptionLabel={(o) => o.label}
      isOptionEqualToValue={(a, b) => a.value === b.value}
      noOptionsText="Олдсонгүй"
      className={className}
      slotProps={{
        popper: { style: { zIndex: 99999 } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          sx={{
            "& .MuiInputBase-root": { height: 44, borderRadius: "0.5rem" },
          }}
        />
      )}
    />
  );
};

export default Select;
