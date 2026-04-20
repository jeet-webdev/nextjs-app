// import { USER_TYPE_OPTIONS, type UserType } from "@/features/users/types";
import { USER_TYPE_MAP, type UserType } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const PHONE_PATTERN = /^\+?[\d\s()-]{6,20}$/;
const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;

export type UserFormValidationInput = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  userType?: UserType | "" | null;
};

export type UserFormValidationOptions = {
  requireName?: boolean;
  requireEmail?: boolean;
  requirePhone?: boolean;
  requirePassword?: boolean;
  requireConfirmPassword?: boolean;
  validatePasswordConfirmation?: boolean;
  requireUserType?: boolean;
  allowedUserTypes?: readonly UserType[];
  minimumPasswordLength?: number;
  minimumNameLength?: number;
  minimumPhoneLength?: number;
};

export type UserFormValidationErrors = Partial<
  Record<keyof UserFormValidationInput, string>
>;

const DEFAULT_OPTIONS: Required<UserFormValidationOptions> = {
  requireName: true,
  minimumNameLength: 3,
  requireEmail: true,
  requirePhone: true,
  minimumPhoneLength:8,
  requirePassword: false,
  requireConfirmPassword: false,
  validatePasswordConfirmation: false,
  requireUserType: false,
  allowedUserTypes: Object.keys(USER_TYPE_MAP) as UserType[],
  minimumPasswordLength: 6,
};

export function validateUserForm(
  form: UserFormValidationInput,
  options: UserFormValidationOptions = {},
): UserFormValidationErrors {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const errors: UserFormValidationErrors = {};

  const name = form.name?.trim() ?? "";
  const email = form.email?.trim() ?? "";
  const phone = form.phone?.trim() ?? "";
  const password = form.password ?? "";
  const confirmPassword = form.confirmPassword ?? "";
  const userType = form.userType ?? "";

  if (settings.requireName && !name.trim()) {
    errors.name = "Name is required.";
  } else if (name && name.trim().length < settings.minimumNameLength) {
    errors.name = `Name must be at least ${settings.minimumNameLength} characters.`;
  }

  if (settings.requireEmail && !email) {
    errors.email = "Email is required.";
  } else if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Invalid email address.";
  }

  if (settings.requirePhone && !phone) {
    errors.phone = "Phone number is required.";
  }else if(phone && phone.trim().length < settings.minimumPhoneLength){
    errors.phone = `phone number must be at least ${settings.minimumPhoneLength} characters`;
  } else if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Invalid phone number.";
  }

  if (settings.requirePassword && !password.trim()) {
    errors.password = "Password is required.";
  } else if (password && password.trim().length < settings.minimumPasswordLength) {
    errors.password = `Password must be at least ${settings.minimumPasswordLength} characters.`;
  }

  if (settings.requireConfirmPassword && !confirmPassword.trim()) {
    errors.confirmPassword = "Confirm password is required.";
  }

  if (
    settings.validatePasswordConfirmation &&
    (password.trim().length > 0 || confirmPassword.trim().length > 0) &&
    password !== confirmPassword
  ) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (settings.requireUserType && !userType) {
    errors.userType = "User type is required.";
  } else if (
    userType &&
    !settings.allowedUserTypes.includes(userType as UserType)
  ) {
    errors.userType = "Invalid user type.";
  }

  return errors;
}

export function hasUserFormErrors(errors: UserFormValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
