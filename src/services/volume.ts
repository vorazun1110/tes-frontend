import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, Volume } from "@/types/api";

export async function fetchVolumes(): Promise<ApiResponse<Volume[]>> {
  return await apiGet<ApiResponse<Volume[]>>("/volumes");
}

export async function updateVolume(
  volumeId: number,
  payload: Partial<Volume>
): Promise<ApiResponse<Volume>> {
  return await apiAction<ApiResponse<Volume>>(`/volumes/${volumeId}`, "PUT", payload);
}

export async function createVolume(payload: Partial<Volume>): Promise<ApiResponse<Volume>> {
  return await apiAction<ApiResponse<Volume>>(`/volumes`, "POST", payload);
}

export async function deleteVolume(volumeId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/volumes/${volumeId}`, "DELETE");
}
