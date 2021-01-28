const { CronJob } = require('cron');
const { sorter } = require('./commons');

const { exec } = require('child_process');

const browser = n => exec(`${(process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open')} ${n}`);
/**
 * 
 * @param {Number} day Integer representing the day. Sunday is 0. I'm sure you can figure out the rest.
 * @param {String} start A string formatted as HH:mm
 * @param {String} link You know what a link is
 * @param {Number} offset A integer representing how early you should join (in minutes)
 */
function addCron(day, start, link, offset=0){

    /**
     * This should work on Linux, Mac and Windows. 
     * I know it works on Windows, not sure about the other two. 
     * If it doesn't work on your OS, fork and fix.
     * Or don't. Just don't complain to me.
     */

    let [hour, min] = start.split`:`.map(Number);
    let foobar = hour*60+min-offset;
    [hour, min] = [Math.floor(foobar/60), foobar%60];
    if(String(min).length === 1){
        min = '0'+String(min)
    }

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