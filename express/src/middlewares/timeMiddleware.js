// express/src/middlewares/timeMiddleware.js
import { formatToTorontoTime } from "../utils/timeUtils.js";

export const TorontoTimeMiddleware = (req, res, next) => {
    if (req.body.date) {
        req.body.date = formatToTorontoTime(req.body.date);
    }
    if (req.body.startDate) {
        req.body.startDate = formatToTorontoTime(req.body.startDate);
    }
    if (req.body.endDate) {
        req.body.endDate = formatToTorontoTime(req.body.endDate);
    }
    if (req.body.targetDate) {
        req.body.targetDate = formatToTorontoTime(req.body.targetDate);
    }
    next();
};
