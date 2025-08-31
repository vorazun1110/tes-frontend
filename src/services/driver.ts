import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, Driver } from "@/types/api";

export async function fetchDrivers(): Promise<ApiResponse<Driver[]>> {
  return await apiGet<ApiResponse<Driver[]>>("/drivers");
}

export async function updateDriver(
  driverId: number,
  payload: Partial<Driver>
): Promise<ApiResponse<Driver>> {
  return await apiAction<ApiResponse<Driver>>(`/drivers/${driverId}`, "PUT", payload);
}

export async function createDriver(payload: Partial<Driver>): Promise<ApiResponse<Driver>> {
  return await apiAction<ApiResponse<Driver>>(`/drivers`, "POST", payload);
}

export async function deleteDriver(driverId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/drivers/${driverId}`, "DELETE");
}
