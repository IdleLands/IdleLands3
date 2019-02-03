"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Festival {
    constructor(opts) {
        if (opts.hourDuration) {
            const date = new Date();
            date.setHours(date.getHours() + opts.hourDuration);
            opts.endDate = date;
        }
        this.endDate = opts.endDate;
        this.name = opts.name;
        this.bonuses = opts.bonuses || {}; // { stat: multiplier }
        this.startedBy = opts.startedBy;
    }
}
exports.Festival = Festival;
