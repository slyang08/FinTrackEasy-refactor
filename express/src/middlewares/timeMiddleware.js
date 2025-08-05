// express/src/middlewares/timeMiddleware.js
import { formatToTorontoTime } from "../utils/timeUtils.js";

export const TorontoTimeMiddleware = (req, res, next) => {
    if (req.body && typeof req.body === "object") {
        const dateFields = ["date", "startDate", "endDate", "targetDate"];
        dateFields.forEach((field) => {
            if (req.body[field]) {
                req.body[field] = formatToTorontoTime(req.body[field]);
            }
        });
    }
    next();
};
