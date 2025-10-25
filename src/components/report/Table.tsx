'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import { Input } from '../ui/input';
import Pagination from '../ui/pagination';
import { fetchReport } from '@/services/report';
import { ReportDelivery, FuelTypeDetail } from '@/types/api';
import dayjs from 'dayjs';

export default function ReportTable() {
  const [deliveries, setDeliveries] = useState<ReportDelivery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchReport('2025-01-01', '2025-11-01', '1')
      .then((res) => setDeliveries(res.data.deliveries))
      .catch((err) => setError(err.message));
  }, []);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) =>
      d.locationDetail?.name?.toLowerCase().includes(search.toLowerCase())
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
          placeholder="Байршил хайх..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-sm"
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table className="dark:text-white">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>#</TableCell>
                <TableCell isHeader>Огноо</TableCell>
                <TableCell isHeader>Байршил</TableCell>
                <TableCell isHeader>ton.km</TableCell>
                <TableCell isHeader>Ачаатай/Ачаагүй зай</TableCell>
                <TableCell isHeader>Шатахуун</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedDeliveries.map((delivery, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge color="primary">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell>{dayjs(delivery.date).format('YYYY-MM-DD')}</TableCell>
                  <TableCell>{delivery.locationDetail?.name || '-'}</TableCell>
                  <TableCell>{delivery.tonKm}</TableCell>
                  <TableCell>
                    {delivery.withLoadDistance} км / {delivery.withoutLoadDistance} км
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {delivery.fuelTypeDetail.map((fuel: FuelTypeDetail) => (
                        <span key={fuel.id}>
                          {fuel.name}: {fuel.volume} л
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
