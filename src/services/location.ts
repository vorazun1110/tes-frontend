import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, Location } from "@/types/api";

export async function fetchLocations(type?: "from" | "to"): Promise<ApiResponse<Location[]>> {
  const query = type ? `?type=${type}` : "";
  return await apiGet<ApiResponse<Location[]>>(`/fuel-locations${query}`);
}

export async function updateLocation(
  locationId: number,
  payload: Partial<Location>
): Promise<ApiResponse<Location>> {
  return await apiAction<ApiResponse<Location>>(`/fuel-locations/${locationId}`, "PUT", payload);
}

export async function createLocation(payload: Partial<Location>): Promise<ApiResponse<Location>> {
  return await apiAction<ApiResponse<Location>>(`/fuel-locations`, "POST", payload);
}

export async function deleteLocation(locationId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/fuel-locations/${locationId}`, "DELETE");
}
