const { time } = require('cron');
const { DateTime } = require('luxon');

const sorter = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
};

const genColor = (function* (){

    const COLORS = [
        "brightGreen",
        "brightYellow",
        "brightMagenta",
        "brightCyan",
		
    ];
    for(let color = 0;;color++)
        yield COLORS[color % COLORS.length];
})();

/**
 * 
 * @param {string} source A time in HH:mm format
 * @param {Date} target A JavaScript Date to set the hours and minutes of
 */
function dateToNum(source, target = new Date()){

    const [hour, min] = source.split`:`;
    target.setHours(hour);
    target.setMinutes(min);
    return target;
}

/**
 * Shorthand for [Luxon's DateTime]{@link DateTime} fromFormat
 *
 * @param {string} timeAsString Time formatted as HH:mm String
 * @returns {DateTime}
 */
const dateTimeFromString = (timeAsString) => {

    const HHmm = DateTime.fromFormat(timeAsString, 'HH:mm');
    const Hmm = DateTime.fromFormat(timeAsString, 'H:mm');

    return HHmm.ordinal ? HHmm : Hmm;
};

module.exports = {

    sorter,
    getDay: (offset=0) => Object.entries(sorter)[(new Date().getDay() + offset) % 7][0],
    genColor,
    dateToNum,
    dateTimeFromString,
};