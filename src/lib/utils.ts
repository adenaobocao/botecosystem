import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serializes Prisma data for client components.
 * Converts Decimal to number via JSON round-trip.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialize<T = any>(data: unknown): T {
  return JSON.parse(JSON.stringify(data, (_key, value) =>
    value !== null && typeof value === "object" && typeof value.toNumber === "function"
      ? value.toNumber()
      : value
  ));
}
