import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const localStorageKey = "react-flow";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
