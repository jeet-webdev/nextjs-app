export type UserType = "OWNER" | "CUSTOMER" | "ADMIN";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  createdAt: string;
};
export const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  userType: "CUSTOMER" as UserType, 
};
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
};

export type FormState = {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: UserType;
};

export const USER_TYPE_OPTIONS: UserType[] = [
  "OWNER",
  "CUSTOMER",
  "ADMIN",
];

export function getCreatableUserTypes(userType: UserType | null | undefined): UserType[] {
  if (userType === "ADMIN") {
    return [...USER_TYPE_OPTIONS];
  }

  if (userType === "OWNER") {
    return ["CUSTOMER"];
  }

  return [];
}

export function getDashboardPathForUserType(userType: UserType): string {
  if (userType === "ADMIN") {
    return "/dashboard/admin";
  }

  if (userType === "OWNER") {
    return "/dashboard/owner";
  }

  return "/dashboard/customer";
}
