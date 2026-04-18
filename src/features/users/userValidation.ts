import { USER_TYPE_OPTIONS, type UserType } from "@/features/users/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{10,20}$/;

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
};

export type UserFormValidationErrors = Partial<
  Record<keyof UserFormValidationInput, string>
>;

const DEFAULT_OPTIONS: Required<UserFormValidationOptions> = {
  requireName: true,
  requireEmail: true,
  requirePhone: true,
  requirePassword: false,
  requireConfirmPassword: false,
  validatePasswordConfirmation: false,
  requireUserType: false,
  allowedUserTypes: USER_TYPE_OPTIONS,
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

  if (settings.requireName && !name) {
    errors.name = "Name is required.";
  }

  if (settings.requireEmail && !email) {
    errors.email = "Email is required.";
  } else if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Invalid email address.";
  }

  if (settings.requirePhone && !phone) {
    errors.phone = "Phone number is required.";
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
