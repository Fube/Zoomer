const Zoom = require('./Zoom');
const When = require('./When');
const Course = require('./Course');

/**
 * A struct representing a course within a schedule
 * @class
 * @constructor
 * @public
*/
class Course{

    #zoom;
    #when;
    #teacher;
    #name;

    /**
     * 
     * @param {Zoom} zoom 
     * @param {[When]} when 
     */
    constructor(teacher, name, zoom, when){

        if(zoom instanceof Zoom){
            this.#zoom = zoom;
            this.#when = when;
            this.#teacher = teacher;
            this.#name = name;
        }
        else{
            this.#zoom = zoom.zoom;
            this.#when = zoom.when;
            this.#teacher = zoom.teacher;
            this.#name = zoom.name;
        }
    }

    /**
     * [See]{@link Zoom}
     * @type {Zoom}
     * @readonly
     * @memberof Course
     */
    get zoom(){return zoom;}

    /**
     * [See]{@link When}
     * 
     * @type {When}
     * @readonly
     * @memberof Course
     */
    get when(){return when;}

    /**
     *
     * @readonly
     * @memberof Course
     * @returns {string}
     */
    get teacher(){return this.#teacher;}

    /**
     *
     * @readonly
     * @memberof Course
     * @returns {string}
     */
    get name(){return this.#name;}

    static get EMPTY_DAY(){return {name: 'Nothing', zoom: { id:'', pwd:'', link:'' }}};
}

module.exports = Course;