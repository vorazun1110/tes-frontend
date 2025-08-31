import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, Truck, TruckPayload } from "@/types/api";

export async function fetchTrucks(): Promise<ApiResponse<Truck[]>> {
  return await apiGet<ApiResponse<Truck[]>>("/trucks");
}

export async function updateTruck(
  truckId: number,
  payload: Partial<TruckPayload>
): Promise<ApiResponse<Truck>> {
  return await apiAction<ApiResponse<Truck>>(`/trucks/${truckId}`, "PUT", payload);
}

export async function createTruck(payload: TruckPayload): Promise<ApiResponse<Truck>> {
  return await apiAction<ApiResponse<Truck>>(`/trucks`, "POST", payload);
}

export async function deleteTruck(truckId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/trucks/${truckId}`, "DELETE");
}
