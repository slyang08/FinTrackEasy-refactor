// express/src/utils/timeUtils.js
import { DateTime } from "luxon";

const TIME_ZONE = "America/Toronto";

export function formatToTorontoTime(dateISOString) {
    const zonedDate = DateTime.fromISO(dateISOString, { zone: TIME_ZONE });
    return zonedDate.toFormat("yyyy-MM-dd HH:mm:ss");
}
