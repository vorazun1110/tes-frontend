import { apiGet } from "@/lib/api";
import { ApiResponse, FuelType } from "@/types/api";

export async function fetchFuelTypes(): Promise<ApiResponse<FuelType[]>> {
  return await apiGet<ApiResponse<FuelType[]>>("/fuel-types");
}
