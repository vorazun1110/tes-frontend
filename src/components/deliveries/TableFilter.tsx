import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface DeliveryTableFilterProps {
    date: Dayjs;
    setDate: (date: Dayjs) => void;
}

export default function DeliveryTableFilter({ date, setDate }: DeliveryTableFilterProps) {
    const router = useRouter();
    return (
        <div className="flex flex-1 items-center gap-4">
            <div className="flex items-center gap-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        format="YYYY-MM-DD"
                        label="Эхлэх өдөр"
                        value={date}
                        onChange={(newVal) => {
                            if (!newVal) return;
                            const formatted = newVal.format("YYYY-MM-DD");
                            setDate(newVal);
                            router.replace(`?date=${formatted}`);
                        }}
                        slotProps={{
                            textField: {
                                size: "small",
                                sx: {
                                    height: 40,
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                        fontSize: "0.875rem",
                                    },
                                    "& input": {
                                        padding: "8px 12px",
                                    },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </div>
        </div>
    );
}