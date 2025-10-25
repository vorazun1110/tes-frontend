import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, Trailer, TrailerPayload } from "@/types/api";

export async function fetchTrailers(): Promise<ApiResponse<Trailer[]>> {
  return await apiGet<ApiResponse<Trailer[]>>("/trailers");
}

export async function updateTrailer(
  trailerId: number,
  payload: Partial<TrailerPayload>
): Promise<ApiResponse<Trailer>> {
  return await apiAction<ApiResponse<Trailer>>(`/trailers/${trailerId}`, "PUT", payload);
}

export async function createTrailer(payload: TrailerPayload): Promise<ApiResponse<Trailer>> {
  return await apiAction<ApiResponse<Trailer>>(`/trailers`, "POST", payload);
}

export async function deleteTrailer(trailerId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/trailers/${trailerId}`, "DELETE");
}
