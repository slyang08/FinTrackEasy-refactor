import { format, utcToZonedTime } from "date-fns-tz";

const TORONTO_TIME_ZONE = "America/Toronto";

export function formatToTorontoTime(dateISOString) {
    const zonedDate = utcToZonedTime(dateISOString, TORONTO_TIME_ZONE);
    return format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone: TORONTO_TIME_ZONE });
}

export function formatToLocalTime(dateISOString) {
    const localDate = new Date(dateISOString);
    return localDate.toLocaleString();
}
