import { apiGet, apiAction } from "@/lib/api";
import { DailyDeliveryResponse, Delivery, DeliveryDetail, DeliveryReceivePayload, DeliveryUpsertPayload } from "@/types/deliveries";
import { ApiResponse } from "@/types/api";

export async function fetchDeliveries(date: string): Promise<ApiResponse<DailyDeliveryResponse>> {
  return await apiGet<ApiResponse<DailyDeliveryResponse>>(`/deliveries?date=${date}`);
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

export async function receiveDelivery(deliveryId: number, payload: DeliveryReceivePayload): Promise<ApiResponse<Delivery>> {
  return await apiAction<ApiResponse<Delivery>>(`/deliveries/receive/${deliveryId}`, "POST", payload);
}

export async function getDelivery(deliveryId: number): Promise<ApiResponse<DeliveryDetail>> {
  return await apiGet<ApiResponse<DeliveryDetail>>(`/deliveries/${deliveryId}`);
}