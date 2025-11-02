import { apiGet, apiAction } from "@/lib/api";
import { Delivery, DeliveryReceivePayload, DeliveryUpsertPayload } from "@/types/deliveries";
import { ApiResponse } from "@/types/api";

export async function fetchDeliveries(dateFilter: string): Promise<ApiResponse<Delivery[]>> {
  return await apiGet<ApiResponse<Delivery[]>>(`/deliveries?date=${dateFilter}`);
}

export async function updateDelivery(
  deliveryId: number,
  payload: DeliveryUpsertPayload
): Promise<ApiResponse<Delivery>> {
  return await apiAction<ApiResponse<Delivery>>(`/deliveries/${deliveryId}`, "PUT", payload);
}

export async function createDelivery(payload: DeliveryUpsertPayload): Promise<ApiResponse<Delivery>> {
  return await apiAction<ApiResponse<Delivery>>(`/deliveries`, "POST", payload);
}

export async function deleteDelivery(deliveryId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/deliveries/${deliveryId}`, "DELETE");
}

export async function receiveDeliveryApiCall(deliveryId: number | null, payload: DeliveryReceivePayload): Promise<ApiResponse<Delivery>> {
  if (!deliveryId) {
    throw new Error("Delivery ID is required");
  }
  return await apiAction<ApiResponse<Delivery>>(`/deliveries/receive/${deliveryId}`, "POST", payload);
}