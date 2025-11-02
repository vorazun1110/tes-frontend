'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import dayjs from 'dayjs';
import Badge from '../ui/badge/Badge';
import { Input } from '../ui/input';
import Pagination from '../ui/pagination';
import { fetchReport } from '@/services/report';
import { ReportDelivery } from '@/types/api';

export default function ReportTable() {
  const [deliveries, setDeliveries] = useState<ReportDelivery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchReport('2025-11-01', '2025-11-02', '1')
      .then((res) => {
        const flatDeliveries = res.data.deliveries.flatMap((day) =>
          day.deliveries.map((d) => ({
            date: day.date,
            ...d,
          }))
        );
        setDeliveries(flatDeliveries);
      })
      .catch((err) => setError(err.message));
  }, []);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) =>
      d.deliveryTruck.license_plate.toLowerCase().includes(search.toLowerCase())
    );
  }, [deliveries, search]);

  const paginatedDeliveries = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDeliveries.slice(start, start + rowsPerPage);
  }, [filteredDeliveries, currentPage]);

  const totalPages = Math.ceil(filteredDeliveries.length / rowsPerPage);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Хайлт (машин)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-sm"
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table className="dark:text-white">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>#</TableCell>
                <TableCell isHeader>Огноо</TableCell>
                <TableCell isHeader>Шатахуун (жингийн %)</TableCell>
                <TableCell isHeader>Литр</TableCell>
                <TableCell isHeader>Нийт жин (кг)</TableCell>
                <TableCell isHeader>Ачаатай / Сул (км)</TableCell>
                <TableCell isHeader>Тонн.км</TableCell>
                <TableCell isHeader>Хаана буусан</TableCell>
                <TableCell isHeader>Хүлээн авсан</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedDeliveries.flatMap((delivery, index) => {
                const detailCount = delivery.details.length;

                return delivery.details.map((detail, detailIndex) => (
                  <TableRow key={`${index}-${detailIndex}`}>
                    {/* Only show full row data on the first detail */}
                    {detailIndex === 0 && (
                      <>
                        <TableCell rowSpan={detailCount}>
                          <Badge color="primary">
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell rowSpan={detailCount}>
                          {dayjs(delivery.date).format('YYYY-MM-DD')}
                        </TableCell>
                      </>
                    )}

                    {/* Fuel type + density */}
                    <TableCell>
                      {detail.name} ({detail.averageDensity})
                    </TableCell>

                    {/* Volume */}
                    <TableCell>{detail.volume} л</TableCell>

                    {/* Mass */}
                    <TableCell>{detail.mass.toFixed(2)} кг</TableCell>

                    {/* Only show distance/ton-km/location/receiver on first detail row */}
                    {detailIndex === 0 && (
                      <>
                        <TableCell rowSpan={detailCount}>
                          {delivery.withLoadDistance} / {delivery.withoutLoadDistance}
                        </TableCell>
                        <TableCell rowSpan={detailCount}>{delivery.tonKm}</TableCell>
                        <TableCell rowSpan={detailCount}>
                          {delivery.locationDetail?.name || '-'}
                        </TableCell>
                        <TableCell rowSpan={detailCount}>
                          {delivery.receiverDetail?.name || '-'}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ));
              })}
            </TableBody>

          </Table>

          {error && (
            <div className="p-4 text-red-500 font-medium text-sm">Error: {error}</div>
          )}

          <div className="flex justify-end p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
