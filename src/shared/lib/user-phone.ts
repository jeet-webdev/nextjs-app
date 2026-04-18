const PHONE_PATTERN = /^\+?[\d\s()-]+$/;


// export function normalPhoneInput(value: unknown): string{
//     if (typeof value === "string") {
//         return value.trim();
//     }
//     if (typeof value === "bigint"){
//         return value.toString();
//     }
//     if(typeof value === "number" && Number.isFinite(value) && Number.isInteger(value)){
//         return String(value);
//     }
//     if (value === null || value === undefined) {
//         return "";
//     }
//     return "";

// }



export function normalizePhoneInput(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "number" && Number.isFinite(value) && Number.isInteger(value)) {
    return String(value);
  }

  return "";
}

export function parsePhoneForStorage(value: unknown): bigint | null {
  const phone = normalizePhoneInput(value);

  if (!phone || !PHONE_PATTERN.test(phone)) {
    return null;
  }

  const digitsOnly = phone.replace(/\D/g, "");

  return digitsOnly ? BigInt(digitsOnly) : null;
}

export function serializePhone(value: unknown): string {
  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "number" && Number.isFinite(value) && Number.isInteger(value)) {
    return String(value);
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

export function serializeUserPhone<T extends { phone: unknown }>(user: T): Omit<T, "phone"> & { phone: string } {
  return {
    ...user,
    phone: serializePhone(user.phone),
  };
}