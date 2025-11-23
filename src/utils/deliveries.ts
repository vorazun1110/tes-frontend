import { deliveryPermissions } from "@/data/deliveries";

export const canAccess = (action: keyof typeof deliveryPermissions, role?: string): boolean => {
    if (!role) return false;
    return deliveryPermissions[action]?.includes(role);
};
