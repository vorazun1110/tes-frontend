"use client";

import React from "react";
import {
    Autocomplete,
    TextField,
} from "@mui/material";

interface BaseAutocompleteProps<T> {
    label: string;
    options: T[];
    multiple?: boolean;
    valueId?: number | null;
    valueIds?: number[];
    onChangeId?: (id: number | null) => void;
    onChangeIds?: (ids: number[]) => void;
    getOptionLabel: (option: T) => string;
    getOptionId: (option: T) => number;
    error: boolean;
    required?: boolean;
}

export default function BaseDeliverySelect<T>({
    label,
    options,
    multiple = false,
    valueId,
    valueIds,
    onChangeId,
    onChangeIds,
    getOptionLabel,
    getOptionId,
    required = true,
    error = false,
}: BaseAutocompleteProps<T>) {
    const value = multiple
        ? options.filter((o) => valueIds?.includes(getOptionId(o)))
        : options.find((o) => getOptionId(o) === valueId) || null;

    return (
        <Autocomplete
            multiple={multiple}
            options={options}
            getOptionLabel={getOptionLabel}
            value={value}
            onChange={(_, newValue) => {
                if (multiple) {
                    const ids = (newValue as T[]).map(getOptionId);
                    onChangeIds?.(ids);
                } else {
                    onChangeId?.(newValue ? getOptionId(newValue as T) : null);
                }
            }}
            isOptionEqualToValue={(option, value) =>
                getOptionId(option) === getOptionId(value)
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required={required}
                    error={error}
                    helperText={error ? "Заавал сонгоно уу" : ""}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={getOptionId(option)}>
                    {getOptionLabel(option)}
                </li>
            )}
            slotProps={{
                popper: {
                    disablePortal: true,
                },
            }}
        />
    );
}
