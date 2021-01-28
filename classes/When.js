const fields = ['day', 'start', 'end'];
const { sorter } = require('../commons');


/**
 * Time of day within a weekday where a class is taking place
 * @class
 * @constructor
 * @public
*/
  class When {

    #day;
    #start;
    #end;
    
    constructor(day, start, end){

        if(typeof day === 'string'){

            this.#day = day;
            this.#start = start;
            this.#end = end;
        }else{

            this.#day = day.day;
            this.#start = day.start;
            this.#end = day.end;
        }
        
    }

    /**
     * The day of the week represented as a its natural numerical equivalent
     * @readonly
     * @returns {Number}
     */
    get dayAsNumber(){
        return sorter[this.day];
    }

    /**
     * Day of the week as a String
     * @memberof When
     * @returns {string}
     */
    get day(){return this.#day;}

    /**
     * Start of the course formatted as HH:mm
     * @memberof When
     * @returns {string}
     */
    get start(){return this.#start;}

    /**
     * End of the course formatted as HH:mm
     * @memberof When
     * @returns {string}
     */
    get end(){return this.#end;}

    set day(day){this.#day=day;}

    set start(start){this.#start=start;}

    set end(end){this.#end=end;}
}

module.exports = When;