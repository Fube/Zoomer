/**
 * Path to your schedule represented as a json.
 * See README for the expected structure
 */
const PATH = ``

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

    let foo = "\t"+format(name, 20);

    if(v){
        /* 
         * Is it hard to read? Yea.
         * Do you need to understand it? Too bad.
         */
        foo += format(`${format(` from ${start} to ${end}`, 25)} ${format(autojoin?'will':"won't", 5)} autojoin`, 50);
    }
    foo += format(`${id}\t${pwd}\t${link}`, 20);
    console.log(foo[color]);
}
function getDay(){
    console.log('\n\n\nI GOT CALLED\n\n\n')
    console.log(Object.entries(sorter)[new Date().getDay() - 1][0])
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

    const { courses } = JSON.parse(readFileSync(PATH));
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
                addCron(sorter[day], start, link);
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