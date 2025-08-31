import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, Delivery } from "@/types/api";

export async function fetchDeliverys(): Promise<ApiResponse<Delivery[]>> {
  return await apiGet<ApiResponse<Delivery[]>>("/deliveries");
}

export async function updateDelivery(
  volumeId: number,
  payload: Partial<Delivery>
): Promise<ApiResponse<Delivery>> {
  return await apiAction<ApiResponse<Delivery>>(`/deliveries/${volumeId}`, "PUT", payload);
}

export async function createDelivery(payload: Partial<Delivery>): Promise<ApiResponse<Delivery>> {
  return await apiAction<ApiResponse<Delivery>>(`/deliveries`, "POST", payload);
}

export async function deleteDelivery(volumeId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/deliveries/${volumeId}`, "DELETE");
}
