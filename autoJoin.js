const { CronJob } = require('cron');
const sorter = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
};
const browser = n => exec(`${(process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open')} ${n}`);
/**
 * 
 * @param {Number} day Integer representing the day. Sunday is 0. I'm sure you can figure out the rest.
 * @param {Array.<{start: String, link: String,}>} courses Must contain a start and a link. The start is formated as such: hour:minutes. I'm sure you know what a link is
 */
function addCron(day, start, link){

    /**
     * This should work on Linux, Mac and Windows. 
     * I know it works on Windows, not sure about the other two. 
     * If it doesn't work on your OS, fork and fix.
     * Or don't. Just don't complain to me.
     */

    const [hour, min] = start.split`:`;
    new CronJob({

        cronTime : `00 ${min} ${hour} * * ${day}`,
        onTick : ()=>browser(link),
        start : true,
        runOnInit : false,
        timeZone : 'US/Eastern'
    });
}

module.exports = {

    addCron,
    sorter
};