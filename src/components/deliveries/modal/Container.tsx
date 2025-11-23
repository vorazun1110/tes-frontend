import { VehicleContainer, SelectedContainer, FuelType } from "@/types/api";
import { IconButton, MenuItem, Select } from "@mui/material";
import PropaneTankIcon from "@mui/icons-material/PropaneTank";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { Trash2 } from "lucide-react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";

interface ContainerProps {
    title: string;
    target: "truck" | "trailer";
    selected: SelectedContainer[];
    available: VehicleContainer[];
    fuelTypes: FuelType[];
    containerErrors: { [key: number]: boolean };
    handleContainerUpdate: (target: "truck" | "trailer", containerId: number, fuelTypeId: number) => void;
    handleContainerRemove: (target: "truck" | "trailer", containerId: number) => void;
    handleContainerAdd: (target: "truck" | "trailer", containerId: number) => void;
}
export default function Container({ title, target, selected, available, fuelTypes, containerErrors, handleContainerUpdate, handleContainerRemove, handleContainerAdd }: ContainerProps) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
            <h3 className="text-base font-semibold text-black dark:text-white">{title}</h3>
            {!selected || selected.length === 0 ? (
                <p className="text-sm text-gray-400">Лүүк сонгогдоогүй байна.</p>
            ) : (
                <div className="space-y-4">
                    {selected.map((c) => {
                        const volume = available.find((a) => a.id === c.containerId)?.volume ?? 0;
                        const fuel = fuelTypes.find((f) => f.id === c.fuelTypeId);

                        return (
                            <div
                                key={c.containerId}
                                className="flex items-center justify-between border-b border-gray-300 pb-3 dark:border-gray-700"
                            >
                                {/* Volume | Fuel */}
                                <div className="flex flex-row items-center text-sm text-black dark:text-white">
                                    {/* Volume */}
                                    <div className="flex items-center gap-1 pr-4">
                                        <PropaneTankIcon fontSize="small" />
                                        Лүүк: {volume}л
                                    </div>

                                    {/* Vertical divider */}
                                    <div className="h-4 w-px bg-gray-400 mx-2" />

                                    {/* Fuel */}
                                    <div className="flex items-center gap-1">
                                        <LocalGasStationIcon fontSize="small" />
                                        {fuel ? (
                                            <span>{fuel.name}</span>
                                        ) : (
                                            <Select
                                                size="small"
                                                value=""
                                                onChange={(e) =>
                                                    handleContainerUpdate(target, c.containerId, Number(e.target.value))
                                                }
                                                displayEmpty
                                                error={containerErrors[c.containerId] ?? false}
                                                MenuProps={{ disablePortal: true }}
                                                sx={{
                                                    minWidth: 140,
                                                    fontSize: "13px",
                                                    height: "30px",
                                                    backgroundColor: "transparent",
                                                    ".MuiSelect-icon": { color: "#666" },
                                                }}
                                            >
                                                <MenuItem disabled value="">
                                                    Төрөл сонгох
                                                </MenuItem>
                                                {fuelTypes.map((ft) => (
                                                    <MenuItem key={ft.id} value={ft.id}>
                                                        {ft.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </div>
                                </div>

                                {/* Remove button */}
                                <IconButton
                                    size="small"
                                    onClick={() => handleContainerRemove(target, c.containerId)}
                                >
                                    <Trash2 size={18} className="text-red-500" />
                                </IconButton>
                            </div>
                        );
                    })}
                </div>

            )}

            {available.length > 0 && (
                <div className="mt-3">
                    <Label className="text-sm text-white/80">Нэмэх боломжтой</Label>
                    <div className="mt-1 flex flex-wrap gap-2">
                        {available
                            .filter((a) => !selected.some((c) => c.containerId === a.id))
                            .map((a) => (
                                <Button
                                    key={a.id}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleContainerAdd(target, a.id)}
                                >
                                    Лүүк {a.id} ({a.volume ?? 0}л)
                                </Button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
