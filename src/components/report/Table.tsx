"use client";

import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { fetchReport } from "@/services/report";
import { ApiResponse, Driver, ReportGroupedDelivery, ReportResponse } from "@/types/api";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Select from "../form/Select";
import { fetchDrivers } from "@/services/driver";
import TableSkeleton from "../ui/table/TableSkeleton";
import { motion } from "framer-motion";

interface FlatRow {
  deliveryIdx: number;
  date: string;
  fuelName: string;
  locationName: string;
  receiverName: string;
  mass: number;
  volume: number;
  averageDensity: number;
  tonKm: number;
  withLoadDistance: number;
  withoutLoadDistance: number;
  rowSpan: number;
  isFirst: boolean;
}

function flattenDeliveries(grouped: ReportGroupedDelivery[]): FlatRow[] {
  const rows: FlatRow[] = [];
  let deliveryIdx = 0;

  for (const group of grouped) {
    for (const delivery of group.deliveries) {
      let totalRows = 0;
      for (const detail of delivery.details) {
        totalRows += Math.max(detail.locations.length, 1);
      }
      if (totalRows === 0) totalRows = 1;

      let isFirst = true;
      for (const detail of delivery.details) {
        if (detail.locations.length === 0) {
          rows.push({
            deliveryIdx, date: group.date, fuelName: detail.name,
            locationName: "-", receiverName: "-",
            mass: 0, volume: 0, averageDensity: 0,
            tonKm: delivery.tonKm,
            withLoadDistance: delivery.withLoadDistance,
            withoutLoadDistance: delivery.withoutLoadDistance,
            rowSpan: totalRows, isFirst,
          });
          isFirst = false;
        } else {
          for (const loc of detail.locations) {
            rows.push({
              deliveryIdx, date: group.date, fuelName: detail.name,
              locationName: loc.locationDetail?.name || loc.name || "-",
              receiverName: loc.receivers?.map(r => `${r.lastname} ${r.firstname}`).join(", ") || "-",
              mass: loc.mass, volume: loc.volume, averageDensity: loc.averageDensity,
              tonKm: delivery.tonKm,
              withLoadDistance: delivery.withLoadDistance,
              withoutLoadDistance: delivery.withoutLoadDistance,
              rowSpan: totalRows, isFirst,
            });
            isFirst = false;
          }
        }
      }
      deliveryIdx++;
    }
  }
  return rows;
}

export default function ReportTable() {
  const [rows, setRows] = useState<FlatRow[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [driversLoaded, setDriversLoaded] = useState(false);

  const [dateFrom, setDateFrom] = useState<Dayjs>(dayjs().startOf("month"));
  const [dateTo, setDateTo] = useState<Dayjs>(dayjs().endOf("month"));
  const [driverId, setDriverId] = useState<string>("");

  // Load drivers once
  useEffect(() => {
    fetchDrivers().then((res: ApiResponse<Driver[]>) => {
      setDrivers(res.data);
      if (res.data.length > 0) {
        setDriverId(res.data[0].id.toString());
      }
      setDriversLoaded(true);
    });
  }, []);

  // Load report when filters change (after drivers loaded)
  const dateFromStr = dateFrom.format("YYYY-MM-DD");
  const dateToStr = dateTo.format("YYYY-MM-DD");
  const prevParamsRef = useRef("");

  useEffect(() => {
    if (!driversLoaded || !driverId) return;
    const paramsKey = `${dateFromStr}-${dateToStr}-${driverId}`;
    if (paramsKey === prevParamsRef.current) return;
    prevParamsRef.current = paramsKey;

    let cancelled = false;
    setLoading(true);
    fetchReport(dateFromStr, dateToStr, driverId)
      .then((response: ReportResponse) => {
        if (!cancelled) {
          setRows(flattenDeliveries(response.data || []));
        }
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [dateFromStr, dateToStr, driverId, driversLoaded]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            format="YYYY-MM-DD"
            label="Эхлэх өдөр"
            value={dateFrom}
            maxDate={dateTo}
            onChange={(v) => v && setDateFrom(v)}
            slotProps={{ textField: { size: "small", sx: { width: 170 } } }}
          />
          <DatePicker
            format="YYYY-MM-DD"
            label="Дуусах өдөр"
            value={dateTo}
            minDate={dateFrom}
            onChange={(v) => v && setDateTo(v)}
            slotProps={{ textField: { size: "small", sx: { width: 170 } } }}
          />
        </LocalizationProvider>
        <div className="w-56">
          <Select
            options={drivers.map((d) => ({
              value: d.id.toString(),
              label: `${d.lastname} ${d.firstname}`,
            }))}
            onChange={(value) => setDriverId(value)}
            defaultValue={driverId}
            placeholder="Жолооч сонгох..."
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-white/[0.03]">
        {loading ? (
          <TableSkeleton rows={5} columns={10} />
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">Мэдээлэл олдсонгүй</div>
        ) : (
          <Table className="dark:text-white">
            <TableHeader>
              <TableRow>
                <TableCell isHeader rowSpan={2} className="text-center">№</TableCell>
                <TableCell isHeader rowSpan={2} className="text-center">Огноо</TableCell>
                <TableCell isHeader rowSpan={2} className="text-center">Шатахууны марк</TableCell>
                <TableCell isHeader colSpan={3} className="text-center">Ачааны хэмжээ</TableCell>
                <TableCell isHeader colSpan={2} className="text-center">Явсан зам (км)</TableCell>
                <TableCell isHeader rowSpan={2} className="text-center">Тонн/км</TableCell>
                <TableCell isHeader rowSpan={2} className="text-center">Хаана буусан</TableCell>
                <TableCell isHeader rowSpan={2} className="text-center">Хүлээн авсан</TableCell>
              </TableRow>
              <TableRow>
                <TableCell isHeader className="text-center">%-ийн жин</TableCell>
                <TableCell isHeader className="text-center">Литр</TableCell>
                <TableCell isHeader className="text-center">Нийт жин</TableCell>
                <TableCell isHeader className="text-center">Ачаатай</TableCell>
                <TableCell isHeader className="text-center">Сул</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  {row.isFirst && (
                    <>
                      <TableCell rowSpan={row.rowSpan} className="text-center font-medium">{row.deliveryIdx + 1}</TableCell>
                      <TableCell rowSpan={row.rowSpan} className="text-center">{row.date}</TableCell>
                    </>
                  )}
                  <TableCell className="text-center">{row.fuelName}</TableCell>
                  <TableCell className="text-center">{row.averageDensity}</TableCell>
                  <TableCell className="text-center">{row.volume}</TableCell>
                  <TableCell className="text-center">{row.mass}</TableCell>
                  {row.isFirst && (
                    <>
                      <TableCell rowSpan={row.rowSpan} className="text-center">{row.withLoadDistance}</TableCell>
                      <TableCell rowSpan={row.rowSpan} className="text-center">{row.withoutLoadDistance}</TableCell>
                      <TableCell rowSpan={row.rowSpan} className="text-center">{row.tonKm}</TableCell>
                    </>
                  )}
                  <TableCell className="text-center">{row.locationName}</TableCell>
                  <TableCell className="text-center">{row.receiverName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
}
