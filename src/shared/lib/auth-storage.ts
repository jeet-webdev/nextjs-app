import type { UserType } from "@/features/users/types";

export const AUTH_ROLE_STORAGE_KEY = "auth.role";

// export function setStoredUserRole(role: UserType) {
//   window.localStorage.setItem(AUTH_ROLE_STORAGE_KEY, role);
// }

export function getStoredUserRole() {
  return window.localStorage.getItem(AUTH_ROLE_STORAGE_KEY);
}

export function clearStoredUserRole() {
  window.localStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
}


export function setStoredUserRole(role: UserType) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_ROLE_STORAGE_KEY, role);
    console.log("Role stored:", role);
  }
}
