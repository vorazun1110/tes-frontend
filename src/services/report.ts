import { apiGet } from "@/lib/api";
import { ReportResponse } from "@/types/api";

export async function fetchReport(
  startDate: string,
  endDate: string,
  driverId: string,
): Promise<ReportResponse> {
  const url = `/report?startDate=${startDate}&endDate=${endDate}&driverId=${driverId}`;
  const res = await apiGet<ReportResponse>(url);
  return res;
}
