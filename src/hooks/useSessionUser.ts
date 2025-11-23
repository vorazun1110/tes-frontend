import { useEffect, useState } from "react";
import { getToken, getUserFromToken } from "@/lib/auth";
import { User } from "@/types/api";

export function useSessionUser() {
    const [sessionUser, setSessionUser] = useState<User | null>(null);

    useEffect(() => {
        const token = getToken();
        const user = getUserFromToken<User>(token);
        setSessionUser(user ?? null);
    }, []);

    return sessionUser;
}
