import { jwtDecode } from "jwt-decode";

export function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role || decoded.authorities?.[0]?.replace("ROLE_", "");
    } catch (err) {
        return null;
    }
}