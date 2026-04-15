import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const JWT_COOKIE_NAME = "auth_token";

const AUTH_USER_TYPES = ["OWNER", "CUSTOMER", "ADMIN"] as const;

export type AuthUserType = (typeof AUTH_USER_TYPES)[number];

type AuthTokenPayload = JWTPayload & {
  sub: string;
  email: string;
  userType: AuthUserType;
};

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return new TextEncoder().encode(secret);
}

export async function signAuthToken(payload: {
  sub: string;
  email: string;
  userType: AuthUserType;
}) {
  return new SignJWT({ email: payload.email, userType: payload.userType })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.userType !== "string" ||
      !AUTH_USER_TYPES.includes(payload.userType as AuthUserType)
    ) {
      return null;
    }

    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function getDashboardPathForUserType(userType: AuthUserType) {
  if (userType === "OWNER") {
    return "/dashboard/owner";
  }

  if (userType === "ADMIN") {
    return "/dashboard/admin";
  }

  return "/dashboard/customer";
}

export function shouldUseSecureCookie(request?: Request) {
  const override = process.env.AUTH_COOKIE_SECURE;

  if (override === "true") {
    return true;
  }

  if (override === "false") {
    return false;
  }

  if (!request) {
    return process.env.NODE_ENV === "production";
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }

  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return process.env.NODE_ENV === "production";
  }
}
