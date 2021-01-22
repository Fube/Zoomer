/**
 * Path to your schedule represented as a json.
 * See README for the expected structure
 */
const PATH = `C:\\Users\\Nariman\\Google Drive\\Sem6\\schedule.json`

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
const { sorter, addCron } = require('./autoJoin.js');
const sprintf = require('sprintfjs');

//Helper functions
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
function format(string, len){
    return string.padEnd(len, " ");
}
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
function getDay(){
    return Object.entries(sorter)[new Date().getDay() - 1][0];
}
function toNum(s, z = new Date()){

    const [hour, min] = s.split`:`;
    z.setHours(hour);
    z.setMinutes(min);
    return z;
}



//Main
(() =>{

    const { courses, offset } = JSON.parse(readFileSync(PATH));
    let BY_DAY = new Map();

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

            if(BY_DAY.has(day)){
                BY_DAY.get(day).push({ name, start, end, zoom: {id : betterId, pwd, link}, autojoin});
            }else{
                BY_DAY.set(day, [{ name, start, end, zoom: {id : betterId, pwd, link}, autojoin }]);
            }
            if(autojoin){
                addCron(sorter[day], start, link, offset);
			}
        }
    }

    BY_DAY.forEach(x => x.sort(({ start }, { start:start2 }) => toNum(start) - toNum(start2)));

    BY_DAY = new Map([...BY_DAY].sort((a, b) => sorter[a[0]] - sorter[b[0]]));

    rl.on('line', e => {

        let { _: command, d = "", v = false, a = false } = arg(e);

        const DAYS = Object.keys(sorter);

        d = DAYS.find(n => new  RegExp(d.toLowerCase()).test(n.toLowerCase()));

        command = command.pop();
        const CONT = { BY_DAY, d, v, a};
        const OPTS = {...CONT};
        delete OPTS.BY_DAY;

        parseCommand(command, OPTS).call(CONT);

    });
})();

function parseCommand(name, opts){

    const names = Object.getOwnPropertyNames(opts);
    
    const commands = {
        dotw : {
            reqOpt : ['d'],
            aliases : ['dtw'],
            core : function(){

                with(this){
                    console.log('\n');
                    for(const foo of BY_DAY.get(d)){
                        print(foo, v)
                    }
                }
            }
        },
        all : {
            reqOpt : null,
            aliases : ['a'],
            core : function(){

                with(this){
                    for(const [day, content] of BY_DAY){

                        const { value: color } = genColor.next();
                        console.log(day[color]);
                        content.forEach(n => print(n, true, color));
                    }
                }
            }
        },
        next : {
            reqOpt : null,
            aliases : ['n'],
            core : function(){

                with(this){

                    const foo = new Date();
                    const 
                        today = BY_DAY.get(getDay()),
                        [hour, minute] = [foo.getHours(), foo.getDay()];

                    if(a){
                        for(const c of today)
                            if(toNum(c.start, new Date(foo)) > foo)
                                print(c, v);
                    }
                    else
                        print(today.find(({ start }) => toNum(start, new Date(foo)) > foo), v);
                }
            }
        },
        today : {
            reqOpt : null,
            aliases : ['t', 'tod', 'td', 'day'],
            core : function(){

                with(this)
                    for(const course of BY_DAY.get(getDay()))
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