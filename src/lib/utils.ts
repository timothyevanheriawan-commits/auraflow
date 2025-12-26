import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FIX: Tambahkan parameter currency dan locale
export const formatCurrency = (amount: number, currency = "IDR") => {
  // Mapping Locale berdasarkan Currency agar formatnya natural
  // IDR -> id-ID (10.000), USD -> en-US (10,000)
  const localeMap: Record<string, string> = {
    IDR: "id-ID",
    USD: "en-US",
    EUR: "de-DE",
    JPY: "ja-JP",
  };

  const locale = localeMap[currency] || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
