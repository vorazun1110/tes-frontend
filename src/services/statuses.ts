import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, Status, StatusPayload } from "@/types/api";

export async function fetchStatuses(type: string): Promise<ApiResponse<Status[]>> {
  return await apiGet<ApiResponse<Status[]>>(`/statuses/${type}`);
}

export async function updateStatus(
  type: string,
  deliveryId: number,
  statusId: number,
): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/statuses/${type}/${deliveryId}`, "PUT", { statusId } as StatusPayload);
}

export async function updateLeaveStatus(
  truckId: number,
  date: string,
  statusId: number,
): Promise<ApiResponse<null>> {
  const payload = {
    statusId,
    truckId,
    date,
  };
  return await apiAction<ApiResponse<null>>(`/statuses/leave`, "PUT", payload);
}
