import { apiGet } from '@/lib/api';
import { ApiResponse, ReportResponse } from '@/types/api';

export async function fetchReport(
  startDate: string,
  endDate: string,
  driverId: string
): Promise<ApiResponse<ReportResponse>> {
  const url = `/report?startDate=${startDate}&endDate=${endDate}&driverId=${driverId}`;
  return await apiGet<ApiResponse<ReportResponse>>(url);
}
