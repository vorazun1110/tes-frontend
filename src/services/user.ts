import { apiGet, apiAction } from "@/lib/api";
import { ApiResponse, User, UserPayload } from "@/types/api";

export async function fetchUsers(): Promise<ApiResponse<User[]>> {
  return await apiGet<ApiResponse<User[]>>("/users");
}

export async function updateUser(
  userId: number,
  payload: Partial<UserPayload>
): Promise<ApiResponse<User>> {
  return await apiAction<ApiResponse<User>>(`/users/${userId}`, "PUT", payload);
}

export async function createUser(payload: UserPayload): Promise<ApiResponse<User>> {
  return await apiAction<ApiResponse<User>>(`/users`, "POST", payload);
}

export async function deleteUser(userId: number): Promise<ApiResponse<null>> {
  return await apiAction<ApiResponse<null>>(`/users/${userId}`, "DELETE");
}
