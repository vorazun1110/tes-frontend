"use client";
import React, { useState, useMemo } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import {
  Table,
} from "../ui/table";
import {
  DeliveryReceivePayload,
  DeliveryUpsertPayload,
  DeliveryDetail,
  DailyData,
} from "@/types/deliveries";
import { useDeliveryPageData, useSessionUser, useConfirmDialog } from "@/hooks";
import Modal from "../modal/BasicModal";
import Button from "@/components/ui/button/Button";
import ConfirmDialog from "../ui/modal/ConfirmDialog";
import {
  createDelivery,
  deleteDelivery,
  getDelivery,
  receiveDelivery,
  updateDelivery,
  updateLeaveStatus,
  updateStatus
} from "@/services";
import DeliveryFormModal from "./modal/DeliveryUpsert";
import DeliveryReceiveModal from "./modal/ReceiveModal";
import DeliveryTableHead from "./TableHead";
import DeliveryTableBody from "./TableBody";
import DeliveryTableFilter from "./TableFilter";
import { canAccess } from "@/utils/deliveries";
import ErrorMessage from "../ui/feedback/ErrorMessage";
import TableSkeleton from "./TableSkeleton";
import DeliveryTableEmpty from "./TableEmpty";

export default function DeliveryDashboard() {
  // Router-driven data
  const searchParams = useSearchParams();
  const initialDateFromUrl = useMemo(() => {
    const dateParam = searchParams.get("date");
    return dayjs(dateParam ?? dayjs().format("YYYY-MM-DD")).startOf("day");
  }, [searchParams]);
  const [dateUrl, setDate] = useState<Dayjs>(initialDateFromUrl);

  const date = useMemo(() => dayjs(dateUrl.format("YYYY-MM-DD")), [dateUrl]);

  // Session/User data
  const sessionUser = useSessionUser();

  // Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [deliveryDetail, setDeliveryDetail] = useState<DeliveryDetail | null>(null);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingReceiveDetail, setLoadingReceiveDetail] = useState(false);

  const {
    isOpen: isConfirmOpen,
    confirm: openConfirm,
    options: confirmOptions,
    handleClose: closeConfirm,
    handleConfirm: confirmDelete,
  } = useConfirmDialog();

  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError, mutate } = useDeliveryPageData(date);

  const {
    drivers,
    trucks,
    trailers,
    fuelTypes,
    truckStatuses,
    leaveStatuses,
    managerStatuses,
    distances,
    fuelLocations,
  } = useMemo(() => data, [data]);
  const deliveries = data?.deliveries?.result;

  const openEditModal = async (deliveryId: number) => {
    setLoadingDetail(true);
    try {
      const res = await getDelivery(deliveryId);
      if (res.success) {
        setDeliveryDetail(res.data);
        setIsModalOpen(true);
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Алдаа гарлаа");
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  const openReceiveModal = async (deliveryId: number) => {
    setLoadingReceiveDetail(true);
    try {
      const res = await getDelivery(deliveryId);
      if (res.success) {
        setDeliveryDetail(res.data);
        setIsReceiveModalOpen(true);
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Алдаа гарлаа");
      }
    } finally {
      setLoadingReceiveDetail(false);
    }
  };

  const handleSubmit = async (payload: DeliveryUpsertPayload) => {
    try {
      const res = deliveryDetail ? await updateDelivery(deliveryDetail.id, payload) : await createDelivery(payload);
      if (!res.success) {
        throw new Error(res.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Алдаа гарлаа");
      }
    } finally {
      setIsModalOpen(false);
      setDeliveryDetail(null);
      mutate();
    }
  };

  const handleReceive = async (payload: DeliveryReceivePayload) => {
    try {
      if (!deliveryDetail) return;
      const res = await receiveDelivery(deliveryDetail.id, payload);

      if (!res?.success) {
        throw new Error(res?.message ?? "Алдаа гарлаа");
      }

      mutate();
      setIsReceiveModalOpen(false);
      setDeliveryDetail(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDelivery(id);
      mutate();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  const handleStatusChange = async (type: string, id: number, statusId: number) => {
    try {
      const res = await updateStatus(type, id, statusId);
      if (res.success) {
        mutate();
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  const handleLeaveStatus = async (truckId: number, date: string, statusId: number) => {
    try {
      const res = await updateLeaveStatus(truckId, date, statusId);
      if (res.success) {
        mutate();
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4 p-4">
        <DeliveryTableFilter
          date={date}
          setDate={setDate}
        />
        {canAccess("add", sessionUser?.role) ? (
          <Button
            onClick={() => {
              setDeliveryDetail(null);
              setIsModalOpen(true);
            }}
          >
            + Нэмэх
          </Button>
        ) : null}
      </div>
      <div className="w-full overflow-x-auto">
        {isLoading ? (
          <TableSkeleton />
        ) : isError || !deliveries ? (
          <ErrorMessage message="Сервертэй холбогдож чадсангүй" onRetry={mutate} />
        ) : (
          <Table className="border-collapse text-[11px] min-w-[1000px]">
            <DeliveryTableHead />
            {deliveries.length === 0 ? (
              <DeliveryTableEmpty />
            ) : (
              <DeliveryTableBody
                date={date}
                sessionUser={sessionUser}
                deliveries={deliveries}
                truckStatuses={truckStatuses!}
                leaveStatuses={leaveStatuses!}
                managerStatuses={managerStatuses!}
                handleStatusChange={handleStatusChange}
                handleLeaveStatus={handleLeaveStatus}
                onEdit={(deliveryId) => {
                  openEditModal(deliveryId);
                }}
                onCreate={(dailyData) => {
                  setDailyData(dailyData);
                  setIsModalOpen(true);
                }}
                onReceive={(deliveryId) => {
                  openReceiveModal(deliveryId);
                }}
                onConfirmDelete={(deliveryId) => openConfirm(() => handleDelete(deliveryId))}
              />
            )}
          </Table>
        )}
      </div>
      {error && (
        <div className="p-4 text-sm font-medium text-red-500">
          Error: {error}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {!loadingDetail ? (
          <DeliveryFormModal
            date={date}
            mode={dailyData ? "daily" : deliveryDetail ? "edit" : "create"}
            deliveryDetail={deliveryDetail}
            dailyData={dailyData}
            onClose={() => {
              setIsModalOpen(false);
              setDeliveryDetail(null);
              setLoadingDetail(false);
              setDailyData(null);
            }}
            onSubmit={handleSubmit}
            drivers={drivers}
            trucks={trucks}
            trailers={trailers}
            fuelTypes={fuelTypes}
            fuelLocations={fuelLocations}
          />
        ) : (
          <div className="p-6 text-sm text-gray-500">Түр хүлээнэ үү...</div>
        )}
      </Modal>

      <Modal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
      >
        {!loadingReceiveDetail ? (
          <DeliveryReceiveModal
            deliveryDetail={deliveryDetail}
            onClose={() => {
              setIsReceiveModalOpen(false);
              setDeliveryDetail(null);
              setLoadingReceiveDetail(false);
            }}
            onSubmit={handleReceive}
            distances={distances}
          />
        ) : (
          <div className="p-6 text-sm text-gray-500">Түр хүлээнэ үү...</div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        {...confirmOptions}
      />
    </div>
  );
}
