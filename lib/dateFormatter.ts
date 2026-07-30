export interface FormatDateOptions {
  includeTime?: boolean;
  dateFormat?: "short" | "medium" | "long"; // e.g., "01/08/2026", "1 Aug 2026", "1 August 2026"
  timeFormat?: "12h" | "24h";
}

/**
 * Formats ISO strings, standard Date strings, Date instances, and Epoch timestamps.
 */
export function formatDate(
  dateInput: string | Date | number | null | undefined,
  options: FormatDateOptions = {}
): string {
  if (!dateInput) return "N/A";

  const {
    includeTime = true,
    dateFormat = "medium",
    timeFormat = "12h",
  } = options;

  let parsedDate: Date;

  if (dateInput instanceof Date) {
    parsedDate = dateInput;
  } else if (typeof dateInput === "number") {
    parsedDate = new Date(dateInput);
  } else {
    // Sanitize custom trailing strings like " (India Standard Time) 03:13:00"
    // Extract valid date string before extra trailing time patterns if necessary
    const cleanedString = dateInput.trim();
    parsedDate = new Date(cleanedString);

    // Fallback cleanup if native JS Date constructor returns Invalid Date
    if (isNaN(parsedDate.getTime())) {
      const sanitized = cleanedString.replace(/\s\d{2}:\d{2}:\d{2}$/, "");
      parsedDate = new Date(sanitized);
    }
  }

  // Handle unparseable strings gracefully
  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  // Define date formatting style
  const dateStyleMap: Record<"short" | "medium" | "long", Intl.DateTimeFormatOptions["day"]> = {
    short: "2-digit",
    medium: "numeric",
    long: "numeric",
  };

  const monthStyleMap: Record<"short" | "medium" | "long", Intl.DateTimeFormatOptions["month"]> = {
    short: "2-digit",
    medium: "short",
    long: "long",
  };

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: dateStyleMap[dateFormat],
    month: monthStyleMap[dateFormat],
    year: "numeric",
  };

  if (includeTime) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
    formatOptions.hour12 = timeFormat === "12h";
  }

  return new Intl.DateTimeFormat("en-GB", formatOptions).format(parsedDate);
}