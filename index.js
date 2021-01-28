/**
 * Path to your schedule represented as a json.
 * See README for the expected structure
 */
const PATH = `/home/nariman/Desktop/Zoomer/schedule.json`

/**
 * Imports
 * NOTE: you just need to install colors and yargs-parser
 */
const colors = require('colors');
const arg = require('yargs-parser');
const { readFileSync } = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const rl = readline.createInterface({input : process.stdin, output : process.stdout});
const sprintf = require('sprintfjs');
const { DateTime } = require('luxon');

const { addCron } = require('./autoJoin.js');
const { sorter, getDay, genColor, dateToNum: toNum } = require('./commons/index.js');
const Course = require('./classes/Course');
const Zoom = require('./classes/Zoom.js');
const Schedule = require('./classes/Schedule');
const When = require('./classes/When');

//Helper functions
function print({ name, start, end, zoom, autojoin }, v, color = genColor.next().value){

    const {id, pwd, link} = zoom;

    if(v){

        const willOrWont = autojoin && 'will' || "won't";
        const toPrint = sprintf('\t%-80s from %-4s\tto\t%-4s\t%-8s autojoin %-20s %-20s %-50s', name, start, end, willOrWont, id, pwd, link);
        return console.log(toPrint[color]);
    }

    const toPrint = sprintf('\t%-80s%-20s%-20s%-50s', name, id, pwd, link)
    console.log(toPrint[color]);
}



//Main
(() =>{

    /**
     * @type {[Course]}
     */
    const _courses = [];
    
    /**@type {Schedule} */
    const schedule = new Schedule(_courses);

    const { courses, offset } = JSON.parse(readFileSync(PATH));

    // Parses schedule from the JSON and loads the data into the Schedule object
    for(const { name, teacher, when, zoom, autojoin } of courses){
        let id, pwd, link;
        if(zoom){
            id = zoom.id;
            pwd = zoom.pwd;
            link = zoom.link;
        }
        
        for(const foo of when){
            
            const [day, [start, end]] = foo;
            
            if(!zoom){
                id = foo[2][0];
                pwd = foo[2][1];
                link = foo[2][2];
            }

            const betterId = id.replace(/\s/g, '');
            const _zoom = new Zoom(betterId, pwd, link);
            const _when = new When(day, start, end);
            const _course = new Course(teacher, name, _zoom, _when, autojoin);

            // if(BY_DAY.has(day)){
            //     BY_DAY.get(day).push(_course);
            // }else{
            //     BY_DAY.set(day, [_course]);
            // }
            // if(autojoin){
            //     addCron(sorter[day], start, link, offset);
            // }
    
            _courses.push(_course);
        }
    }

    let BY_DAY = schedule.toMap();

    BY_DAY.forEach(x => x.sort((a, b) => toNum(a.when.start) - toNum(b.when.start)));

    BY_DAY = new Map([...BY_DAY].sort((a, b) => sorter[a[0]] - sorter[b[0]])); // Sort by day

    // Check if running in daemon mode or not

    function callParse(e){

        let { _: command, d = "", v = false, a = false } = arg(e);
    
        const DAYS = Object.keys(sorter);

        d = DAYS.find(n => new  RegExp(d.toLowerCase()).test(n.toLowerCase()));

        command = command.pop();
        const CONT = { BY_DAY, d, v, a};
        const OPTS = {...CONT};
        delete OPTS.BY_DAY;

        parseCommand(command, OPTS).call(CONT);
    }
    rl.on('line', callParse);

    const dx = process.argv.includes('dx');

    if(dx){

        callParse(process.argv.slice(3).join` `);
        rl.close();
        process.exit(0);
    }

    schedule.cleanCourses();
    
})();

function parseCommand(name, opts){

    const names = Object.getOwnPropertyNames(opts);
    
    const commands = {
        dotw : {
            reqOpt : ['d'],
            aliases : ['dtw', 'dotw'],
            core : function(){

                const { d, v, BY_DAY } = this;

                console.log('\n');
                for(const foo of BY_DAY.get(d))
                    print(foo, v);
            }
        },
        all : {
            reqOpt : null,
            aliases : ['a'],
            core : function(){

                for(const [day, content] of this.BY_DAY){

                    const { value: color } = genColor.next();
                    console.log(day[color]);
                    content.forEach(n => print(n, true, color));
                }
            }
        },
        next : {
            reqOpt : null,
            aliases : ['n'],
            core : function(){

                const { a, v, BY_DAY } = this;


                const foo = new Date();
                /**@type {Course} */
                const today = BY_DAY.get(getDay());
                const [hour, minute] = [foo.getHours(), foo.getDay()];

                if(a){
                    for(const c of today)
                        if(toNum(c.start, new Date(foo)) > foo)
                            print(c, v);
                }
                else{

                    const rest = today.find( ({ when: { start } }) => toNum(start, new Date(foo)) > foo) || Course.EMPTY_DAY;
                    print(rest, v);
                }
                
            }
        },
        today : {
            reqOpt : null,
            aliases : ['tod', 'td', 'day'],
            core : function(){

                const { v, BY_DAY } = this;

                for(const course of BY_DAY.get(getDay()) || [ Course.EMPTY_DAY ])
                    print(course, v);
            }
        },
        tomorrow: {

            reqOpt : null,
            aliases : ['tm', 'tmr', 'tmrw', 'tomorrow'],
            core : function(){

                const { v, BY_DAY } = this;

                for(const course of BY_DAY.get(getDay(1)) || [ Course.EMPTY_DAY ])
                    print(course, v);
            }
        },
        exit : {
            reqOpt : null,
            aliases : ['e', 'c', 'close', 'done'],
            core : function(){

                console.log('Goodbye');
                rl.close();
                process.exit(0);
            }
        }
    }

    for(const comm in commands){

        if(comm == name || commands[comm].aliases.includes(name))
            if(!commands[comm].reqOpt)
                return commands[comm].core
            else if(commands[comm].reqOpt && commands[comm].reqOpt.every(x => names.includes(x)))
                return commands[comm].core;
    }

    return () => console.log('Invalid input');
}

/**
 * Adds course to Cron with offset if it isn't a back to back course
 * 
 * @param {Course} course Course to add to Cron for autojoin
 * @param {Map<string, [Course]>} BY_DAY Map of Courses aggregated by days of the week 
 */
function addCronWithContextualOffset(course, BY_DAY, offset){

    const { day, start } = course.when;

    const coursesToday = BY_DAY.get(day).filter(n => n !== course);
    courses.sort((a, b) => toNum(a.start) - toNum(b.start)); // Sort courses by their start time
    for(const _course of courses){

        const a = 1;
    }

}