import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, Distance, DistancePayload } from "@/types/api";

export async function fetchDistances(): Promise<ApiResponse<Distance[]>> {
  return await apiGet<ApiResponse<Distance[]>>("/fuel-location-distances");
}

export async function updateDistance(
  locationId: number,
  payload: Partial<DistancePayload>
): Promise<ApiResponse<Distance>> {
  return await apiAction<ApiResponse<Distance>>(`/fuel-location-distances/${locationId}`, "PUT", payload);
}

export async function createDistance(payload: Partial<DistancePayload>): Promise<ApiResponse<Distance>> {
  return await apiAction<ApiResponse<Distance>>(`/fuel-location-distances`, "POST", payload);
}

export async function deleteDistance(locationId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/fuel-location-distances/${locationId}`, "DELETE");
}
