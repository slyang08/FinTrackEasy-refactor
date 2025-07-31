// express/src/utils/timeUtils.js
import { format, utcToZonedTime } from "date-fns-tz";

const TIME_ZONE = "America/Toronto";

export function formatToTorontoTime(dateISOString) {
    const zonedDate = utcToZonedTime(dateISOString, TIME_ZONE);
    return format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone: TIME_ZONE });
}
