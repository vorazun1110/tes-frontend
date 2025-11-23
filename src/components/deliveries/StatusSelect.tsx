import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Status } from "@/types/api";
import { statusColorMap } from "@/data/deliveries";

interface StatusSelectProps {
    value: number;
    onChange: (value: number) => void;
    statuses: Status[];
}

export default function StatusSelect({ value, onChange, statuses }: StatusSelectProps) {
    return (
        <Select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            renderValue={(selected) => {
                const opt = statuses.find((s) => s.id === selected);
                const color = statusColorMap[opt?.color as keyof typeof statusColorMap] ?? statusColorMap["grey"];
                return (
                    <span className={`inline-block px-2 py-1 text-[11px] font-medium rounded ${color.bg} ${color.text}`}>
                        {opt?.name || "Тодорхойгүй"}
                    </span>
                );
            }}
            size="small"
            sx={{ fontSize: '10px', height: 28, '.MuiSelect-select': { padding: '2px 8px' } }}
        >
            {statuses.map((opt) => {
                const color = statusColorMap[opt.color as keyof typeof statusColorMap] ?? statusColorMap["grey"];
                return (
                    <MenuItem key={opt.id} value={opt.id}>
                        <span className={`inline-block px-2 py-1 text-[11px] font-medium rounded ${color.bg} ${color.text}`}>
                            {opt.name}
                        </span>
                    </MenuItem>
                );
            })}
        </Select>
    );
}
